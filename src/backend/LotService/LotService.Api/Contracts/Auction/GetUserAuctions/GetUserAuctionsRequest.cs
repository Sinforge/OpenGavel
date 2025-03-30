using System.Text.Json.Serialization;

namespace LotService.Api.Contracts.Auction.GetUserAuctions;

public sealed record GetUserAuctionsRequest(
    [property: JsonPropertyName("address")] string Address);