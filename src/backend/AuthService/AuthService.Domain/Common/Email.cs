using System.Text.RegularExpressions;
using DomainCore;

namespace AuthService.Domain.Common;

public class Email : ValueObject
{
    private static readonly Regex EmailRegex = new(@"^[^@\s]+@[^@\s]+\.[^@\s]+$");
    public string Value { get; private set; }
    protected override IEnumerable<object> GetEqualityComponents()
    {
        yield return Value;
    }

    private Email(string email)
    {
        Value = email;
    }

    public static Email Create(string email)
    {
        if(string.IsNullOrEmpty(email))
            throw new ArgumentNullException(nameof(email));

        if (EmailRegex.IsMatch(email))
            throw new ArgumentException("Not valid email.", nameof(email));
        
        return new(email);
    }
}