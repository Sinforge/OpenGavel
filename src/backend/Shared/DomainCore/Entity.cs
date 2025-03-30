namespace DomainCore;

public abstract class Entity<T> : IEquatable<Entity<T>>
    where T : notnull
{
    public T Id { get; }

    protected Entity() { }

    protected Entity(T id)
    {
        Id = id;
    }

    public bool Equals(Entity<T>? other)
    {
        if (other is null) return false;
        if (ReferenceEquals(this, other)) return true;
        return EqualityComparer<T>.Default.Equals(Id, other.Id);
    }

    public override bool Equals(object? obj)
    {
        if (obj is null) return false;
        if (ReferenceEquals(this, obj)) return true;
        if (obj.GetType() != GetType()) return false;
        return ((Entity<T>)obj).Id.Equals(Id);
    }

    public override int GetHashCode() => Id.GetHashCode();
    
    public static bool operator ==(Entity<T>? left, Entity<T>? right)
    {
        return Equals(left, right);
    }

    public static bool operator !=(Entity<T> left, Entity<T> right)
    {
        return !Equals(left, right);
    }
    
    
}