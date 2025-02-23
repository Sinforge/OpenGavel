using AuthService.Domain.Aggregates.UserAggregate;

namespace AuthService.Application.Repositories;

public interface IUserRepository
{
    Task<bool> ExistsByWalletAsync(string wallet, CancellationToken cancellationToken = default);
    Task<User?> GetUserByWalletAsync(string wallet, CancellationToken cancellationToken = default);
    Task AddUserAsync(User user, CancellationToken cancellationToken = default);
    
}