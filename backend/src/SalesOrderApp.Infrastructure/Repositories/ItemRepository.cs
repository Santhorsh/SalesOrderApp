using Microsoft.EntityFrameworkCore;
using SalesOrderApp.Application.Interfaces;
using SalesOrderApp.Domain.Entities;
using SalesOrderApp.Infrastructure.Data;

namespace SalesOrderApp.Infrastructure.Repositories
{
    public class ItemRepository : IItemRepository
    {
        private readonly AppDbContext _db;
        public ItemRepository(AppDbContext db) => _db = db;

        public async Task<List<Item>> GetAllAsync() =>
            await _db.Items.AsNoTracking().OrderBy(i => i.Code).ToListAsync();

        public async Task<Item?> GetByIdAsync(int id) =>
            await _db.Items.AsNoTracking().FirstOrDefaultAsync(i => i.Id == id);
    }
}
