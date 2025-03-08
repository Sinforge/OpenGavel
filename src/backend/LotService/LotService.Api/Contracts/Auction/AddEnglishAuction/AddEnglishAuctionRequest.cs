using System.Text.Json.Serialization;

namespace LotService.Api.Contracts.Auction.AddEnglishAuction;

public sealed record AddEnglishAuctionRequest(
    [property: JsonPropertyName("ownerAddress")] string OwnerAddress,
    [property: JsonPropertyName("title")] string Title,
    [property: JsonPropertyName("description")] string Description,
    [property: JsonPropertyName("startTime")] DateTime StartTime,
    [property: JsonPropertyName("endTime")] DateTime EndTime,
    [property: JsonPropertyName("startPrice")] decimal StartPrice,
    [property: JsonPropertyName("bidStep")] decimal BidStep);
