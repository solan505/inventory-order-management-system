# Inventory & Order Management System

A production-ready full-stack inventory and order management system built with FastAPI, React, PostgreSQL, Docker, and Docker Compose.

## Features

- Product management: create, list, view, update, and delete products.
- Customer management: create, list, view, and delete customers.
- Order management: create, list, view details, and delete/cancel orders.
- Inventory tracking with automatic stock reduction on order creation.
- Backend-calculated order totals.
- Dashboard summary for products, customers, orders, and low-stock products.
- Responsive React UI with validation and clear success/error states.
- PostgreSQL persistence with named Docker volume.
- Environment-variable driven configuration.
- Render backend deployment config and Vercel frontend deployment config.

## Architecture

```text
inventory-order-management-system/
  backend/
    app/
      api/          FastAPI routers
      core/         settings and database session
      models/       SQLAlchemy models
      schemas/      Pydantic schemas
      services/     business logic and transactions
      main.py       application entrypoint
    tests/          focused business-rule tests
    Dockerfile
  frontend/
    src/
      components/   shared React components
      pages/        dashboard and CRUD/order views
      services/     API client
      styles/       responsive CSS
    Dockerfile
    nginx.conf
    vercel.json
  docker-compose.yml
  render.yaml
  .env.example
```

## API Endpoints

### Products

- `POST /products` - Create a product.
- `GET /products` - Retrieve all products.
- `GET /products/{id}` - Retrieve one product.
- `PUT /products/{id}` - Update product details.
- `DELETE /products/{id}` - Delete a product.

### Customers

- `POST /customers` - Create a customer.
- `GET /customers` - Retrieve all customers.
- `GET /customers/{id}` - Retrieve one customer.
- `DELETE /customers/{id}` - Delete a customer when it has no orders.

### Orders

- `POST /orders` - Create an order.
- `GET /orders` - Retrieve all orders.
- `GET /orders/{id}` - Retrieve one order with line items.
- `DELETE /orders/{id}` - Delete/cancel an order and restore stock for existing products.

### Dashboard and Health

- `GET /dashboard` - Summary counts and low-stock products.
- `GET /health` - Service health check.
- `GET /docs` - FastAPI OpenAPI documentation.

## Business Rules

- Product SKU/code is unique.
- Customer email is unique.
- Product quantity cannot be negative.
- Product price must be greater than zero.
- Orders cannot be placed when inventory is insufficient.
- Creating an order automatically reduces available product stock.
- Order totals and line totals are calculated by the backend.
- Validation errors, missing resources, duplicates, and stock conflicts return appropriate HTTP status codes.

## Local Development

Copy the environment template:

```bash
cp .env.example .env
```

Run the complete stack:

```bash
docker compose up --build
```

Open:

- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:8000`
- API docs: `http://localhost:8000/docs`

## Backend Development

```bash
cd backend
python -m venv .venv
. .venv/Scripts/activate
pip install -r requirements-dev.txt
uvicorn app.main:app --reload
```

Set `DATABASE_URL` before running locally without Docker. Example:

```bash
set DATABASE_URL=postgresql+psycopg://inventory:inventory_password@localhost:5432/inventory_db
```

Run backend tests:

```bash
pytest
```

## Frontend Development

```bash
cd frontend
npm install
npm run dev
```

The Vite dev server proxies `/api` to `http://localhost:8000`.

## Docker Images

Build the backend image:

```bash
docker build -t your-dockerhub-username/inventory-order-backend:latest ./backend
```

Push it to Docker Hub:

```bash
docker push your-dockerhub-username/inventory-order-backend:latest
```

Use the resulting Docker Hub URL in the assessment submission.

## Deployment Guide

See `DEPLOYMENT.md` for the complete step-by-step deployment workflow covering GitHub, Docker Hub, Render, Vercel, required environment variables, and production verification.

## Render Backend Deployment

This repository includes `render.yaml` for a Render Blueprint deployment with:

- Dockerized FastAPI backend.
- Managed PostgreSQL database.
- `/health` health check.

After the backend is deployed, set:

- `CORS_ORIGINS` to the Vercel frontend URL.
- `LOW_STOCK_THRESHOLD` if a different low-stock threshold is required.

Render provides `DATABASE_URL`; the backend normalizes Render's PostgreSQL URL for the installed SQLAlchemy driver.

## Vercel Frontend Deployment

Deploy the `frontend` directory to Vercel and set:

```text
VITE_API_BASE_URL=https://your-render-backend-url.onrender.com
```

The included `frontend/vercel.json` configures Vite build output and SPA rewrites.

## Required Submission Links

- GitHub repository link: `https://github.com/<your-user>/<your-repo>`
- Backend Docker Hub image link: `https://hub.docker.com/r/<your-user>/inventory-order-backend`
- Frontend hosted URL: Vercel deployment URL
- Backend API hosted URL: Render deployment URL
## Live Deployment

Frontend:
https://your-vercel-url.vercel.app

Backend:
https://inventory-order-api-i7hu.onrender.com

Docker Image:
https://hub.docker.com/r/solan3006/inventory-order-api
## Docker

Pull image:

docker pull solan3006/inventory-order-api

Docker Hub:
https://hub.docker.com/r/solan3006/inventory-order-api