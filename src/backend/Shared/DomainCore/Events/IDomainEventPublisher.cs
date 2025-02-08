namespace DomainCore.Events;

public interface IDomainEventPublisher
{
    IReadOnlyCollection<IDomainEvent> Events { get; }
    
    void AddEvent(IDomainEvent @event);
    void AddEventRange(IEnumerable<IDomainEvent> domainEvents);
    Task HandleEventsAsync(CancellationToken cancellationToken);
}