using Npgsql;

namespace DapperCore.ConnectionFactory;

public class PostgresConnectionFactory(string connectionString)
{
    public NpgsqlConnection GetConnection() => new NpgsqlConnection(connectionString);
}