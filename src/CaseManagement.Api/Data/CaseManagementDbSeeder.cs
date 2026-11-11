using CaseManagement.Api.Models;

namespace CaseManagement.Api.Data;

public static class CaseManagementDbSeeder
{
    public static void Seed(CaseManagementDbContext context)
    {
        if (!context.Companies.Any(c => c.Id == 1))
        {
            context.Companies.Add(new Company
            {
                Id = 1,
                CompanyName = "ABCD Corp",
                Phone = "(469) 111-2222",
                Email = "info@abcd.test",
                Website = "http://abc.test"
            });
        }

        if (!context.Companies.Any(c => c.Id == 2))
        {
            context.Companies.Add(new Company
            {
                Id = 2,
                CompanyName = "XYZ Corp",
                Phone = "(972) 111-2222",
                Email = "info@xyz.test",
                Website = "http://xyz.test"
            });
        }

        if (!context.Beneficiaries.Any(b => b.Id == 1))
        {
            context.Beneficiaries.Add(new Beneficiary
            {
                Id = 1,
                FirstName = "Daniel",
                LastName = "Kim",
                Email = "daniel.kim@example.com",
                Phone = "+1-972-555-0128",
                ExternalId = "BEN-2026-0003",
                CompanyId = 1,
                IsActive = true
            });
        }

        if (!context.Beneficiaries.Any(b => b.Id == 2))
        {
            context.Beneficiaries.Add(new Beneficiary
            {
                Id = 2,
                FirstName = "Michael",
                LastName = "Johnson",
                Email = "michael.johnson@example.com",
                Phone = "+1-214-555-0174",
                ExternalId = "BEN-2026-0005",
                CompanyId = 1,
                IsActive = true
            });
        }

        if (!context.Cases.Any(c => c.CaseId == 1))
        {
            context.Cases.Add(new CaseRecord
            {
                CaseId = 1,
                BeneficiaryId = 1,
                CaseName = "H1-B Case",
                CaseNumber = "11001",
                Status = "Open",
                CaseType = "H1-B",
                CaseCountry = "US"
            });
        }

        if (!context.Cases.Any(c => c.CaseId == 2))
        {
            context.Cases.Add(new CaseRecord
            {
                CaseId = 2,
                BeneficiaryId = 2,
                CaseName = "L1-A Case",
                CaseNumber = "11002",
                Status = "Open",
                CaseType = "L1-A",
                CaseCountry = "US"
            });
        }

        if (!context.Cases.Any(c => c.CaseId == 3))
        {
            context.Cases.Add(new CaseRecord
            {
                CaseId = 3,
                BeneficiaryId = 1,
                CaseName = "Work Authorization Case",
                CaseNumber = "11002",
                Status = "Open",
                CaseType = "Work Authorization",
                CaseCountry = "US"
            });
        }

        context.SaveChanges();
    }
}
