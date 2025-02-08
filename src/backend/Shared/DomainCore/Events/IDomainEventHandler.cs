using MediatR;

namespace DomainCore.Events;

public interface IDomainEventHandler<in T> : INotificationHandler<T> where T : IDomainEvent;