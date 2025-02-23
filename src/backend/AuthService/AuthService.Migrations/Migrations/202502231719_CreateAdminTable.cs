using FluentMigrator;

namespace AuthService.Infrastructure.Migrations;

[Migration(202502231719)]
public class M202502231719_CreateAdminTable: Migration 
{
    public override void Up()
    {
        Create.Table("admin")
            .WithColumn("id").AsGuid().PrimaryKey().NotNullable()
            .WithColumn("email").AsString().NotNullable()
            .WithColumn("password_hash").AsString().NotNullable();
    }

    public override void Down()
    {
        Delete.Table("admin");
    }
}