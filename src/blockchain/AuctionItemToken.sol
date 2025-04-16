// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.22;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract AuctionItemToken is ERC721{
    uint256 private _nextTokenId;

    constructor(address initialOwner)
    ERC721("AuctionItemToken", "AIT")
    {}

    function mintTo(address to) external returns (uint256) {
        uint256 tokenId = _nextTokenId++;
        _safeMint(to, tokenId);
        return tokenId;
    }
}