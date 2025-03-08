using FluentMigrator;

namespace LotService.Migrations.Migrations;

[Migration(202503081631)]
public class M202503081631_CreateEnglishAuctionTable : Migration {
    public override void Up()
    {
        Execute.Sql("""
                    create table english_auction(
                        id uuid primary key,
                        contract_address varchar(42) not null,
                        owner_address varchar(42) not null,
                        title varchar(255) not null,
                        description text,
                        start_time timestamp with time zone not null,
                        end_time timestamp with time zone not null,
                        start_price decimal(20, 18) not null,
                        bid_step decimal(20, 18) not null
                    );
                    """);
    }

    public override void Down()
    {
        Execute.Sql("drop table english_auction;");
    }
}