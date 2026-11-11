using System.ComponentModel.DataAnnotations;

namespace CaseManagement.Api.Models;

public sealed class Company
{
    [Key]
    public int Id { get; set; }
    public string CompanyName { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Website { get; set; } = string.Empty;
}
