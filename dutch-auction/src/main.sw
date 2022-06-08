contract;

use std::{
    address::Address,
    contract_id::ContractId,
    block::height,
    chain::auth::msg_sender,
    assert::assert,
    revert::revert,
    storage::StorageMap,
    token::transfer_to_output,
    context::{msg_amount, call_frames::msg_asset_id},
    result::*,
    identity::Identity,
};

abi MyContract {
    fn get_price() -> u64;
    fn set_beneficiary(new_beneficiary: Address);
    fn bid();
    fn setup_auction(startp: u64, endp: u64, startt: u64, endt: u64);
}

//Set this to your own address
const MY_ADDRESS: b256 = 0x0000000000000000000000000000000000000000000000000000000000000000;

storage {
    startingPrice: u64,
    endingPrice: u64,
    startTime: u64,
    endTime: u64,
    beneficiary: Address = ~Address::from(MY_ADDRESS),
    admin: Address = ~Address::from(MY_ADDRESS),
    ended: bool,
    //Enter the asset id of the currency you want the bid to be in
    asset_id: b256 = 0x0000000000000000000000000000000000000000000000000000000000000000,
}

fn win() {
    // Do stuff on the win event
    transfer_to_output(price(), ~ContractId::from(storage.asset_id), storage.beneficiary);
    storage.ended = true;
}

impl MyContract for Contract {
    fn get_price() -> u64 {
        return price();
    }

    fn set_beneficiary(new_beneficiary: Address) {
        assert(get_sender() == storage.admin);

        storage.beneficiary = new_beneficiary;
    }

    fn bid() {
        //Since this is the dutch auction, first bid wins
        assert(msg_amount() >= price());
        assert(msg_asset_id() == ~ContractId::from(storage.asset_id));
        assert(!storage.ended);

        storage.ended = true;

        if msg_amount() > price() {
            let return_amount = msg_amount() - price();
            transfer_to_output(return_amount, ~ContractId::from(storage.asset_id), get_sender());
        }

        win();
    }

    fn setup_auction(startp: u64, endp: u64, startt: u64, endt: u64) {
        assert(get_sender() == storage.admin);
        assert(startp > endp);
        assert(endt > height());
        assert(startt > height());
        assert(endt > startt);

        storage.startingPrice = startp;
        storage.endingPrice = endp;
        storage.startTime = startt;
        storage.endTime = endt;
        storage.ended = false;
    }
}

fn price() -> u64 {
    let price_difference = storage.startingPrice - storage.endingPrice;
    let duration = storage.endTime - storage.startTime;
    // This is the amount the price will reduce by per block
    let price_shift = price_difference / duration;

    let now = height() - storage.startTime; //Current block height - start will tell us how far we are into the auction now
    //Cap how far we are into the auction by the duration, so price doesnt go into negative or below endprice
    let now = if now > duration {
        duration
    } else {
        now
    };

    //price_shift * now tells us how much the price has reduced by now
    return storage.startingPrice - (price_shift * now);
}

fn get_sender() -> Address {
    // For some reason msg_sender().unwrap() doesnt work
    let unwrapped = 
    if let Result::Ok(inner_value) = msg_sender() {
            inner_value
    } else {
            revert(0);
    };

    let ad = if let Identity::Address(addr) = unwrapped {
        addr
    } else {
        revert(0);
    };
    ad
}
