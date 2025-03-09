namespace BlockchainService.Domain.Entities;

public class Contract
{
    public string Id { get; set; }
    public string Name { get; set; }
    public string Bytecode { get; set; }
    public string Abi { get; set; }
}