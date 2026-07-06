using AutoMapper;
using SalesOrderApp.Application.DTOs;
using SalesOrderApp.Application.Interfaces;
using SalesOrderApp.Domain.Entities;

namespace SalesOrderApp.Application.Services
{
    public class SalesOrderService : ISalesOrderService
    {
        private readonly ISalesOrderRepository _orderRepo;
        private readonly IItemRepository _itemRepo;
        private readonly IMapper _mapper;

        public SalesOrderService(ISalesOrderRepository orderRepo, IItemRepository itemRepo, IMapper mapper)
        {
            _orderRepo = orderRepo;
            _itemRepo = itemRepo;
            _mapper = mapper;
        }

        public async Task<List<SalesOrderListItemDto>> GetAllAsync()
        {
            var orders = await _orderRepo.GetAllAsync();
            return _mapper.Map<List<SalesOrderListItemDto>>(orders);
        }

        public async Task<SalesOrderDto?> GetByIdAsync(int id)
        {
            var order = await _orderRepo.GetByIdAsync(id);
            return order == null ? null : _mapper.Map<SalesOrderDto>(order);
        }

        public async Task<SalesOrderDto> CreateAsync(SalesOrderUpsertDto dto)
        {
            var order = new SalesOrder
            {
                InvoiceNo = dto.InvoiceNo,
                InvoiceDate = dto.InvoiceDate,
                ReferenceNo = dto.ReferenceNo,
                Note = dto.Note,
                ClientId = dto.ClientId,
                CreatedAt = DateTime.UtcNow
            };

            await BuildLinesAsync(order, dto.Lines);
            ApplyTotals(order);

            await _orderRepo.AddAsync(order);
            await _orderRepo.SaveChangesAsync();

            var saved = await _orderRepo.GetByIdAsync(order.Id);
            return _mapper.Map<SalesOrderDto>(saved);
        }

        public async Task<SalesOrderDto?> UpdateAsync(int id, SalesOrderUpsertDto dto)
        {
            var order = await _orderRepo.GetByIdAsync(id);
            if (order == null) return null;

            order.InvoiceNo = dto.InvoiceNo;
            order.InvoiceDate = dto.InvoiceDate;
            order.ReferenceNo = dto.ReferenceNo;
            order.Note = dto.Note;
            order.ClientId = dto.ClientId;
            order.UpdatedAt = DateTime.UtcNow;

            order.Lines.Clear();
            await BuildLinesAsync(order, dto.Lines);
            ApplyTotals(order);

            await _orderRepo.UpdateAsync(order);
            await _orderRepo.SaveChangesAsync();

            var saved = await _orderRepo.GetByIdAsync(order.Id);
            return _mapper.Map<SalesOrderDto>(saved);
        }

        // Core calculation: Excl = Qty * Price, Tax = Excl * TaxRate/100, Incl = Excl + Tax
        private async Task BuildLinesAsync(SalesOrder order, List<SalesOrderLineUpsertDto> lineDtos)
        {
            foreach (var l in lineDtos)
            {
                var item = await _itemRepo.GetByIdAsync(l.ItemId);
                var price = l.Price != 0 ? l.Price : (item?.Price ?? 0);

                var exclAmount = Math.Round(l.Quantity * price, 2);
                var taxAmount = Math.Round(exclAmount * (l.TaxRate / 100m), 2);
                var inclAmount = exclAmount + taxAmount;

                order.Lines.Add(new SalesOrderLine
                {
                    ItemId = l.ItemId,
                    Note = l.Note,
                    Quantity = l.Quantity,
                    Price = price,
                    TaxRate = l.TaxRate,
                    ExclAmount = exclAmount,
                    TaxAmount = taxAmount,
                    InclAmount = inclAmount
                });
            }
        }

        private static void ApplyTotals(SalesOrder order)
        {
            order.TotalExcl = order.Lines.Sum(l => l.ExclAmount);
            order.TotalTax = order.Lines.Sum(l => l.TaxAmount);
            order.TotalIncl = order.Lines.Sum(l => l.InclAmount);
        }
    }
}
