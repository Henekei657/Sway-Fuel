use fuels::prelude::*;
use test_utils::{
    abi::{exchange::preview_swap_exact_input, SwapExactInputScript},
    data_structures::AMMContract,
    paths::SWAP_EXACT_INPUT_SCRIPT_BINARY_PATH,
    setup::scripts::setup,
    transaction::transaction_inputs_outputs_for_scripts,
};

pub async fn expected_swap_amounts(
    amm: &AMMContract,
    input_amount: u64,
    route: &Vec<AssetId>,
) -> Vec<u64> {
    assert!(route.len() >= 2);
    let (mut i, mut amounts) = (0, vec![input_amount]);

    while i < route.len() - 1 {
        let pair = (*route.get(i).unwrap(), *route.get(i + 1).unwrap());
        let exchange = &amm.pools.get(&pair).unwrap().instance;
        let amount = preview_swap_exact_input(&exchange, amounts[i], pair.0)
            .await
            .value
            .amount;
        amounts.push(amount);
        i += 1;
    }
    amounts
}

#[tokio::test]
async fn can_swap_exact_input_along_route() {
    let (wallet, provider, amm, asset_ids) = setup().await;

    let (inputs, outputs) =
        transaction_inputs_outputs_for_scripts(&wallet, &provider, &amm, &asset_ids).await;

    let route = asset_ids;
    let script_instance =
        SwapExactInputScript::new(wallet.clone(), SWAP_EXACT_INPUT_SCRIPT_BINARY_PATH);
    let input_amount: u64 = 60;

    let amounts = expected_swap_amounts(&amm, input_amount, &route).await;
    let expected_result = amounts[route.len() - 1];

    let result = script_instance
        .main(
            amm.id,
            route
                .clone()
                .into_iter()
                .map(|asset_id| ContractId::new(*asset_id))
                .collect(),
            amounts,
        )
        .with_inputs(inputs)
        .with_outputs(outputs)
        .tx_params(TxParameters::new(None, Some(100_000_000), None))
        .call()
        .await
        .unwrap()
        .value;

    assert_eq!(expected_result, result);
}