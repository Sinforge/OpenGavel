using System.Text.Json.Serialization;
using LotService.Application.Handlers.Queries.GetAuctions;

namespace LotService.Api.Contracts.Auction.GetAuctions;

public sealed record GetAuctionsResponse(
    [property: JsonPropertyName("items")] IReadOnlyCollection<GetAuctionsDto> Items,
    [property: JsonPropertyName("totalCount")] long TotalCount);
    