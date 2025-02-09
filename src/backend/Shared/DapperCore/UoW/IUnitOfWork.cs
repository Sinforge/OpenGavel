namespace DapperCore.UoW;

public interface IUnitOfWork : IDisposable
{
    void Commit();
    void Rollback();
    T GetRepository<T>();
}