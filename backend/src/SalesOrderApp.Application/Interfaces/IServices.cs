using SalesOrderApp.Application.DTOs;

namespace SalesOrderApp.Application.Interfaces
{
    public interface IClientService
    {
        Task<List<ClientDto>> GetAllAsync();
        Task<ClientDto?> GetByIdAsync(int id);
    }

    public interface IItemService
    {
        Task<List<ItemDto>> GetAllAsync();
    }

    public interface ISalesOrderService
    {
        Task<List<SalesOrderListItemDto>> GetAllAsync();
        Task<SalesOrderDto?> GetByIdAsync(int id);
        Task<SalesOrderDto> CreateAsync(SalesOrderUpsertDto dto);
        Task<SalesOrderDto?> UpdateAsync(int id, SalesOrderUpsertDto dto);
    }
}
