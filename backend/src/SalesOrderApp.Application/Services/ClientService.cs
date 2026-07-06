using AutoMapper;
using SalesOrderApp.Application.DTOs;
using SalesOrderApp.Application.Interfaces;

namespace SalesOrderApp.Application.Services
{
    public class ClientService : IClientService
    {
        private readonly IClientRepository _repo;
        private readonly IMapper _mapper;

        public ClientService(IClientRepository repo, IMapper mapper)
        {
            _repo = repo;
            _mapper = mapper;
        }

        public async Task<List<ClientDto>> GetAllAsync()
        {
            var clients = await _repo.GetAllAsync();
            return _mapper.Map<List<ClientDto>>(clients);
        }

        public async Task<ClientDto?> GetByIdAsync(int id)
        {
            var client = await _repo.GetByIdAsync(id);
            return client == null ? null : _mapper.Map<ClientDto>(client);
        }
    }
}
