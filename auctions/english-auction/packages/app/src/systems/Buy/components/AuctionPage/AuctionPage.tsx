import { Stack } from "@fuel-ui/react";
import type { BN } from "fuels";

import { PlaceBid } from "../PlaceBid";

import { AuctionAssetInfo } from "./AuctionAssetInfo";
import { AuctionEndInfo } from "./AuctionEndInfo";

import type { AuctionOutput } from "~/types/contracts/AuctionContractAbi";
import { AuctionIdentityInfo } from "./AuctionIdentityInfo";

interface AuctionPageProps {
  currentAuction: AuctionOutput;
  auctionId: BN;
}

export const AuctionPage = ({
  currentAuction,
  auctionId,
}: AuctionPageProps) => {
  const isSellAssetNFT = Boolean(currentAuction?.sell_asset.NFTAsset);
  const isBidAssetNFT = Boolean(currentAuction?.bid_asset.NFTAsset);

  let sellAsset;
  let sellAssetAmount;
  if (isSellAssetNFT) {
    sellAsset = currentAuction.sell_asset.NFTAsset!;
    sellAssetAmount = "1";
  } else {
    sellAsset = currentAuction.sell_asset.TokenAsset!;
    sellAssetAmount = currentAuction.sell_asset.TokenAsset!.amount.format()!;
  }

  let bidAsset;
  let bidAssetAmount;
  if (isBidAssetNFT) {
    bidAsset = currentAuction.bid_asset.NFTAsset!;
    bidAssetAmount = currentAuction.highest_bidder ? "1" : "0";
  } else {
    bidAsset = currentAuction.bid_asset.TokenAsset!;
    bidAssetAmount = currentAuction.bid_asset.TokenAsset!.amount.format();
  }

  const initialPrice = isBidAssetNFT
    ? "1"
    : currentAuction.initial_price.format()!;

  return (
    <Stack>
      <AuctionAssetInfo
        sellAsset={sellAsset}
        sellAssetAmount={sellAssetAmount}
        isSellAssetNFT={isSellAssetNFT}
        bidAsset={bidAsset}
        bidAssetAmount={bidAssetAmount}
        isBidAssetNFT={isBidAssetNFT}
        initialPrice={initialPrice}
      />

      {!currentAuction.state.Closed && (
        <PlaceBid
          auctionId={auctionId}
          auctionAsset={currentAuction.bid_asset}
          seller={currentAuction.seller!}
        />
      )}

      <AuctionEndInfo
        auctionState={currentAuction.state}
        endBlock={currentAuction.end_block}
      />

      <AuctionIdentityInfo
        sellerAddress={
          currentAuction.seller.Address?.value ||
          currentAuction.seller.ContractId!.value
        }
        highestBidder={currentAuction.highest_bidder}
      />
    </Stack>
  );
};