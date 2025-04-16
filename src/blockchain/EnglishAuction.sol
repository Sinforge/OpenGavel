// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import "./AuctionItem.sol";

contract EnglishAuction{
    AuctionItemToken public token;
    uint256 public tokenId;
    HighestBidder public winner;
    address payable public owner;
    string public itemName;
    uint256 public startPrice;
    uint256 public endTimestamp;
    uint256 public currentTimestamp = block.timestamp;
    bool public ended;

    constructor(
        address _owner,
        string memory _itemName,
        uint256 _startPrice,
        uint _endTimestamp,
        address _tokenAddress
    )
    {
        owner = payable(_owner);
        itemName = _itemName;
        startPrice = _startPrice;
        endTimestamp = _endTimestamp;
        token = AuctionItemToken(_tokenAddress);
        tokenId = token.mintTo(address(this));
        ended = false;
    }

    function getCurrentTimestamp() view public returns (uint256) {
        return block.timestamp;
    }

    mapping(address => uint256) public pendingReturns;

    function bid() external payable auctionNotEnded {
        require(msg.value > winner.amount, "Bid too low");
        require(msg.value >= startPrice, "Below minimum bid");

        // Сохраняем предыдущую максимальную ставку для возврата
        if (winner.amount != 0) {
            pendingReturns[winner.addr] += winner.amount;
        }

        winner = HighestBidder(payable(msg.sender), msg.value);

        emit NewBid(msg.sender, msg.value);
    }

    // Участники вызывают эту функцию, чтобы забрать свои средства
    function withdraw() external {
        uint256 amount = pendingReturns[msg.sender];
        require(amount > 0, "No funds to withdraw");

        pendingReturns[msg.sender] = 0;
        payable(msg.sender).transfer(amount);
    }

    // If auction ended by time
    // And if not finalized
    function finalize() external auctionEnded {
        require(!ended, "Auction already finalized");

        if (winner.addr != address(0)) {
            owner.transfer(winner.amount);
            token.transferFrom(address(this), winner.addr, tokenId); // Передаем токен
        }

        ended = true;

        emit AuctionFinalized(
            winner.addr,
            winner.amount
        );
    }

    struct BidderInfo {
        address bidder;
        uint256 deposit;
    }

    struct HighestBidder {
        address payable addr;
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