using BlockchainService.Application.Handlers.Queries.Contracts.GetContract;
using BlockchainService.Constants;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace BlockchainService.Controllers.Queries;

[ApiController]
[Route("api/v1/[controller]")]
public class ContractController(IMediator mediator) : ControllerBase
{
    [HttpGet("blind")]
    public async Task<IActionResult> UploadBlindAuctionContractAsync(CancellationToken cancellationToken)
    {
        var query = new GetContractQuery(AuctionConstants.BlindAuctionName);
        var response = await mediator.Send(query, cancellationToken);
        return Ok(response);
    }
    
    [HttpGet("english")]
    public async Task<IActionResult> GetEnglishAuctionContractAsync(CancellationToken cancellationToken)
    {
        var query = new GetContractQuery(AuctionConstants.EnglishAuctionName);
        var response = await mediator.Send(query, cancellationToken);
        return Ok(response);
    }
}