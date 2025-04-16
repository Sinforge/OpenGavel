using DomainCore;

namespace LotService.Domain.ValueObjects;

public class DateTimeRange : ValueObject
{
    public DateTime StartTime { get; private set; }
    public DateTime EndTime { get; private set; }
    
    protected override IEnumerable<object> GetEqualityComponents()
    {
        yield return StartTime;
        yield return EndTime;
    }

    private DateTimeRange(DateTime startTime, DateTime endTime)
    {
        if (startTime > endTime)
            throw new ArgumentException("Start time cannot be greater than end time");
        
        StartTime = startTime;
        EndTime = endTime;
    }

    public static DateTimeRange Create(DateTime startTime, DateTime endTime)
        => new(startTime, endTime);
}