using System.Text.Json.Serialization;

namespace AuthService.Api.Models.User.Authorize;

public record AuthRequest(
    [property: JsonPropertyName("address")] string Address,
    [property: JsonPropertyName("signature")] string Signature,
    [property: JsonPropertyName("message")] string Message);