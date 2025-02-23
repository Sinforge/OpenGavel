using Nethereum.Signer;
using Nethereum.Util;

namespace AuthService.Application.Services;

public class AddressVerifier : IAddressVerifier
{
    public bool Verify(string originalMessage, string expectedAddress, string signature)
    {
        var signer = new EthereumMessageSigner();
        // Recover the address from the signature
        var recoveredAddress = signer.EncodeUTF8AndEcRecover(originalMessage, signature);
        
        // Convert addresses to checksum format for comparison
        var addressUtil = new AddressUtil();
        var checksumRecovered = addressUtil.ConvertToChecksumAddress(recoveredAddress);
        var checksumExpected = addressUtil.ConvertToChecksumAddress(expectedAddress);
        
        return checksumRecovered.Equals(checksumExpected, StringComparison.OrdinalIgnoreCase);
    }
}