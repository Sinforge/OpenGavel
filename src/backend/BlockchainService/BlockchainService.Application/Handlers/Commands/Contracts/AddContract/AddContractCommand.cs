using MediatR;

namespace BlockchainService.Application.Handlers.Commands.Contracts.AddContract;

public sealed record AddContractCommand(
    string Name,
    string Bytecode,
    string Abi) : IRequest;