namespace LotService.Application.Exceptions;

public abstract class NotFoundException(string message) : BusinessLogicException(404, message);