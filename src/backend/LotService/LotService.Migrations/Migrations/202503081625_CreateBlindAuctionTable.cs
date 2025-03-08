using FluentMigrator;

namespace LotService.Migrations.Migrations;

[Migration(202503081625)]
public class M202503081625_CreateBlindAuctionTable : Migration {
    public override void Up()
    {
        Execute.Sql("""
                    create table blind_auction(
                        id uuid primary key,
                        contract_address varchar(42) not null,
                        owner_address varchar(42) not null,
                        title varchar(255) not null,
                        description text,
                        start_time timestamp with time zone not NULL,
                        end_time timestamp with time zone not NULL,
                        bids_amount int not null
                    );
                    """);
    }

    public override void Down()
    {
        Execute.Sql("""
                    drop table blind_auction;
                    """);
    }
}