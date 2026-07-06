-- =========================================================
-- SalesOrderApp Database Schema
-- Run this against a SQL Server instance to create the DB.
-- =========================================================
IF DB_ID('SalesOrderAppDb') IS NULL
BEGIN
    CREATE DATABASE SalesOrderAppDb;
END
GO

USE SalesOrderAppDb;
GO

-- ---------------------------------------------------------
-- Clients
-- ---------------------------------------------------------
IF OBJECT_ID('dbo.Clients', 'U') IS NOT NULL DROP TABLE dbo.SalesOrderLines;
IF OBJECT_ID('dbo.SalesOrders', 'U') IS NOT NULL DROP TABLE dbo.SalesOrders;
IF OBJECT_ID('dbo.Items', 'U') IS NOT NULL DROP TABLE dbo.Items;
IF OBJECT_ID('dbo.Clients', 'U') IS NOT NULL DROP TABLE dbo.Clients;
GO

CREATE TABLE dbo.Clients (
    Id          INT IDENTITY(1,1) PRIMARY KEY,
    Name        NVARCHAR(200)  NOT NULL,
    Address1    NVARCHAR(200)  NULL,
    Address2    NVARCHAR(200)  NULL,
    Address3    NVARCHAR(200)  NULL,
    Suburb      NVARCHAR(100)  NULL,
    State       NVARCHAR(100)  NULL,
    PostCode    NVARCHAR(20)   NULL
);
GO

-- ---------------------------------------------------------
-- Items
-- ---------------------------------------------------------
CREATE TABLE dbo.Items (
    Id          INT IDENTITY(1,1) PRIMARY KEY,
    Code        NVARCHAR(50)   NOT NULL,
    Description NVARCHAR(300)  NOT NULL,
    Price       DECIMAL(18,2)  NOT NULL DEFAULT 0
);
GO

-- ---------------------------------------------------------
-- SalesOrders (header)
-- ---------------------------------------------------------
CREATE TABLE dbo.SalesOrders (
    Id           INT IDENTITY(1,1) PRIMARY KEY,
    InvoiceNo    NVARCHAR(50)   NOT NULL,
    InvoiceDate  DATETIME2      NOT NULL DEFAULT SYSUTCDATETIME(),
    ReferenceNo  NVARCHAR(100)  NULL,
    Note         NVARCHAR(1000) NULL,
    ClientId     INT            NOT NULL,
    TotalExcl    DECIMAL(18,2)  NOT NULL DEFAULT 0,
    TotalTax     DECIMAL(18,2)  NOT NULL DEFAULT 0,
    TotalIncl    DECIMAL(18,2)  NOT NULL DEFAULT 0,
    CreatedAt    DATETIME2      NOT NULL DEFAULT SYSUTCDATETIME(),
    UpdatedAt    DATETIME2      NULL,
    CONSTRAINT FK_SalesOrders_Clients FOREIGN KEY (ClientId) REFERENCES dbo.Clients(Id)
);
GO

-- ---------------------------------------------------------
-- SalesOrderLines (detail)
-- ---------------------------------------------------------
CREATE TABLE dbo.SalesOrderLines (
    Id           INT IDENTITY(1,1) PRIMARY KEY,
    SalesOrderId INT            NOT NULL,
    ItemId       INT            NOT NULL,
    Note         NVARCHAR(500)  NULL,
    Quantity     DECIMAL(18,2)  NOT NULL DEFAULT 0,
    Price        DECIMAL(18,2)  NOT NULL DEFAULT 0,
    TaxRate      DECIMAL(5,2)   NOT NULL DEFAULT 0,
    ExclAmount   DECIMAL(18,2)  NOT NULL DEFAULT 0,
    TaxAmount    DECIMAL(18,2)  NOT NULL DEFAULT 0,
    InclAmount   DECIMAL(18,2)  NOT NULL DEFAULT 0,
    CONSTRAINT FK_SalesOrderLines_SalesOrders FOREIGN KEY (SalesOrderId) REFERENCES dbo.SalesOrders(Id) ON DELETE CASCADE,
    CONSTRAINT FK_SalesOrderLines_Items FOREIGN KEY (ItemId) REFERENCES dbo.Items(Id)
);
GO

-- ---------------------------------------------------------
-- Seed data
-- ---------------------------------------------------------
INSERT INTO dbo.Clients (Name, Address1, Address2, Address3, Suburb, State, PostCode) VALUES
('Acme Trading Pvt Ltd', '12 Main Street', 'Unit 4', NULL, 'Colombo', 'Western', '00300'),
('Blue Ocean Enterprises', '45 Galle Road', NULL, NULL, 'Mount Lavinia', 'Western', '10370'),
('Green Valley Foods', '8 Kandy Road', 'Building B', NULL, 'Kandy', 'Central', '20000');
GO

INSERT INTO dbo.Items (Code, Description, Price) VALUES
('ITM-001', 'Office Chair - Standard', 12500.00),
('ITM-002', 'Office Desk - 1.2m', 24500.00),
('ITM-003', 'A4 Copy Paper (Ream)', 950.00),
('ITM-004', 'Whiteboard - 4x3ft', 8500.00),
('ITM-005', 'Laptop Stand', 3200.00);
GO
