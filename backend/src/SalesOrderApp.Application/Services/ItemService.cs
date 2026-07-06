using AutoMapper;
using SalesOrderApp.Application.DTOs;
using SalesOrderApp.Application.Interfaces;

namespace SalesOrderApp.Application.Services
{
    public class ItemService : IItemService
    {
        private readonly IItemRepository _repo;
        private readonly IMapper _mapper;

        public ItemService(IItemRepository repo, IMapper mapper)
        {
            _repo = repo;
            _mapper = mapper;
        }

        public async Task<List<ItemDto>> GetAllAsync()
        {
            var items = await _repo.GetAllAsync();
            return _mapper.Map<List<ItemDto>>(items);
        }
    }
}
