using System.Text.Json.Serialization;

namespace LotService.Api.Contracts.Auction.GetUserAuctions;

public sealed record GetUserAuctionsResponse(
    [property: JsonPropertyName("auctions")] IReadOnlyCollection<GetUserAuctionsAuctionDto> Auctions);