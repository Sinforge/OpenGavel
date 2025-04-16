namespace LotService.Application.Exceptions;

public abstract class BadRequestException(string message) : BusinessLogicException(400, message);