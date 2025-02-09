using System.ComponentModel.DataAnnotations.Schema;
using System.Data;
using System.Reflection;
using Dapper;
using DomainCore;

namespace DapperCore.Repository;

public abstract class Repository<TDomainEntity, TPersistentEntity, TId>(
    IDbConnection connection,
    IDbTransaction transaction) : IRepository<TDomainEntity, TPersistentEntity, TId>
    where TDomainEntity : Entity<TId>
    where TPersistentEntity : class
    where TId : notnull
{
    protected static readonly string _tableName;

    static Repository()
    {
        _tableName = typeof(TPersistentEntity).GetCustomAttribute<TableAttribute>()?.Name 
                     ?? typeof(TPersistentEntity).Name;
    }

    public Task AddAsync(TDomainEntity domainEntity)
    {
        var persistentEntity = MapToPersistent(domainEntity);
        var sql = GenerateInsertSql();
        return connection.ExecuteAsync(sql, persistentEntity, transaction);
    }
    private string GenerateInsertSql()
    {
        var properties = typeof(TPersistentEntity)
            .GetProperties()
            .Select(p => p.Name)
            .ToList();
        
        return $@"
            insert into {_tableName} ({string.Join(", ", properties)})
            values (@{string.Join(", @", properties)})";
    }
    
    protected abstract TPersistentEntity MapToPersistent(TDomainEntity domainEntity);
    protected abstract TDomainEntity MapToDomain(TPersistentEntity persistentEntity);
}