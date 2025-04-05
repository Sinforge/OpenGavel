using System.Data;
using Dapper;
using DapperCore.ConnectionFactory;
using LotService.Application.Repositories;
using LotService.Domain.Entities;
using LotService.Domain.Enums;
using LotService.Domain.ValueObjects;
using LotService.Infrastructure.Dao;

namespace LotService.Infrastructure.Repositories;

public class AuctionRepository(PostgresConnectionFactory connectionFactory) : IAuctionRepository
{
    public async Task AddAsync(Auction auction, CancellationToken cancellationToken)
    {
        const string sql = """
                           insert into auctions (
                                                 id, owner_address,
                                                      title, description,
                                                      configuration, status, type)
                                                      values (@Id, @OwnerAddress,
                                                                @Title, @Description, @Configuration,
                                                              @Status, @Type);
                           """;
        var @params = new
        {
            Id = auction.Id,
            OwnerAddress = auction.OwnerAddress.Value,
            Title = auction.Title,
            Description = auction.Description,
            Configuration = auction.Configuration,
            Status = (int)auction.Status,
            Type = (int)auction.Type
        };
        var query = new CommandDefinition(
            commandText: sql,
            cancellationToken: cancellationToken,
            parameters: @params);

        await using var connection = connectionFactory.GetConnection();

        await connection.ExecuteAsync(query);
    }

    public async Task<Auction?> GetByIdAsync(Guid id, CancellationToken cancellationToken)
    {
        const string sql = """
                           select * from auctions where id = @Id;
                           """;

        var query = new CommandDefinition(
            commandText: sql,
            parameters: new { Id = id },
            cancellationToken: cancellationToken);

        await using var connection = connectionFactory.GetConnection();

        var result = await connection.QuerySingleOrDefaultAsync<AuctionDao?>(query);

        return result?.ToDomain();
    }

    public async Task UpdateStatusAsync(Guid id, AuctionStatus status, CancellationToken cancellationToken)
    {
        const string sql = """
                           update auctions set status = @Status where id = @Id;
                           """;

        var query = new CommandDefinition(
            commandText: sql,
            parameters: new { Id = id, Status = status },
            cancellationToken: cancellationToken);

        await using var connection = connectionFactory.GetConnection();
        
        await connection.ExecuteAsync(query);
    }

    public async Task<IReadOnlyCollection<Auction>> GetByUserAsync(BlockchainAddress userAddress,
        CancellationToken cancellationToken)
    {
        const string sql = """
                           select * from auctions where owner_address = @Address;
                           """;
        var query = new CommandDefinition(
            commandText: sql,
            parameters: new { Address = userAddress.Value },
            cancellationToken: cancellationToken);

        await using var connection = connectionFactory.GetConnection();
        
        var result = await connection.QueryAsync<AuctionDao>(query);

        return result.Select(x => x.ToDomain()).ToList();
    }
}