using Microsoft.EntityFrameworkCore;
using PcbDefectLogger.Models;

namespace PcbDefectLogger.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }
    
    public DbSet<Defect> Defects => Set<Defect>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Defect>()
            .HasIndex(d => new { d.LotNumber, d.GridX, d.GridY })
            .IsUnique();
    }
}