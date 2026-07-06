using AutoMapper;
using SalesOrderApp.Application.DTOs;
using SalesOrderApp.Domain.Entities;

namespace SalesOrderApp.Application.Mappings
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<Client, ClientDto>();
            CreateMap<Item, ItemDto>();

            CreateMap<SalesOrder, SalesOrderListItemDto>()
                .ForMember(d => d.ClientName, o => o.MapFrom(s => s.Client != null ? s.Client.Name : string.Empty));

            CreateMap<SalesOrder, SalesOrderDto>()
                .ForMember(d => d.Lines, o => o.MapFrom(s => s.Lines));

            CreateMap<SalesOrderLine, SalesOrderLineDto>()
                .ForMember(d => d.ItemCode, o => o.MapFrom(s => s.Item != null ? s.Item.Code : string.Empty))
                .ForMember(d => d.Description, o => o.MapFrom(s => s.Item != null ? s.Item.Description : string.Empty));
        }
    }
}
