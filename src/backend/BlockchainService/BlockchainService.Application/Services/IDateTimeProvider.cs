namespace BlockchainService.Application.Services;

public interface IDateTimeProvider
{
    DateTime UtcNow { get; }
}