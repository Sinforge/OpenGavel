using BlockchainService.Application.Repositories;
using MediatR;

namespace BlockchainService.Application.Handlers.Queries.Contracts.GetContract;

internal class GetContractHandler(
    IContractRepository contractRepository
    ) : IRequestHandler<GetContractQuery, GetContractDto?>
{
    public async Task<GetContractDto?> Handle(GetContractQuery request, CancellationToken cancellationToken)
    {
        var contract = await contractRepository.GetContractByNameAsync(request.Name, cancellationToken);

        return contract is not null
            ? new GetContractDto(contract.Bytecode, contract.Abi)
            : null;
    }
}