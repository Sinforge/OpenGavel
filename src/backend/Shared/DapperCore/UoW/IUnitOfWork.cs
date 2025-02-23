using System.Data;

namespace DapperCore.UoW;

public interface IUnitOfWork : IDisposable
{
    void BeginTransaction();
    void Commit();
    void Rollback();
    
    IDbConnection Connection { get; }
    IDbTransaction? Transaction { get; }
}