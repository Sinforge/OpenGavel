using MediatR;

namespace DomainCore.Events;

public interface IDomainEvent : INotification
{
    DateTime OccurredOn { get; }
}