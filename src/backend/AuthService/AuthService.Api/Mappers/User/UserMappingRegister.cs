using AuthService.Api.Models.User.Authorize;
using AuthService.Application.Handlers.Commands.AuthorizeOrRegister;
using Mapster;

namespace AuthService.Api.Mappers.User;

public class UserMappingRegister : IRegister
{
    public void Register(TypeAdapterConfig config)
    {
        config.NewConfig<AuthRequest, AuthorizeOrRegisterCommand>();
        config.NewConfig<AuthResponse, AuthorizeOrRegisterResponse>();
    }
}