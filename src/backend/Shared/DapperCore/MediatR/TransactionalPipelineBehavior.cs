using DapperCore.UoW;
using MediatR;
using Microsoft.Extensions.Logging;

namespace DapperCore.MediatR;

public class TransactionalPipelineBehavior<TRequest, TResponse>(
    ILogger<TransactionalPipelineBehavior<TRequest, TResponse>> logger,
    IUnitOfWork unitOfWork
    ) : IPipelineBehavior<TRequest, TResponse> where TRequest : notnull
{
    public async Task<TResponse> Handle(TRequest request, RequestHandlerDelegate<TResponse> next, CancellationToken cancellationToken)
    {
        if (request is not ITransactional)
            return await next();

        TResponse response;
        try
        {
            logger.LogInformation("Begin transaction");
            unitOfWork.BeginTransaction();

            response = await next();

            unitOfWork.Commit();
            logger.LogInformation("Commit transaction");
        }
        catch
        {
            unitOfWork.Rollback();
            logger.LogInformation("Transaction rollback");
            throw;
        }
        
        return response;
    }
}