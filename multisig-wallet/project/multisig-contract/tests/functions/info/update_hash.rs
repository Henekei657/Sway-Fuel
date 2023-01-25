mod success {

    use crate::utils::{
        interface::info::{nonce, update_hash},
        setup::{setup_env, VALID_SIGNER_PK},
    };
    use fuels::{
        contract::abi_encoder::ABIEncoder,
        prelude::{Bits256, ContractId, Identity, Token},
        signers::fuel_crypto::Hasher,
        tx::Bytes32,
        types::{enum_variants::EnumVariants, param_types::ParamType},
    };
    use rand::{rngs::StdRng, Rng, SeedableRng};

    struct Transaction {
        contract_identifier: ContractId,
        data: Bits256,
        destination: Identity,
        nonce: u64,
        value: u64,
    }

    #[ignore]
    #[tokio::test]
    async fn gets_transaction_hash() {
        let (_private_key, deployer, _non_owner) = setup_env(VALID_SIGNER_PK).await.unwrap();

        let mut rng = StdRng::seed_from_u64(1000);
        let data: Bytes32 = rng.gen();
        let data = Bits256(*data);
        let nonce = nonce(&deployer.contract).await.value;

        // Recreate Transaction instance
        let tx = Transaction {
            contract_identifier: deployer.contract.get_contract_id().try_into().unwrap(),
            data,
            destination: Identity::ContractId(
                deployer.contract.get_contract_id().try_into().unwrap(),
            ),
            nonce,
            value: 0,
        };

        // Set tokens for encoding the Transaction instance with ABIEncoder
        let contract_identifier_token = Token::Struct(vec![Token::B256(
            tx.contract_identifier.try_into().unwrap(),
        )]);
        let data_token = Token::B256(tx.data.0);
        let destination_variants = EnumVariants::new(vec![
            (
                String::from("Address"),
                ParamType::Struct {
                    name: String::from("Address"),
                    fields: vec![(String::from("value"), ParamType::B256)],
                    generics: vec![],
                },
            ),
            (
                String::from("ContractId"),
                ParamType::Struct {
                    name: String::from("ContractId"),
                    fields: vec![(String::from("value"), ParamType::B256)],
                    generics: vec![],
                },
            ),
        ])
        .unwrap();

        let destination_enum_selector = Box::new((
            0,
            Token::Struct(vec![Token::B256(match tx.destination {
                Identity::Address(addr) => addr.try_into().unwrap(),
                Identity::ContractId(id) => id.try_into().unwrap(),
            })]),
            destination_variants,
        ));
        let destination_token = Token::Enum(destination_enum_selector);
        let nonce_token = Token::U64(tx.nonce);
        let value_token = Token::U64(tx.value);

        let tx_token = Token::Struct(vec![
            contract_identifier_token,
            data_token,
            destination_token,
            nonce_token,
            value_token,
        ]);

        let encoded_tx_struct = ABIEncoder::encode(&vec![tx_token]).unwrap().resolve(0);
        let expected_hash = Hasher::hash(encoded_tx_struct);

        let response = update_hash(&deployer.contract, data, nonce).await.value;

        assert_eq!(Bits256(expected_hash.into()), response);
    }
}
