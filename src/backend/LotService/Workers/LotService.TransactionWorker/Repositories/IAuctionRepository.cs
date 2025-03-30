using LotService.TransactionWorker.Models;

namespace LotService.TransactionWorker.Repositories;

internal interface IAuctionRepository
{
    Task PublishAuctionAsync(PublishAuctionParams @params, CancellationToken cancellationToken = default);
}