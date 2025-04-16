using LotService.Api.Contracts.Auction.GetAuctionById;
using LotService.Api.Contracts.Auction.GetAuctions;
using LotService.Api.Contracts.Auction.GetUserAuctions;
using LotService.Application.Handlers.Queries.GetAuctionInfo;
using LotService.Application.Handlers.Queries.GetAuctionOptions;
using LotService.Application.Handlers.Queries.GetAuctions;
using LotService.Application.Handlers.Queries.GetUserAuctions;
using MapsterMapper;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using GetUserAuctionsResponse = LotService.Api.Contracts.Auction.GetUserAuctions.GetUserAuctionsResponse;

namespace LotService.Api.Controllers.Queries;

[ApiController]
[Route("api/v1/queries/[controller]")]
public class AuctionController(IMediator mediator, IMapper mapper) : ControllerBase
{
    [HttpGet("{id:guid}/deploy")]
    [ProducesResponseType<object>(StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAuctionDeployOptionsAsync(
        [FromRoute] Guid id, CancellationToken cancellationToken)
    {
        var query = new GetAuctionOptionsQuery(id);
        
        var response = await mediator.Send(query, cancellationToken);
        
        return Ok(response);
    }
    
    
    [HttpGet("{id:guid}")]
    [ProducesResponseType<GetAuctionResponse>(StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAuctionAsync(
        [FromRoute] Guid id, CancellationToken cancellationToken)
    {
        var query = new GetAuctionInfoQuery(id);
        
        var response = await mediator.Send(query, cancellationToken);
        
        return Ok(mapper.Map<GetAuctionResponse>(response));
    }
    
    
    [HttpPost("my")]
    [ProducesResponseType<GetUserAuctionsResponse>(StatusCodes.Status200OK)]
    public async Task<IActionResult> GetUserAuctionsAsync(
        [FromBody] GetUserAuctionsRequest request, CancellationToken cancellationToken)
    {
        var query = mapper.Map<GetUserAuctionsQuery>(request);
        
        var response = await mediator.Send(query, cancellationToken);
        
        return Ok(mapper.Map<GetUserAuctionsResponse>(response));
    }

    [HttpPost]
    [ProducesResponseType<GetAuctionsResponse>(StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAuctionsAsync(
        [FromBody] GetAuctionsRequest request, CancellationToken cancellationToken)
    {
        var query = mapper.Map<GetAuctionsQuery>(request);
        
        var response = await mediator.Send(query, cancellationToken);
        
        return Ok(mapper.Map<GetAuctionsResponse>(response));
    }
}