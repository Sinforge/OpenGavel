using System.Text.Json.Serialization;
using LotService.Domain.Enums;

namespace LotService.Api.Contracts.Auction.GetUserAuctions;

public sealed record GetUserAuctionsAuctionDto(
    [property: JsonPropertyName("id")] Guid Id,
    [property: JsonPropertyName("contractAddress")] string? ContractAddress,
    [property: JsonPropertyName("title")] string Title,
    [property: JsonPropertyName("status")] AuctionStatus Status,
    [property: JsonPropertyName("type")] AuctionType Type,
    [property: JsonPropertyName("chainId")] int? ChainId,
    [property: JsonPropertyName("configuration")] object Configuration
);