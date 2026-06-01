# Deployment Instructions

This guide is for the generated project at:

```text
inventory-order-management-system/
  backend/
  frontend/
  docker-compose.yml
  render.yaml
```

Replace placeholder values such as `<github-username>`, `<repo-name>`, and `<dockerhub-username>` with your own account names.

## 1. GitHub Repository Creation

### Option A: Create and Push with GitHub CLI

Run these commands from PowerShell:

```powershell
cd "C:\Users\ASUS\Documents\Codex\2026-06-01\files-mentioned-by-the-user-pasted\outputs\inventory-order-management-system"

git init
git add .
git commit -m "Initial inventory order management system"
git branch -M main

gh auth login
gh repo create inventory-order-management-system --public --source=. --remote=origin --push
```

After this, your repository URL will look like:

```text
https://github.com/<github-username>/inventory-order-management-system
```

### Option B: Create Repository on GitHub Website

1. Go to `https://github.com/new`.
2. Repository name: `inventory-order-management-system`.
3. Choose `Public` or `Private`.
4. Do not initialize with README, `.gitignore`, or license because this project already includes those files.
5. Click `Create repository`.
6. Copy the repository URL from GitHub.

## 2. Commands to Push Code to GitHub

Use these commands if you created the GitHub repository manually:

```powershell
cd "C:\Users\ASUS\Documents\Codex\2026-06-01\files-mentioned-by-the-user-pasted\outputs\inventory-order-management-system"

git init
git add .
git commit -m "Initial inventory order management system"
git branch -M main
git remote add origin https://github.com/<github-username>/inventory-order-management-system.git
git remote -v
git push -u origin main
```

For later updates:

```powershell
git status
git add .
git commit -m "Update deployment configuration"
git push
```

## 3. Docker Hub Login, Build, Tag, and Push

The assessment asks for a backend Docker Hub image link. This project builds the backend image from `backend/Dockerfile`.

1. Create a Docker Hub repository named `inventory-order-backend`.
2. Login locally:

```powershell
docker login
```

3. Build the backend image:

```powershell
cd "C:\Users\ASUS\Documents\Codex\2026-06-01\files-mentioned-by-the-user-pasted\outputs\inventory-order-management-system"

docker build -t <dockerhub-username>/inventory-order-backend:latest .\backend
```

4. Add an optional version tag:

```powershell
docker tag <dockerhub-username>/inventory-order-backend:latest <dockerhub-username>/inventory-order-backend:v1.0.0
```

5. Push both tags:

```powershell
docker push <dockerhub-username>/inventory-order-backend:latest
docker push <dockerhub-username>/inventory-order-backend:v1.0.0
```

Your Docker Hub image link will be:

```text
https://hub.docker.com/r/<dockerhub-username>/inventory-order-backend
```

Optional local Docker verification:

```powershell
docker run --rm -p 8000:8000 `
  -e DATABASE_URL="sqlite+pysqlite:///:memory:" `
  -e CORS_ORIGINS="http://localhost:3000" `
  <dockerhub-username>/inventory-order-backend:latest
```

Then open:

```text
http://localhost:8000/health
```

## 4. Render Backend Deployment

This project includes `render.yaml` at the repository root. It creates:

- A Render PostgreSQL database named `inventory-order-postgres`.
- A Docker-based FastAPI web service named `inventory-order-api`.
- A `/health` health check.

### Blueprint Deployment

1. Push the project to GitHub first.
2. Go to `https://dashboard.render.com`.
3. Click `New +`.
4. Select `Blueprint`.
5. Connect the GitHub repository.
6. Select the repository containing `render.yaml`.
7. Render will detect the Blueprint and create the database plus backend web service.
8. When Render prompts for `CORS_ORIGINS`, enter a temporary value if the Vercel URL is not ready yet:

```text
http://localhost:3000,http://localhost:5173
```

9. Click `Apply` or `Deploy`.
10. Wait for the backend deploy to finish.
11. Copy the Render backend URL. It will look like:

```text
https://inventory-order-api.onrender.com
```

### Important Render Configuration

The generated `render.yaml` uses:

```yaml
dockerfilePath: backend/Dockerfile
dockerContext: backend
healthCheckPath: /health
```

The backend Dockerfile starts FastAPI with:

