using CaseManagement.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace CaseManagement.Api.Data
{
    public class CaseManagementDbContext : DbContext
    {
        public CaseManagementDbContext(DbContextOptions<CaseManagementDbContext> options) : base(options) { }

        public DbSet<Company> Companies { get; set; }
        public DbSet<Beneficiary> Beneficiaries { get; set; }
        public DbSet<CaseRecord> Cases { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Company>()
                .ToTable("Company");

            modelBuilder.Entity<Beneficiary>()
                .ToTable("Beneficiary");

            modelBuilder.Entity<CaseRecord>()
                .ToTable("CaseRecord");
        }
    }
}
