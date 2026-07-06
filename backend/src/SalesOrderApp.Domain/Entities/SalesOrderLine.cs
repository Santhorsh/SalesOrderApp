namespace SalesOrderApp.Domain.Entities
{
    public class SalesOrderLine
    {
        public int Id { get; set; }

        public int SalesOrderId { get; set; }
        public SalesOrder? SalesOrder { get; set; }

        public int ItemId { get; set; }
        public Item? Item { get; set; }

        public string? Note { get; set; }
        public decimal Quantity { get; set; }
        public decimal Price { get; set; }
        public decimal TaxRate { get; set; }

        public decimal ExclAmount { get; set; }
        public decimal TaxAmount { get; set; }
        public decimal InclAmount { get; set; }
    }
}
