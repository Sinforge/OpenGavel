using System.Data;

namespace DapperCore.UoW;

public class UnitOfWork : IUnitOfWork
{
    private readonly IDbConnection _connection;
    private IDbTransaction? _transaction;
    
    IDbConnection IUnitOfWork.Connection => _connection;
    IDbTransaction? IUnitOfWork.Transaction => _transaction;


    public UnitOfWork(IDbConnection connection)
    {
        _connection = connection;
        _connection.Open();
    }

    public void BeginTransaction()
    {
        _transaction = _connection.BeginTransaction();
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

    public void Dispose()
    {
        _transaction?.Dispose();
        _connection?.Dispose();
    }
}