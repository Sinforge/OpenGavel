using LotService.Api.Contracts.Auction.AddBlindAuction;
using LotService.Api.Contracts.Auction.AddEnglishAuction;
using LotService.Api.Contracts.Base;
using LotService.Application.Handlers.Commands.Auction.AddBlindAuction;
using LotService.Application.Handlers.Commands.Auction.AddEnglishAuction;
using MapsterMapper;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace LotService.Api.Controllers.Queries;

[ApiController]
[Route("api/v1/[controller]")]
public class AuctionController(IMediator mediator, IMapper mapper) : ControllerBase
{
    [HttpPost("blind")]
    [ProducesResponseType<IdModel<Guid>>(StatusCodes.Status200OK)]
    public async Task<IActionResult> AddBlindAuctionAsync(
        [FromBody] AddBlindAuctionRequest request, CancellationToken cancellationToken)
    {
        var query = mapper.Map<AddBlindAuctionCommand>(request);
        var response = await mediator.Send(query, cancellationToken);
        
        return Ok(response);
    }
    
    [HttpPost("english")]
    [ProducesResponseType<IdModel<Guid>>(StatusCodes.Status200OK)]
    public async Task<IActionResult> AddEnglishAuctionAsync(
        [FromBody] AddEnglishAuctionRequest request, CancellationToken cancellationToken)
    {
        var query = mapper.Map<AddEnglishAuctionCommand>(request);
        var response = await mediator.Send(query, cancellationToken);
        
        return Ok(response);
    }
}