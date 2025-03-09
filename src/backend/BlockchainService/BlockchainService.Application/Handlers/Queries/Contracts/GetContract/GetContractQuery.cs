using MediatR;

namespace BlockchainService.Application.Handlers.Queries.Contracts.GetContract;

public record GetContractQuery(string Name) : IRequest<GetContractDto?>;