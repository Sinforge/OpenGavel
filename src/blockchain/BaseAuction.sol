// SPDX-License-Identifier: MIT

pragma solidity ^0.8.18;

contract BaseAuction {
    address payable public owner;
    string public itemName;
    uint256 public startPrice;
    uint256 public endTimestamp;
    bool public ended;

    struct BidderInfo {
        address bidder;
        uint256 deposit;
    }

    struct HighestBidder {
        address payable bidderAddress;
        uint256 amount;
    }

    event NewBid(address indexed bidder, uint256 amount);
    event AuctionFinalized(address indexed winner, uint256 amount);

    modifier auctionNotEnded() virtual {
        require(block.timestamp < endTimestamp, "Auction already ended");
        _;
    }

    modifier auctionEnded() virtual {
        require(block.timestamp >= endTimestamp, "Actuion not ended");
        _;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can finalize auction");
        _;
    }
}
