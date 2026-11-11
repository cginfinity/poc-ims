using System.ComponentModel.DataAnnotations;

namespace CaseManagement.Api.Models;

public sealed class CaseRecord
{
    [Key]
    public int CaseId { get; set; }
    public int BeneficiaryId { get; set; }
    public string CaseName { get; set; } = string.Empty;
    public string CaseNumber { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public string CaseType { get; set; } = string.Empty;
    public string CaseCountry { get; set; } = string.Empty;
}
