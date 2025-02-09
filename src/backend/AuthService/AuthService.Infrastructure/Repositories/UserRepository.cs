using System.Data;
using AuthService.Application.Repositories;
using AuthService.Domain.Aggregates.UserAggregate;
using AuthService.Infrastructure.PersistentEntities;
using Dapper;
using DapperCore.Repository;

namespace AuthService.Infrastructure.Repositories;

public class UserRepository(IDbConnection conn, IDbTransaction transaction) : 
    Repository<User, UserPersistentEntity, Guid>(conn, transaction), IUserRepository
{
    public async Task<bool> ExistsByWalletAsync(string wallet)
    {
        const string query = "select exists (select 1 from users where wallet = @wallet)";

        var parameters = new DynamicParameters();
        parameters.Add("@wallet", wallet);

        return await conn.ExecuteScalarAsync<bool>(query, parameters);
    }

    public async Task<User?> GetUserByWalletAsync(string wallet)
    {
        const string query = "select * from users where wallet_address = @wallet";
        
        var persistentEntity = await conn.QuerySingleOrDefaultAsync<UserPersistentEntity>(
            query, 
            new { wallet });
        
        if (persistentEntity == null)
            return null;

        return MapToDomain(persistentEntity);
    }
    
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