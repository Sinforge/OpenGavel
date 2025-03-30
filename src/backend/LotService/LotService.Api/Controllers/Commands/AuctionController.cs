using LotService.Api.Contracts.Auction.AddAuction;
using LotService.Api.Contracts.Base;
using LotService.Application.Handlers.Commands.Auction.AddAuction;
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
    public async Task<IActionResult> GetBlindAuctionAsync(
        [FromBody] AddAuctionRequest request, CancellationToken cancellationToken)
    {
        var query = mapper.Map<AddAuctionCommand>(request);
        var response = await mediator.Send(query, cancellationToken);
        
        return Ok(response);
    }
}