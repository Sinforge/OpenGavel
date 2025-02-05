// SPDX-License-Identifier: MIT

pragma solidity ^0.8.18;

import "./BaseAuction.sol";

contract BlindAuction is BaseAuction {
    uint256 public maximumBids;
    uint256 public currentBids;

    HighestBidder private currentWinner;

    mapping(address => uint256) public deposits;
    address[] bidders;

    constructor(
        address _owner,
        string memory _itemName,
        uint256 _startPrice,
        uint256 _endTimestamp,
        uint256 _maximumBids
    ) {
        owner = payable(_owner);
        itemName = _itemName;
        startPrice = _startPrice;
        endTimestamp = _endTimestamp;
        maximumBids = _maximumBids;
        currentBids = 0;
    }

    function placeBid() external payable auctionNotEnded {
        require(deposits[msg.sender] != 0, "You already has bid");
        require(msg.value >= startPrice, "Below minimum bid");

        deposits[msg.sender] = msg.value;

        bidders.push(msg.sender);
        currentBids++;

        // change winner
        if (currentWinner.amount < msg.value) {
            currentWinner = HighestBidder(payable(msg.sender), msg.value);
        }
    }

    function finalizeAuction() external auctionEnded onlyOwner {
        require(!ended, "Already finalized");
        if (currentWinner.bidderAddress != address(0)) {
            owner.transfer(currentWinner.amount);
        }

        ended = true;

        emit AuctionFinalized(
            currentWinner.bidderAddress,
            currentWinner.amount
        );
    }

    function getWinner()
        external
        view
        auctionEnded
        returns (HighestBidder memory)
    {
        return currentWinner;
    }

    function withdraw() external auctionEnded {
        require(deposits[msg.sender] != 0, "You not has deposit in auction");
        address payable receiver = payable(msg.sender);
        receiver.transfer(deposits[msg.sender]);
    }

    function getAllDeposits()
        external
        view
        auctionEnded
        returns (BidderInfo[] memory)
    {
        BidderInfo[] memory biddersInfo = new BidderInfo[](bidders.length);
        for (uint256 i = 0; i < bidders.length; i++) {
            biddersInfo[i] = BidderInfo(bidders[i], deposits[bidders[i]]);
        }

        return biddersInfo;
    }

    modifier auctionNotEnded() override {
        require(
            block.timestamp < endTimestamp && currentBids < maximumBids,
            "Auction already ended"
        );
        _;
    }

    modifier auctionEnded() override {
        require(
            block.timestamp >= endTimestamp || currentBids == maximumBids,
            "Auction not ended"
        );
        _;
    }
}
