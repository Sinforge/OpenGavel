using AuthService.Domain.Aggregates.UserAggregate;

namespace AuthService.Application.Repositories;

public interface IUserRepository
{
    Task<bool> ExistsByWalletAsync(string wallet);
    Task<User?> GetUserByWalletAsync(string wallet);
}