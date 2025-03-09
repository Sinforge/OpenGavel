using BlockchainService.Application.Handlers.Queries.Contracts.GetContract;
using BlockchainService.Constants;
using Google.Protobuf.WellKnownTypes;
using Grpc.Core;
using GrpcBlockchainService;
using MediatR;
using ContractData = GrpcBlockchainService.GetContractResponse.Types.ContractData;
namespace BlockchainService.Grpc;

public class BlockchainService(IMediator mediator) : GrpcBlockchainService.BlockchainService.BlockchainServiceBase
{
    public override Task<GetContractResponse> GetBlindAuctionContract(Empty request, ServerCallContext context)
    {
        return GetContractByNameAsync(AuctionConstants.BlindAuctionName, context.CancellationToken);
    }

    public override Task<GetContractResponse> GetEnglishAuctionContract(Empty request, ServerCallContext context)
    {
        return GetContractByNameAsync(AuctionConstants.EnglishAuctionName, context.CancellationToken);
    }

    private async Task<GetContractResponse> GetContractByNameAsync(string name, CancellationToken cancellationToken)
    {
        var query = new GetContractQuery(name);
        var contract = await mediator.Send(query, cancellationToken);

        return contract is null
            ? new GetContractResponse { NotFound = new Empty() }
            : new GetContractResponse { Contract = new ContractData()
                {
                    Bytecode = contract.Bytecode,
                    Abi = contract.Abi,
                } 
            };
    }
}