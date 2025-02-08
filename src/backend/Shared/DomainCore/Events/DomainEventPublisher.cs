using MediatR;

namespace DomainCore.Events;

public class DomainEventPublisher(IMediator mediator) : IDomainEventPublisher
{
    private List<IDomainEvent> _events = [];
    public IReadOnlyCollection<IDomainEvent> Events => _events;
    
    public void AddEvent(IDomainEvent @event) => _events.Add(@event);

    public void AddEventRange(IEnumerable<IDomainEvent> domainEvents) => _events.AddRange(domainEvents);

    public async Task HandleEventsAsync(CancellationToken cancellationToken = default)
    {
        foreach (var @event in _events)
        {
            await mediator.Publish(@event, cancellationToken);
        }
    }
}