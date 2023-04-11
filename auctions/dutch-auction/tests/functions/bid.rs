pub mod passing {
    use fuels::types::{Identity, ContractId};
    use crate::utils::{create_auction, get_contract_instance, bid, auctions_won};

    #[tokio::test]
    async fn can_bid() {
        let (instance, wallet) = get_contract_instance().await;

        create_auction(
            &instance,
            400,
            100,
            2,  // Block height will be 1 at start, then 2 during sending of this tx
            5,
            Identity::Address(wallet.address().into()),
            ContractId::zeroed(),            
        ).await;

        bid(&instance, 1, 400).await;

        assert_eq!(auctions_won(&instance, Identity::Address(wallet.address().into())).await, vec![1]);
    }
}