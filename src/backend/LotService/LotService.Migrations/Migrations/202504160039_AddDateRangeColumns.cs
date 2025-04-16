using FluentMigrator;

namespace LotService.Migrations.Migrations;

[Migration(202504160039)]
public class M202504160039_AddDateRangeColumns : Migration {
    public override void Up()
    {
        Execute.Sql("""
                    alter table auctions
                        add column start_time timestamp not null default current_timestamp,
                        add column end_time timestamp not null default current_timestamp
                    """);
    }

    public override void Down()
    {
        Execute.Sql("""
                    alter table auctions 
                        drop column start_time,
                        drop column end_time 
                    """);
    }
}