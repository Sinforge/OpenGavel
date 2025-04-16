using System.Text.Json.Serialization;
using LotService.Domain.Enums;

namespace LotService.Api.Contracts.Auction.OpenAuction;

public sealed record OpenAuctionRequest(
    [property: JsonPropertyName("id")] Guid Id,
    [property: JsonPropertyName("chainId")] ChainId ChainId,
    [property: JsonPropertyName("contractAddress")] string ContractAddress);