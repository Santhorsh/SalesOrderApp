using Microsoft.EntityFrameworkCore;
using SalesOrderApp.Application.Interfaces;
using SalesOrderApp.Domain.Entities;
using SalesOrderApp.Infrastructure.Data;

namespace SalesOrderApp.Infrastructure.Repositories
{
    public class SalesOrderRepository : ISalesOrderRepository
    {
        private readonly AppDbContext _db;
        public SalesOrderRepository(AppDbContext db) => _db = db;

        public async Task<List<SalesOrder>> GetAllAsync() =>
            await _db.SalesOrders
                .AsNoTracking()
                .Include(o => o.Client)
                .OrderByDescending(o => o.InvoiceDate)
                .ToListAsync();

        public async Task<SalesOrder?> GetByIdAsync(int id) =>
            await _db.SalesOrders
                .Include(o => o.Client)
                .Include(o => o.Lines)
                    .ThenInclude(l => l.Item)
                .FirstOrDefaultAsync(o => o.Id == id);

        public async Task AddAsync(SalesOrder order) => await _db.SalesOrders.AddAsync(order);

        public Task UpdateAsync(SalesOrder order)
        {
            _db.SalesOrders.Update(order);
            return Task.CompletedTask;
        }

        public async Task<int> SaveChangesAsync() => await _db.SaveChangesAsync();
    }
}
