using SalesOrderApp.Domain.Entities;

namespace SalesOrderApp.Application.Interfaces
{
    public interface IClientRepository
    {
        Task<List<Client>> GetAllAsync();
        Task<Client?> GetByIdAsync(int id);
    }

    public interface IItemRepository
    {
        Task<List<Item>> GetAllAsync();
        Task<Item?> GetByIdAsync(int id);
    }

    public interface ISalesOrderRepository
    {
        Task<List<SalesOrder>> GetAllAsync();
        Task<SalesOrder?> GetByIdAsync(int id);
        Task AddAsync(SalesOrder order);
        Task UpdateAsync(SalesOrder order);
        Task<int> SaveChangesAsync();
    }
}
