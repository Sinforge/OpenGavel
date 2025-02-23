namespace AuthService.Application.Services;

public interface IJwtTokenService
{
    string GenerateJwtToken(string address);
}