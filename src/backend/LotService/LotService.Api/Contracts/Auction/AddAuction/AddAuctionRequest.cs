using System.Text.Json.Serialization;
using LotService.Domain.Enums;

namespace LotService.Api.Contracts.Auction.AddAuction;

public sealed record AddAuctionRequest(
    [property: JsonPropertyName("ownerAddress")] string OwnerAddress,
    [property: JsonPropertyName("title")] string Title,
    [property: JsonPropertyName("description")] string Description, 
    [property: JsonPropertyName("configuration")] object Configuration,
    [property: JsonPropertyName("startTime")] DateTime StartTime,
    [property: JsonPropertyName("endTime")] DateTime EndTime,
    [property: JsonPropertyName("type")] AuctionType Type);