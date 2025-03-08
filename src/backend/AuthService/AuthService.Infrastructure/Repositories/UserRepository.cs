using AuthService.Application.Repositories;
using AuthService.Domain.Entities;
using AuthService.Domain.ValueObjects;
using AuthService.Infrastructure.PersistentEntities;
using Dapper;
using DapperCore.Repository;
using DapperCore.UoW;

namespace AuthService.Infrastructure.Repositories;

public class UserRepository(IUnitOfWork unitOfWork) : 
    Repository<User, UserPersistentEntity, Guid>(unitOfWork), IUserRepository
{
    public async Task<bool> ExistsByWalletAsync(string wallet, CancellationToken cancelationToken)
    {
        var sql = $"select exists (select 1 from public.{_tableName} where wallet_address = @WalletAddress)";
        var query = GetQuery(sql, parameters: new { WalletAddress = wallet }, cancellationToken: cancelationToken);
        return await unitOfWork.Connection.QueryFirstAsync<bool>(query);
    }

    public async Task<User?> GetUserByWalletAsync(string wallet, CancellationToken cancelationToken)
    {
        var sql = "select * from public.{_tableName} where wallet_address = @wallet";
        
        var query = GetQuery(sql, parameters: new { wallet }, cancellationToken: cancelationToken);
        
        var persistentEntity = await unitOfWork.Connection.QuerySingleOrDefaultAsync<UserPersistentEntity>(query);
        if (persistentEntity == null)
            return null;

        return MapToDomain(persistentEntity);
    }

    public Task AddUserAsync(User user, CancellationToken cancellationToken = default)
        => AddAsync(user, cancellationToken);
    

    protected override UserPersistentEntity MapToPersistent(User domain)
    {
        return new UserPersistentEntity(domain.Id, domain.Wallet.Address.Value, (int)domain.Wallet.Provider);
    }

    protected override User MapToDomain(UserPersistentEntity persistent)
    {
        return User.Create(
            id: persistent.Id, 
            wallet: Wallet.Create(
                WalletAddress.Create(persistent.WalletAddress), 
                (WalletProvider) persistent.WalletProvider)
            );
    }
}