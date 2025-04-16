using FluentMigrator;

namespace LotService.Migrations.Migrations;

[Migration(202504150200)]
public class M202504150200_AddDeployedContractColumns : Migration {
    public override void Up()
    {
        Execute.Sql("""
                    alter table auctions
                        add column chain_id int null default 1;
                    """);
    }

    public override void Down()
    {
        Execute.Sql("""
                    alter table auctions drop column chain_id;
                    """);
    }
}