```text
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

So `render.yaml` sets:

```text
PORT=8000
```

After Vercel is deployed, return to Render and update `CORS_ORIGINS` to your real frontend URL:

```text
https://<your-vercel-project>.vercel.app
```

If you want to keep local development allowed too:

```text
https://<your-vercel-project>.vercel.app,http://localhost:3000,http://localhost:5173
```

Redeploy the Render service after changing environment variables.

## 5. Vercel Frontend Deployment

The frontend lives in the `frontend/` directory and includes `frontend/vercel.json`.

1. Go to `https://vercel.com/new`.
2. Import the same GitHub repository.
3. Set the project root directory to:

```text
frontend
```

4. Vercel should detect Vite. If you need to enter settings manually:

```text
Framework Preset: Vite
Install Command: npm install
Build Command: npm run build
Output Directory: dist
```

5. Add the frontend environment variable:

```text
VITE_API_BASE_URL=https://<your-render-backend-url>.onrender.com
```

Example:

```text
VITE_API_BASE_URL=https://inventory-order-api.onrender.com
```

6. Click `Deploy`.
7. Copy the Vercel frontend URL. It will look like:

```text
https://inventory-order-management-system.vercel.app
```

8. Go back to Render and update `CORS_ORIGINS` to include this Vercel URL.
9. Redeploy the Render backend.
10. If you change `VITE_API_BASE_URL`, redeploy the Vercel frontend because Vite injects `VITE_*` variables at build time.

## 6. Environment Variables Required

### Local Docker Compose

Create a local `.env` file from `.env.example`:

```powershell
cd "C:\Users\ASUS\Documents\Codex\2026-06-01\files-mentioned-by-the-user-pasted\outputs\inventory-order-management-system"
Copy-Item .env.example .env
```

Required local variables:

| Variable | Example | Used by |
| --- | --- | --- |
| `POSTGRES_DB` | `inventory_db` | PostgreSQL container |
| `POSTGRES_USER` | `inventory` | PostgreSQL container |
| `POSTGRES_PASSWORD` | `change_me_to_a_strong_password` | PostgreSQL container |
| `DATABASE_URL` | `postgresql+psycopg://inventory:change_me_to_a_strong_password@db:5432/inventory_db` | Backend if run directly |
| `CORS_ORIGINS` | `http://localhost:3000,http://localhost:5173` | Backend CORS |
| `LOW_STOCK_THRESHOLD` | `5` | Dashboard low-stock calculation |
| `VITE_API_BASE_URL` | `/api` | Frontend Docker build |

Run locally:

```powershell
docker compose up --build
```

### Render Backend

If using the included `render.yaml`, most variables are created from the Blueprint:

| Variable | Value | Notes |
| --- | --- | --- |
| `DATABASE_URL` | Render PostgreSQL connection string | Created from `fromDatabase` in `render.yaml` |
| `ENVIRONMENT` | `production` | Set in `render.yaml` |
| `CORS_ORIGINS` | `https://<your-vercel-project>.vercel.app` | Must be entered/updated in Render |
| `LOW_STOCK_THRESHOLD` | `5` | Set in `render.yaml` |
| `PORT` | `8000` | Set in `render.yaml` to match backend Docker CMD |

Do not commit real database credentials to GitHub.

### Vercel Frontend

| Variable | Value | Notes |
| --- | --- | --- |
| `VITE_API_BASE_URL` | `https://<your-render-backend-url>.onrender.com` | Required for the React app to call the deployed backend |

Use the full Render backend origin only, without a trailing slash.

### Docker Hub

Docker Hub does not need project runtime environment variables. You only need Docker CLI authentication:

```powershell
docker login
```

If your Docker Hub account uses two-factor authentication, use a Docker Hub access token as the password.

## 7. Verify the Deployment

### Backend Health Check

Replace `$API` with your Render backend URL:

```powershell
$API = "https://<your-render-backend-url>.onrender.com"

Invoke-RestMethod "$API/health"
```

Expected response:

```json
{
  "status": "ok",
  "environment": "production"
}
```

Open API docs:

```text
https://<your-render-backend-url>.onrender.com/docs
```

### Backend CRUD and Business Rule Test

Run these from PowerShell:

