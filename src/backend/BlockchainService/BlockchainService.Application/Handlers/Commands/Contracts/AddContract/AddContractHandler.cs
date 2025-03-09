using BlockchainService.Application.Repositories;
using BlockchainService.Domain.Entities;
using MediatR;

namespace BlockchainService.Application.Handlers.Commands.Contracts.AddContract;

internal class AddContractHandler(
    IContractRepository contractRepository
    ) : IRequestHandler<AddContractCommand>
{
    public Task Handle(AddContractCommand request, CancellationToken cancellationToken)
    {
        var newContract = new Contract
        {
            Name = request.Name,
            Bytecode = request.Bytecode,
            Abi = request.Abi,
        };
        
        return contractRepository.AddContractAsync(newContract, cancellationToken);
    }
}