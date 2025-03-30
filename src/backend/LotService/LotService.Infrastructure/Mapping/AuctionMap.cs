using Dapper.FluentMap.Mapping;
using LotService.Infrastructure.Dao;

namespace LotService.Infrastructure.Mapping;

public class AuctionMap : EntityMap<AuctionDao>
{
    public AuctionMap()
    {
        Map(e => e.Id).ToColumn("id");
        Map(e => e.ContractAddress).ToColumn("contract_address");
        Map(e => e.OwnerAddress).ToColumn("owner_address");
        Map(e => e.Title).ToColumn("title");
        Map(e => e.Description).ToColumn("description");
        Map(e => e.Configuration).ToColumn("configuration");
        Map(e => e.Status).ToColumn("status");
        Map(e => e.Type).ToColumn("type");
    }
}