using System.Text.Json.Serialization;
using LotService.Domain.Enums;

namespace LotService.Api.Contracts.Auction.GetAuctions;

public sealed record GetAuctionsRequest(
    [property: JsonPropertyName("offset")] long Offset,
    [property: JsonPropertyName("limit")] long Limit,
    [property: JsonPropertyName("type")] AuctionType? Type,
    [property: JsonPropertyName("name")] string? Name,
    [property: JsonPropertyName("chainId")] int? ChainId,
    [property: JsonPropertyName("startDate")] DateTime? StartDate,
    [property: JsonPropertyName("endDate")] DateTime? EndDate,
    [property: JsonPropertyName("includeClosed")] bool IncludeClosed);