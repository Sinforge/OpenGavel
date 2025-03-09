using BlockchainService.Application.Handlers.Commands.Contracts.AddContract;
using BlockchainService.Constants;
using BlockchainService.Contracts;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace BlockchainService.Controllers.Commands;

[ApiController]
[Route("api/v1/[controller]")]
public class ContractController(IMediator mediator) : ControllerBase
{
    [HttpPost("blind")]
    public async Task<IActionResult> UploadBlindAuctionContractAsync([FromBody] AddContractRequest request, CancellationToken cancellationToken)
    {
        var command = new AddContractCommand(AuctionConstants.BlindAuctionName, request.Bytecode, request.Abi);
        await mediator.Send(command, cancellationToken);
        return NoContent();
    }
    
    [HttpPost("english")]
    public async Task<IActionResult> GetEnglishAuctionContractAsync([FromBody] AddContractRequest request, CancellationToken cancellationToken)
    {
        var command = new AddContractCommand(AuctionConstants.EnglishAuctionName, request.Bytecode, request.Abi);
        await mediator.Send(command, cancellationToken);
        return NoContent();
    }
}