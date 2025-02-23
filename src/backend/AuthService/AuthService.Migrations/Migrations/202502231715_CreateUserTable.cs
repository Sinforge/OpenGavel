using FluentMigrator;

namespace AuthService.Infrastructure.Migrations;

[Migration(202502231715)]
public class M202502231715_CreateUserTable : Migration {
    public override void Up()
    {
        Create.Table("user")
            .WithColumn("id").AsGuid().PrimaryKey().NotNullable()
            .WithColumn("wallet_address").AsString().NotNullable()
            .WithColumn("wallet_provider").AsInt32().NotNullable();
    }

    public override void Down()
    {
        Delete.Table("user");
    }
}