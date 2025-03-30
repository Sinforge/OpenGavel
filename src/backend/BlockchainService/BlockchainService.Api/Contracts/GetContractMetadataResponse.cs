using System.Text.Json.Serialization;

namespace BlockchainService.Contracts;

public record GetContractMetadataResponse(
    [property: JsonPropertyName("bytecode")] string Bytecode,
    [property: JsonPropertyName("abi")] string Abi
    );