using AuthService.Application.Exceptions;
using AuthService.Application.Repositories;
using AuthService.Application.Services;
using AuthService.Domain.Entities;
using AuthService.Domain.ValueObjects;
using DapperCore.UoW;
using MediatR;

namespace AuthService.Application.Handlers.Commands.AuthorizeOrRegister;

internal class AuthorizeOrRegisterHandler(IUnitOfWork unitOfWork,
    IUserRepository userRepository,
    IAddressVerifier addressVerifier,
    IJwtTokenService jwtTokenService
    ) : IRequestHandler<AuthorizeOrRegisterCommand, AuthorizeOrRegisterResponse>
{
    public async Task<AuthorizeOrRegisterResponse> Handle(AuthorizeOrRegisterCommand request, CancellationToken cancellationToken)
    {
        if (!addressVerifier.Verify(request.Message, request.Address, request.Signature))
            throw new IncorrectSignatureException();
        
        var userExists = await userRepository.ExistsByWalletAsync(request.Address, cancellationToken);
        if (userExists)
            return new(jwtTokenService.GenerateJwtToken(request.Address));
        
        var walletAddress = WalletAddress.Create(request.Address);
        var wallet = Wallet.Create(walletAddress, WalletProvider.MetaMask);
        var newUser = User.Create(wallet);
        await userRepository.AddUserAsync(newUser, cancellationToken);
        
        unitOfWork.Commit();
        
        return new(jwtTokenService.GenerateJwtToken(request.Address));
    }
    
    
}