using FluentMigrator;

namespace LotService.Migrations.Migrations;

[Migration(202503302140)]
public class M202503302140_ChangeAuctionsTables : Migration {
    public override void Up()
    {
        Execute.Sql("""
                    create table auctions(
                        id uuid primary key,
                        owner_address varchar(42) not null,
                        contract_address varchar(42) null,
                        title varchar(50) not null,
                        description varchar(500) not null,
                        configuration json not null,
                        status int not null,
                        type int not null
                        );
                    """);
    }

    public override void Down()
    {
        Execute.Sql("""
                    drop table auctions;
                    """);
    }
}