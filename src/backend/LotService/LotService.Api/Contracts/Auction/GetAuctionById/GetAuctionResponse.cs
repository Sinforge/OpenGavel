using System.Text.Json.Serialization;
using LotService.Domain.Enums;

namespace LotService.Api.Contracts.Auction.GetAuctionById;

public sealed record GetAuctionResponse(
    [property: JsonPropertyName("ownerAddress")] string OwnerAddress,
    [property: JsonPropertyName("contractAddress")] string ContractAddress,
    [property: JsonPropertyName("startTime")] DateTime StartTime,
    [property: JsonPropertyName("endTime")] DateTime EndTime,
    [property: JsonPropertyName("chainId")] int ChainId,
    [property: JsonPropertyName("title")] string Title,
    [property: JsonPropertyName("description")] string Description,
    [property: JsonPropertyName("configuration")] string Configuration,
    [property: JsonPropertyName("status")] AuctionStatus Status,
    [property: JsonPropertyName("type")] AuctionType Type
);