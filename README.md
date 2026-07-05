# Sales Order App

A Sales Order entry system built with **.NET 8 Web API** (Clean/N-Tier architecture, EF Core, SQL Server) and a **React + Redux Toolkit + Tailwind CSS** frontend, per the SPIL Labs assignment brief.

## Structure

```
SalesOrderApp/
├── backend/
│   ├── SalesOrderApp.sln
│   └── src/
│       ├── SalesOrderApp.API/            # Controllers, Program.cs, appsettings
│       ├── SalesOrderApp.Application/    # DTOs, service interfaces/implementations, AutoMapper
│       ├── SalesOrderApp.Domain/         # Entities
│       └── SalesOrderApp.Infrastructure/ # EF Core DbContext + Repositories
├── database/
│   └── schema.sql                        # Creates DB, tables, and seed data
└── frontend/
    └── src/
        ├── pages/        # HomePage (Screen 2), SalesOrderPage (Screen 1)
        ├── components/   # OrderLineTable (item grid with live calculations)
        ├── redux/        # store + slices (customers, items, orders)
        └── services/     # axios API client
```

## Backend setup

1. Install the [.NET 8 SDK](https://dotnet.microsoft.com/download) and SQL Server (LocalDB or full instance).
2. Create the database by running `database/schema.sql` against your SQL Server instance (e.g. via SSMS or `sqlcmd`).
3. Update the connection string in `backend/src/SalesOrderApp.API/appsettings.json` if your SQL Server instance/credentials differ from the default (`Server=localhost;Database=SalesOrderAppDb;Trusted_Connection=True;TrustServerCertificate=True;`).
4. From the `backend` folder, run:
   ```
   dotnet restore
   dotnet run --project src/SalesOrderApp.API
   ```
5. The API will start (by default) on `https://localhost:5001` (or the port shown in the console) with Swagger UI at `/swagger`.

## Frontend setup

1. Install [Node.js](https://nodejs.org/) (18+ recommended).
2. From the `frontend` folder:
   ```
   npm install
   npm start
   ```
3. The app opens at `http://localhost:3000`.
4. If your API runs on a different port, update `REACT_APP_API_BASE_URL` in `frontend/.env`.

## Feature notes

- **Screen 2 (Home)** — landing page, "Add New" opens the Sales Order screen; grid lists saved orders; double-clicking a row opens that order for editing.
- **Screen 1 (Sales Order)** — Customer dropdown populated from `Client` table; selecting a customer auto-fills the address fields (still editable); Item Code / Description dropdowns both populate from and select the same `Item`; line calculations follow:
  - `Excl Amount = Quantity * Price`
  - `Tax Amount = Excl Amount * TaxRate / 100`
  - `Incl Amount = Excl Amount + Tax Amount`
  - Totals are summed live across all lines.
- **Print** — a basic browser print (`window.print()`) is wired to the Print button; swap in a reporting library (e.g. Rotativa, QuestPDF) for a formatted PDF if needed.

## API endpoints

| Method | Route                     | Purpose                          |
|--------|---------------------------|-----------------------------------|
| GET    | /api/clients              | List customers                   |
| GET    | /api/clients/{id}         | Get a single customer            |
| GET    | /api/items                | List items                       |
| GET    | /api/salesorders          | List orders (Home grid)          |
| GET    | /api/salesorders/{id}     | Get order detail (for edit)      |
| POST   | /api/salesorders          | Create a new order                |
| PUT    | /api/salesorders/{id}     | Update an existing order          |

## What's left / suggested next steps

- Authentication (not specified in the brief, so omitted).
- EF Core Migrations (the provided `schema.sql` can be used instead of `dotnet ef migrations`; migrations can be added with `dotnet ef migrations add Initial` once the SDK/tools are installed).
- A dedicated PDF/print template for the sales order.
- Validation (required fields, duplicate invoice numbers, etc.) and unit tests.
