using Dapper;
using LotService.TransactionWorker.Models;
using Npgsql;

namespace LotService.TransactionWorker.Repositories;

internal class AuctionRepository : IAuctionRepository
{
    private readonly string _connectionString;
    
    public AuctionRepository(IConfiguration configuration)
    {
        _connectionString = configuration.GetConnectionString("DefaultConnection")!;
        
    }
    public async Task PublishAuctionAsync(PublishAuctionParams @params, CancellationToken cancellationToken = default)
    {
        const string sql = """
                           update transaction where id = @id 
                                set contract_address = @ContractAddress,
                                    status = 'published';
                           """;
        await using var connection = new NpgsqlConnection(_connectionString);
        var command = new CommandDefinition(sql, cancellationToken: cancellationToken);
        await connection.ExecuteAsync(command);
    }
}