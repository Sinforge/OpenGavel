using Asp.Versioning;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace AuthService.Controller;
[ApiVersion("1.0")]
public class UserController(IMediator mediator): ControllerBase
{
}