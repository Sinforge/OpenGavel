namespace LotService.Application.Exceptions;

public abstract class BusinessLogicException(int statusCode, string message) : Exception(message)
{
    public int StatusCode { get; init; } = statusCode;
}