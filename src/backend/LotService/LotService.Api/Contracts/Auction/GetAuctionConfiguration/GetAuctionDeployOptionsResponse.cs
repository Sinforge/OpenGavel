using System.Text.Json.Serialization;

namespace LotService.Api.Contracts.Auction.GetAuctionConfiguration;

public sealed record GetAuctionDeployOptionsResponse(
    [property: JsonPropertyName("ownerAddress")] string OwnerAddress,
    [property: JsonPropertyName("title")] string Title,
    [property: JsonPropertyName("description")] string Description,
    [property: JsonPropertyName("startTime")] DateTime StartTime,
    [property: JsonPropertyName("endTime")] DateTime EndTime,
    [property: JsonPropertyName("bidAmount")] int BidAmount,
    [property: JsonPropertyName("startPrice")] decimal StartPrice
    );