using Microsoft.EntityFrameworkCore;
using SalesOrderApp.Domain.Entities;

namespace SalesOrderApp.Infrastructure.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Client> Clients => Set<Client>();
        public DbSet<Item> Items => Set<Item>();
        public DbSet<SalesOrder> SalesOrders => Set<SalesOrder>();
        public DbSet<SalesOrderLine> SalesOrderLines => Set<SalesOrderLine>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Client>(e =>
            {
                e.ToTable("Clients");
                e.Property(p => p.Name).HasMaxLength(200).IsRequired();
            });

            modelBuilder.Entity<Item>(e =>
            {
                e.ToTable("Items");
                e.Property(p => p.Code).HasMaxLength(50).IsRequired();
                e.Property(p => p.Description).HasMaxLength(300).IsRequired();
                e.Property(p => p.Price).HasColumnType("decimal(18,2)");
            });

            modelBuilder.Entity<SalesOrder>(e =>
            {
                e.ToTable("SalesOrders");
                e.Property(p => p.InvoiceNo).HasMaxLength(50).IsRequired();
                e.Property(p => p.TotalExcl).HasColumnType("decimal(18,2)");
                e.Property(p => p.TotalTax).HasColumnType("decimal(18,2)");
                e.Property(p => p.TotalIncl).HasColumnType("decimal(18,2)");
                e.HasOne(p => p.Client)
                    .WithMany(c => c.SalesOrders)
                    .HasForeignKey(p => p.ClientId);
            });

            modelBuilder.Entity<SalesOrderLine>(e =>
            {
                e.ToTable("SalesOrderLines");
                e.Property(p => p.Quantity).HasColumnType("decimal(18,2)");
                e.Property(p => p.Price).HasColumnType("decimal(18,2)");
                e.Property(p => p.TaxRate).HasColumnType("decimal(5,2)");
                e.Property(p => p.ExclAmount).HasColumnType("decimal(18,2)");
                e.Property(p => p.TaxAmount).HasColumnType("decimal(18,2)");
                e.Property(p => p.InclAmount).HasColumnType("decimal(18,2)");
                e.HasOne(p => p.SalesOrder)
                    .WithMany(o => o.Lines)
                    .HasForeignKey(p => p.SalesOrderId)
                    .OnDelete(DeleteBehavior.Cascade);
                e.HasOne(p => p.Item)
                    .WithMany()
                    .HasForeignKey(p => p.ItemId)
                    .OnDelete(DeleteBehavior.Restrict);
            });
        }
    }
}
