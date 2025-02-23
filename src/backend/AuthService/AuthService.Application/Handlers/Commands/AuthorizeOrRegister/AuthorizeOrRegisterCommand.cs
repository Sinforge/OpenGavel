using DapperCore.MediatR;
using MediatR;

namespace AuthService.Application.Handlers.Commands.AuthorizeOrRegister;

public sealed record AuthorizeOrRegisterCommand(
    string Address,
    string Signature,
    string Message) : IRequest<AuthorizeOrRegisterResponse>, ITransactional;