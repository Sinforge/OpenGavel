using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Data;
using System.Reflection;
using Dapper;
using DapperCore.UoW;
using DomainCore;

namespace DapperCore.Repository;

public abstract class Repository<TDomainEntity, TPersistentEntity, TId>
    (IUnitOfWork unitOfWork): IRepository<TDomainEntity, TPersistentEntity, TId>
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

    public Task AddAsync(TDomainEntity domainEntity, CancellationToken cancellationToken)
    {
        var persistentEntity = MapToPersistent(domainEntity);
        var sql = GenerateInsertSql();
        
        var query = GetQuery(sql, unitOfWork.Transaction, persistentEntity, cancellationToken);
        return unitOfWork.Connection.ExecuteAsync(query);
    }

    public Task DeleteByIdAsync(TId id, CancellationToken cancellationToken)
    {
        var sql = GenerateDeleteSql();
        
        var query = GetQuery(sql, unitOfWork.Transaction, new {Id = id}, cancellationToken);
        
        return unitOfWork.Connection.ExecuteAsync(query);
    }
    
    protected CommandDefinition GetQuery(string sql, IDbTransaction? dbTransaction = null, object? parameters = null, CancellationToken cancellationToken = default) =>
        new(sql, parameters: parameters, cancellationToken: cancellationToken, transaction: dbTransaction);

    protected abstract TPersistentEntity MapToPersistent(TDomainEntity domainEntity);
    protected abstract TDomainEntity MapToDomain(TPersistentEntity persistentEntity);

    protected virtual string GenerateDeleteSql()
    {
        var idColumnName = typeof(TPersistentEntity)
            .GetProperties()
            .First(x => x.GetCustomAttribute<KeyAttribute>() is not null)
            .GetCustomAttribute<ColumnAttribute>()!.Name;
        return $"delete from public.{_tableName} where {idColumnName} = @Id";
    }
    protected virtual string GenerateInsertSql()
    {
        var persistentProperties = typeof(TPersistentEntity)
            .GetProperties()
            .Select(p =>
            {
                var columnAttr = p.GetCustomAttribute<ColumnAttribute>();
                return columnAttr != null ? columnAttr.Name : p.Name;
            })
            .ToList();
        var properties =  typeof(TPersistentEntity)
            .GetProperties()
            .Select(p =>p.Name)
            .ToList();
        
        return $@"
            insert into public.{_tableName} ({string.Join(", ", persistentProperties)})
            values (@{string.Join(", @", properties)})";
    }


}