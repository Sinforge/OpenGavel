using System.Text.Json.Serialization;

namespace AuthService.Api.Models.User.Authorize;

public record AuthResponse([property: JsonPropertyName("token")] string Token);