```powershell
$API = "https://<your-render-backend-url>.onrender.com"
$suffix = Get-Random

$product = Invoke-RestMethod `
  -Method Post `
  -Uri "$API/products" `
  -ContentType "application/json" `
  -Body "{`"name`":`"Deployment Test Product`",`"sku`":`"DEPLOY-$suffix`",`"price`":`"19.99`",`"quantity_in_stock`":10}"

$customer = Invoke-RestMethod `
  -Method Post `
  -Uri "$API/customers" `
  -ContentType "application/json" `
  -Body "{`"full_name`":`"Deployment Tester`",`"email`":`"tester$suffix@example.com`",`"phone_number`":`"+1-555-0101`"}"

$orderBody = @{
  customer_id = $customer.id
  items = @(
    @{
      product_id = $product.id
      quantity = 2
    }
  )
} | ConvertTo-Json -Depth 5

$order = Invoke-RestMethod `
  -Method Post `
  -Uri "$API/orders" `
  -ContentType "application/json" `
  -Body $orderBody

$updatedProduct = Invoke-RestMethod "$API/products/$($product.id)"
$dashboard = Invoke-RestMethod "$API/dashboard"

$order
$updatedProduct
$dashboard
```

Expected results:

- Order is created successfully.
- `total_amount` is calculated by the backend.
- Product `quantity_in_stock` decreases from `10` to `8`.
- Dashboard totals increase.

### Insufficient Inventory Verification

```powershell
$badOrderBody = @{
  customer_id = $customer.id
  items = @(
    @{
      product_id = $product.id
      quantity = 99999
    }
  )
} | ConvertTo-Json -Depth 5

try {
  Invoke-RestMethod `
    -Method Post `
    -Uri "$API/orders" `
    -ContentType "application/json" `
    -Body $badOrderBody
} catch {
  $_.Exception.Response.StatusCode.value__
}
```

Expected status:

```text
409
```

### Frontend Verification

1. Open your Vercel URL:

```text
https://<your-vercel-project>.vercel.app
```

2. Confirm the dashboard loads.
3. Add a product.
4. Add a customer.
5. Create an order.
6. Confirm the order appears in the order list.
7. Confirm the product stock decreased.
8. Confirm low-stock products appear on the dashboard when stock is at or below `LOW_STOCK_THRESHOLD`.

### Browser CORS Verification

If the frontend loads but API calls fail:

1. Open browser developer tools.
2. Check the Console and Network tabs.
3. If you see a CORS error, update Render `CORS_ORIGINS` to include the exact Vercel URL.
4. Redeploy the Render backend.
5. Refresh the Vercel frontend.

## Submission Values

After completing deployment, submit:

| Submission field | Value |
| --- | --- |
| GitHub Repository Link | `https://github.com/<github-username>/inventory-order-management-system` |
| Backend Docker Hub Image Link | `https://hub.docker.com/r/<dockerhub-username>/inventory-order-backend` |
| Frontend Hosted URL | `https://<your-vercel-project>.vercel.app` |
| Backend API Hosted URL | `https://<your-render-backend-url>.onrender.com` |

## Troubleshooting

### Render deploy fails with port error

Confirm `render.yaml` includes:

```yaml
- key: PORT
  value: "8000"
```

Also confirm `backend/Dockerfile` starts Uvicorn on `0.0.0.0:8000`.

### Vercel frontend cannot reach backend

Confirm `VITE_API_BASE_URL` is set to the Render backend URL and redeploy Vercel.

### Browser shows CORS error

Confirm Render `CORS_ORIGINS` contains the exact Vercel frontend URL. Include no trailing slash.

### Database tables are missing

The backend creates tables on startup in `backend/app/core/database.py` through `init_db()`. Restart or redeploy the Render backend if the database was created after the service started.

## Reference Documentation

- GitHub: https://docs.github.com/github/importing-your-projects-to-github/adding-an-existing-project-to-github-using-the-command-line
- Docker Hub images: https://docs.docker.com/docker-hub/repos/manage/hub-images/
- Render Blueprint YAML: https://render.com/docs/blueprint-spec
- Render Docker services: https://render.com/docs/docker
- Render web service ports: https://render.com/docs/web-services
- Vercel Vite deployments: https://vercel.com/docs/frameworks/vite
- Vercel environment variables: https://vercel.com/docs/projects/environment-variables
