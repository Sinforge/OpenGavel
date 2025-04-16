using System.Text.Json.Serialization;
using LotService.Domain.Enums;

namespace LotService.Api.Contracts.Auction.GetAuctions;

public sealed record GetAuctionsModel(
    [property: JsonPropertyName("id")] Guid Id,
    [property: JsonPropertyName("contractAddress")] string ContractAddress,
    [property: JsonPropertyName("ownerAddress")] string OwnerAddress,
    [property: JsonPropertyName("title")] string Title,
    [property: JsonPropertyName("description")] string Description,
    [property: JsonPropertyName("isClosed")] bool IsClosed,
    [property: JsonPropertyName("type")] AuctionType Type);