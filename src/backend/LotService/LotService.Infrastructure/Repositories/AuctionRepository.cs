using System.Data;
using System.Text;
using Dapper;
using DapperCore.ConnectionFactory;
using LotService.Application.Dto;
using LotService.Application.Repositories;
using LotService.Application.Repositories.Models;
using LotService.Domain.Entities;
using LotService.Domain.Enums;
using LotService.Domain.ValueObjects;
using LotService.Infrastructure.Dao;
using Npgsql;

namespace LotService.Infrastructure.Repositories;

public class AuctionRepository(PostgresConnectionFactory connectionFactory) : IAuctionRepository
{
    public async Task AddAsync(Auction auction, CancellationToken cancellationToken)
    {
        const string sql = """
                           insert into auctions (
                                                 id, owner_address,
                                                      title, description,
                                                      configuration, status, type, start_time, end_time)
                                                      values (@Id, @OwnerAddress,
                                                                @Title, @Description, @Configuration,
                                                              @Status, @Type, @StartTime, @EndTime);
                           """;
        var @params = new
        {
            Id = auction.Id,
            OwnerAddress = auction.OwnerAddress.Value,
            Title = auction.Title,
            Description = auction.Description,
            Configuration = auction.Configuration,
            StartTime = auction.DateRange.StartTime,
            EndTime = auction.DateRange.EndTime,
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

    public async Task OpenAsync(Guid id, DeployedContract deployedContract, CancellationToken cancellationToken)
    {
        const string sql = """
                           update auctions set 
                                               status = @Status,
                                               contract_address = @ContractAddress,
                                               chain_id = @ChainId
                                               where id = @Id;
                           """;

        var query = new CommandDefinition(
            commandText: sql,
            parameters: new
            {
                Id = id, 
                Status = AuctionStatus.Opened, 
                ContractAddress = deployedContract.Address.Value, 
                ChainId = (int)deployedContract.ChainId
            },
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

    public async Task<PagedResult<Auction>> GetPagedAuctionsAsync(
        GetPagedAuctionsQuery query,
        CancellationToken cancellationToken)
    {
        var parameters = new DynamicParameters();
        var predicateSb = new StringBuilder("where 1=1");

        var statuses = new List<int> { (int)AuctionStatus.Opened };
        if (query.IncludeClosed)
            statuses.Add((int)AuctionStatus.Closed);
        
        parameters.Add("Statuses", statuses);
        predicateSb.Append(" and status = any(@Statuses)");

        if (query.Type is not null)
        {
            parameters.Add("Type", query.Type);
            predicateSb.Append(" and type = @Type");
        }

        if (query.ChainId is not null)
        {
            parameters.Add("ChainId", query.ChainId);
            predicateSb.Append(" and chain_id = @ChainId");
        }

        if (query.Name is not null)
        {
            parameters.Add("Name", $"%{query.Name}%");
            predicateSb.Append(" and title like @Name");
        }

        if (query.StartDateTime is not null)
        {
            parameters.Add("StartDate", query.StartDateTime);
            predicateSb.Append(" and @StartDate >= start_time");
        }
        
        if (query.EndDateTime is not null)
        {
            parameters.Add("EndDate", query.EndDateTime);
            predicateSb.Append(" and @EndDate >= end_time");
        }

        parameters.Add("Limit", query.Limit);
        parameters.Add("Offset", query.Offset);

        var sql = $"""
                   select * from auctions {predicateSb} limit @Limit offset @Offset
                   """;

        await using var connection = connectionFactory.GetConnection();
        
        var result = await connection.QueryAsync<AuctionDao>(
            sql, 
            parameters,
            commandType: CommandType.Text);

        var countSql = $"select count(*) from auctions {predicateSb}";
        var totalCount = await connection.ExecuteScalarAsync<long>(countSql, parameters);

        return new PagedResult<Auction>(
            result.Select(x => x.ToDomain()).ToList(),
            totalCount);
    }
}