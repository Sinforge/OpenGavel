using System.Data;
using Microsoft.Extensions.DependencyInjection;

namespace DapperCore.UoW;

public class UnitOfWork : IUnitOfWork
{
    private readonly IDbConnection _connection;
    private IDbTransaction _transaction;
    private readonly IServiceProvider _serviceProvider;

    public UnitOfWork(IDbConnection connection, IServiceProvider serviceProvider)
    {
        _connection = connection;
        _connection.Open();
        _transaction = _connection.BeginTransaction();
        _serviceProvider = serviceProvider;
    }

    public void Commit()
    {
        _transaction?.Commit();
        _transaction = _connection.BeginTransaction();
    }

    public void Rollback()
    {
        _transaction?.Rollback();
        _transaction = _connection.BeginTransaction();
    }

    public T GetRepository<T>()
        => ActivatorUtilities.CreateInstance<T>(_serviceProvider, _connection, _transaction);

    public void Dispose()
    {
        _transaction?.Dispose();
        _connection?.Dispose();
    }
}