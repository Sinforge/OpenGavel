using Asp.Versioning;
using AuthService.Api.Models.User.Authorize;
using AuthService.Application.Handlers.Commands.AuthorizeOrRegister;
using MapsterMapper;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace AuthService.Api.Controller;
[ApiVersion("1.0")]
[Route("api/v{version:apiVersion}/[controller]")]
[ProducesResponseType(StatusCodes.Status400BadRequest)]
public class UserController(IMediator mediator, IMapper mapper): ControllerBase
{
    [HttpPost("/auth")]
    [ProducesResponseType<AuthResponse>(StatusCodes.Status200OK)]
    public async Task<IActionResult> AuthorizeAsync([FromBody] AuthRequest request,
        CancellationToken cancellationToken)
    {
        var response = await mediator.Send(mapper.Map<AuthorizeOrRegisterCommand>(request), cancellationToken);
        return Ok(mapper.Map<AuthResponse>(response));
    }
}