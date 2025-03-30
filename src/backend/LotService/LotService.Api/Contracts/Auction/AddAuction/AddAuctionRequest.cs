using System.Text.Json.Serialization;
using LotService.Domain.Enums;

namespace LotService.Api.Contracts.Auction.AddAuction;

// TODO: change take owner address from token
public sealed record AddAuctionRequest(
    [property: JsonPropertyName("ownerAddress")] string OwnerAddress,
    [property: JsonPropertyName("title")] string Title,
    [property: JsonPropertyName("description")] string Description, 
    [property: JsonPropertyName("configuration")] object Configuration,
    [property: JsonPropertyName("type")] AuctionType Type);