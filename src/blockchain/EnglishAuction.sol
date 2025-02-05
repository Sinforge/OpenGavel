// SPDX-License-Identifier: MIT

pragma solidity ^0.8.18;

import "./BaseAuction.sol";

contract EnglishAuction is BaseAuction {
    HighestBidder public currentWinner;

    mapping(address => uint256) public deposits;
    address[] bidders;
    uint256 bidderCount;

    constructor(
        address _owner,
        string memory _itemName,
        uint256 _startPrice,
        uint _endTimestamp
    ) {
        owner = payable(_owner);
        itemName = _itemName;
        startPrice = _startPrice;
        endTimestamp = _endTimestamp;
        ended = false;
        bidderCount = 0;
    }

    function placeBid() external payable auctionNotEnded {
        bool isNewBidder = deposits[msg.sender] == 0;

        deposits[msg.sender] += msg.value;

        uint256 totalAvailable = deposits[msg.sender];

        require(totalAvailable > currentWinner.amount, "Bid too low");
        require(totalAvailable >= startPrice, "Below minimum bid");

        if (isNewBidder) {
            bidders.push(msg.sender);
            bidderCount++;
        }
        currentWinner = HighestBidder(payable(msg.sender), totalAvailable);

        emit NewHighestBid(msg.sender, totalAvailable);
    }

    function finalizeAuction() external auctionEnded {
        require(!ended, "Auction already finalized");

        ended = true;

        if (currentWinner.bidderAddress != address(0)) {
            owner.transfer(currentWinner.amount);
        }

        emit AuctionFinalized(
            currentWinner.bidderAddress,
            currentWinner.amount
        );
    }

    function withdraw() external auctionEnded onlyOwner {
        require(deposits[msg.sender] != 0, "You not has deposit in auction");
        address payable receiver = payable(msg.sender);
        receiver.transfer(deposits[msg.sender]);
    }

    function getAllDeposits() external view returns (BidderInfo[] memory) {
        BidderInfo[] memory biddersInfo = new BidderInfo[](bidders.length);
        for (uint256 i = 0; i < bidders.length; i++) {
            biddersInfo[i] = BidderInfo(bidders[i], deposits[bidders[i]]);
        }

        return biddersInfo;
    }
}
