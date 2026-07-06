namespace SalesOrderApp.Application.DTOs
{
    // Used for the Home screen grid
    public class SalesOrderListItemDto
    {
        public int Id { get; set; }
        public string InvoiceNo { get; set; } = string.Empty;
        public DateTime InvoiceDate { get; set; }
        public string? ReferenceNo { get; set; }
        public string ClientName { get; set; } = string.Empty;
        public decimal TotalExcl { get; set; }
        public decimal TotalTax { get; set; }
        public decimal TotalIncl { get; set; }
    }

    public class SalesOrderLineDto
    {
        public int Id { get; set; }
        public int ItemId { get; set; }
        public string ItemCode { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string? Note { get; set; }
        public decimal Quantity { get; set; }
        public decimal Price { get; set; }
        public decimal TaxRate { get; set; }
        public decimal ExclAmount { get; set; }
        public decimal TaxAmount { get; set; }
        public decimal InclAmount { get; set; }
    }

    // Full detail, used when opening/editing an order
    public class SalesOrderDto
    {
        public int Id { get; set; }
        public string InvoiceNo { get; set; } = string.Empty;
        public DateTime InvoiceDate { get; set; }
        public string? ReferenceNo { get; set; }
        public string? Note { get; set; }
        public int ClientId { get; set; }
        public decimal TotalExcl { get; set; }
        public decimal TotalTax { get; set; }
        public decimal TotalIncl { get; set; }
        public List<SalesOrderLineDto> Lines { get; set; } = new();
    }

    // Payload for create/update
    public class SalesOrderLineUpsertDto
    {
        public int? Id { get; set; }
        public int ItemId { get; set; }
        public string? Note { get; set; }
        public decimal Quantity { get; set; }
        public decimal Price { get; set; }
        public decimal TaxRate { get; set; }
    }

    public class SalesOrderUpsertDto
    {
        public string InvoiceNo { get; set; } = string.Empty;
        public DateTime InvoiceDate { get; set; }
        public string? ReferenceNo { get; set; }
        public string? Note { get; set; }
        public int ClientId { get; set; }
        public List<SalesOrderLineUpsertDto> Lines { get; set; } = new();
    }
}
