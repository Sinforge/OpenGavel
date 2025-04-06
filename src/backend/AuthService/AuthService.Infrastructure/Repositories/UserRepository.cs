using AuthService.Application.Repositories;
using AuthService.Domain.Entities;
using AuthService.Domain.ValueObjects;
using AuthService.Infrastructure.PersistentEntities;
using Dapper;
using DapperCore.ConnectionFactory;

namespace AuthService.Infrastructure.Repositories;

public class UserRepository(PostgresConnectionFactory connectionFactory) : IUserRepository
{
    public async Task<bool> ExistsByWalletAsync(string wallet, CancellationToken cancelationToken)
    {
        var sql = "select exists (select 1 from public.user where wallet_address = @WalletAddress)";
        var query = new CommandDefinition(sql, parameters: new { WalletAddress = wallet }, cancellationToken: cancelationToken);

        await using var connection = connectionFactory.GetConnection();
        
        return await connection.QueryFirstAsync<bool>(query);
    }

    public async Task<User?> GetUserByWalletAsync(string wallet, CancellationToken cancelationToken)
    {
        var sql = "select * from public.user where wallet_address = @wallet";
        
        var query = new CommandDefinition(sql, parameters: new { wallet }, cancellationToken: cancelationToken);
        
        await using var connection = connectionFactory.GetConnection();
        
        var persistentEntity = await connection.QuerySingleOrDefaultAsync<UserPersistentEntity>(query);
        if (persistentEntity == null)
            return null;

        return User.Create(
            persistentEntity.Id,
            Wallet.Create(WalletAddress.Create(persistentEntity.WalletAddress), WalletProvider.MetaMask)
        );
    }

    public async Task AddUserAsync(User user, CancellationToken cancellationToken = default)
    {
        const string sql = """
                           insert into public.user (id, wallet_address, wallet_provider)
                           values (@Id, @WalletAddress, @WalletProvider)
                           """;
        
        var query = new CommandDefinition(sql,
            parameters: new
            {
                user.Id, 
                WalletAddress = user.Wallet.Address.Value, 
                WalletProvider = (int)user.Wallet.Provider
            }, cancellationToken: cancellationToken);
        
        await using var connection = connectionFactory.GetConnection();
        
        await connection.ExecuteAsync(query);
    }
}