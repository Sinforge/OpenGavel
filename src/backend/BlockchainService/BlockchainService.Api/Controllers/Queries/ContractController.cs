using BlockchainService.Contracts;
using Microsoft.AspNetCore.Mvc;

namespace BlockchainService.Controllers.Queries;

[ApiController]
[Route("api/v1/[controller]")]
public class ContractController(HttpClient client) : ControllerBase
{
    [HttpPost("getLogs")]
    public async Task<IActionResult> GetLogsAsync(
        [FromBody] GetAuctionLogsRequest request,
        CancellationToken cancellationToken)
    {
        var url = $"https://api.etherscan.io/v2/api?chainid={request.ChainId}&module=logs&action=getLogs&address={request.Address}&apikey=MWKSJGICRZI92H5UTZFU2V35WXHX87WSPW";
        Console.WriteLine(url);
        var logs = await client.GetAsync(url, cancellationToken);
        return Ok(await logs.Content.ReadFromJsonAsync<GetAuctionLogsResponse>(cancellationToken));
    }
    
}