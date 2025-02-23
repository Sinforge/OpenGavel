namespace AuthService.Application.Services;

public interface IAddressVerifier
{
    bool Verify(string originalMessage, string expectedAddress, string signature);
}