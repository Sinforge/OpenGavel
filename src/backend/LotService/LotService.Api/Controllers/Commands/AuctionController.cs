using LotService.Api.Contracts.Auction.AddAuction;
using LotService.Api.Contracts.Auction.OpenAuction;
using LotService.Api.Contracts.Base;
using LotService.Application.Handlers.Commands.Auction.AddAuction;
using LotService.Application.Handlers.Commands.Auction.OpenAuction;
using MapsterMapper;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace LotService.Api.Controllers.Commands;

[ApiController]
[Route("api/v1/commands/[controller]")]
public class AuctionController(IMediator mediator, IMapper mapper) : ControllerBase
{
    [HttpPost("create")]
    [ProducesResponseType<IdModel<Guid>>(StatusCodes.Status200OK)]
    public async Task<IActionResult> CreateAuctionAsync(
        [FromBody] AddAuctionRequest request, CancellationToken cancellationToken)
    {
        var command = mapper.Map<AddAuctionCommand>(request);
        var response = await mediator.Send(command, cancellationToken);
        
        return Ok(response);
    }

    [HttpPost("deploy")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> OpenAuctionAsync(
        [FromBody] OpenAuctionRequest request, CancellationToken cancellationToken)
    {
        var command = mapper.Map<OpenAuctionCommand>(request);
        
        await mediator.Send(command, cancellationToken);
        
        return Ok();
    }
}