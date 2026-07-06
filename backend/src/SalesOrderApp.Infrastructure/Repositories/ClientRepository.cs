using Microsoft.EntityFrameworkCore;
using SalesOrderApp.Application.Interfaces;
using SalesOrderApp.Domain.Entities;
using SalesOrderApp.Infrastructure.Data;

namespace SalesOrderApp.Infrastructure.Repositories
{
    public class ClientRepository : IClientRepository
    {
        private readonly AppDbContext _db;
        public ClientRepository(AppDbContext db) => _db = db;

        public async Task<List<Client>> GetAllAsync() =>
            await _db.Clients.AsNoTracking().OrderBy(c => c.Name).ToListAsync();

        public async Task<Client?> GetByIdAsync(int id) =>
            await _db.Clients.AsNoTracking().FirstOrDefaultAsync(c => c.Id == id);
    }
}
