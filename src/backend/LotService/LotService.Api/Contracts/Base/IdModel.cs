using System.Text.Json.Serialization;

namespace LotService.Api.Contracts.Base;

public record IdModel<TId>([property: JsonPropertyName("id")] TId Id);