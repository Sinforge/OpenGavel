using System.Text.Json.Serialization;

namespace BlockchainService.Contracts;

public sealed record AddContractRequest(
    [property: JsonPropertyName("bytecode")] string Bytecode,
    [property: JsonPropertyName("abi")] string Abi
    );