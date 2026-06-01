# Requirement Checklist

| Requirement | Implemented | File location |
| --- | --- | --- |
| Build an Inventory & Order Management System | Yes | `README.md`, `backend/app/main.py`, `frontend/src/App.jsx` |
| Manage products | Yes | `backend/app/api/products.py`, `backend/app/services/products.py`, `frontend/src/pages/ProductsPage.jsx` |
| Manage customers | Yes | `backend/app/api/customers.py`, `backend/app/services/customers.py`, `frontend/src/pages/CustomersPage.jsx` |
| Manage orders | Yes | `backend/app/api/orders.py`, `backend/app/services/orders.py`, `frontend/src/pages/OrdersPage.jsx` |
| Inventory tracking | Yes | `backend/app/models/product.py`, `backend/app/services/orders.py`, `frontend/src/pages/Dashboard.jsx` |
| Python backend | Yes | `backend/app/main.py`, `backend/requirements.txt` |
| FastAPI backend API | Yes | `backend/app/main.py`, `backend/app/api/*.py` |
| React frontend | Yes | `frontend/package.json`, `frontend/src/main.jsx`, `frontend/src/App.jsx` |
| PostgreSQL database | Yes | `docker-compose.yml`, `backend/app/core/database.py`, `backend/requirements.txt` |
| SQLAlchemy ORM | Yes | `backend/app/models/*.py`, `backend/app/core/database.py` |
| Docker containerization | Yes | `backend/Dockerfile`, `frontend/Dockerfile`, `.dockerignore`, `backend/.dockerignore`, `frontend/.dockerignore` |
| Docker Compose orchestration | Yes | `docker-compose.yml` |
| Git-ready repository files | Yes | `.gitignore`, `README.md` |
| `POST /products` | Yes | `backend/app/api/products.py` |
| `GET /products` | Yes | `backend/app/api/products.py` |
| `GET /products/{id}` | Yes | `backend/app/api/products.py` |
| `PUT /products/{id}` | Yes | `backend/app/api/products.py` |
| `DELETE /products/{id}` | Yes | `backend/app/api/products.py` |
| Product name field | Yes | `backend/app/models/product.py`, `backend/app/schemas/product.py` |
| Product SKU/code field | Yes | `backend/app/models/product.py`, `backend/app/schemas/product.py` |
| Product price field | Yes | `backend/app/models/product.py`, `backend/app/schemas/product.py` |
| Product quantity-in-stock field | Yes | `backend/app/models/product.py`, `backend/app/schemas/product.py` |
| `POST /customers` | Yes | `backend/app/api/customers.py` |
| `GET /customers` | Yes | `backend/app/api/customers.py` |
| `GET /customers/{id}` | Yes | `backend/app/api/customers.py` |
| `DELETE /customers/{id}` | Yes | `backend/app/api/customers.py` |
| Customer full name field | Yes | `backend/app/models/customer.py`, `backend/app/schemas/customer.py` |
| Customer email field | Yes | `backend/app/models/customer.py`, `backend/app/schemas/customer.py` |
| Customer phone number field | Yes | `backend/app/models/customer.py`, `backend/app/schemas/customer.py` |
| `POST /orders` | Yes | `backend/app/api/orders.py` |
| `GET /orders` | Yes | `backend/app/api/orders.py` |
| `GET /orders/{id}` | Yes | `backend/app/api/orders.py` |
| `DELETE /orders/{id}` | Yes | `backend/app/api/orders.py` |
| Order customer reference | Yes | `backend/app/models/order.py`, `backend/app/schemas/order.py`, `backend/app/services/orders.py` |
| Order product reference(s) | Yes | `backend/app/models/order.py`, `backend/app/schemas/order.py`, `backend/app/services/orders.py` |
| Order quantity ordered | Yes | `backend/app/models/order.py`, `backend/app/schemas/order.py` |
| Order total amount | Yes | `backend/app/models/order.py`, `backend/app/services/orders.py` |
| Unique product SKU/code | Yes | `backend/app/models/product.py`, `backend/app/schemas/product.py`, `backend/app/services/products.py` |
| Unique customer email | Yes | `backend/app/models/customer.py`, `backend/app/schemas/customer.py`, `backend/app/services/customers.py` |
| Product quantity cannot be negative | Yes | `backend/app/models/product.py`, `backend/app/schemas/product.py` |
| Orders blocked when inventory is insufficient | Yes | `backend/app/services/orders.py`, `backend/tests/test_business_rules.py` |
| Creating an order reduces available stock | Yes | `backend/app/services/orders.py`, `backend/tests/test_business_rules.py` |
| Backend calculates total order amount | Yes | `backend/app/services/orders.py`, `backend/tests/test_business_rules.py` |
| Proper API error handling | Yes | `backend/app/api/*.py`, `backend/app/main.py` |
| Appropriate HTTP status codes | Yes | `backend/app/api/*.py`, `backend/tests/*.py` |
| Request data validation | Yes | `backend/app/schemas/*.py`, `frontend/src/pages/*.jsx` |
| Frontend product add/list/update/delete | Yes | `frontend/src/pages/ProductsPage.jsx` |
| Frontend customer add/list/delete | Yes | `frontend/src/pages/CustomersPage.jsx` |
| Frontend order create/list/detail | Yes | `frontend/src/pages/OrdersPage.jsx` |
| Dashboard total products | Yes | `backend/app/api/dashboard.py`, `frontend/src/pages/Dashboard.jsx` |
| Dashboard total customers | Yes | `backend/app/api/dashboard.py`, `frontend/src/pages/Dashboard.jsx` |
| Dashboard total orders | Yes | `backend/app/api/dashboard.py`, `frontend/src/pages/Dashboard.jsx` |
| Dashboard low-stock products | Yes | `backend/app/services/dashboard.py`, `frontend/src/pages/Dashboard.jsx` |
| Responsive design for desktop/mobile | Yes | `frontend/src/styles/global.css` |
| Clean professional UI | Yes | `frontend/src/styles/global.css`, `frontend/src/components/Layout.jsx` |
| Form validation and user messages | Yes | `frontend/src/pages/*.jsx`, `frontend/src/components/Alert.jsx` |
| Organized component structure | Yes | `frontend/src/components/*.jsx`, `frontend/src/pages/*.jsx`, `frontend/src/services/api.js` |
| Proper frontend state management | Yes | `frontend/src/pages/*.jsx`, `frontend/src/App.jsx` |
| Backend production Dockerfile | Yes | `backend/Dockerfile` |
| Frontend Dockerfile | Yes | `frontend/Dockerfile` |
| `.dockerignore` files | Yes | `.dockerignore`, `backend/.dockerignore`, `frontend/.dockerignore` |
| Environment-variable configuration | Yes | `.env.example`, `backend/app/core/config.py`, `docker-compose.yml` |
| Avoid hardcoded credentials | Yes | `.env.example`, `backend/app/core/config.py`, `docker-compose.yml` |
| Docker Compose frontend service | Yes | `docker-compose.yml` |
| Docker Compose backend service | Yes | `docker-compose.yml` |
| Docker Compose PostgreSQL service | Yes | `docker-compose.yml` |
| Slim/lightweight Docker base images | Yes | `backend/Dockerfile`, `frontend/Dockerfile`, `docker-compose.yml` |
| Named PostgreSQL volume | Yes | `docker-compose.yml` |
| Render backend deployment config | Yes | `render.yaml` |
| Vercel frontend deployment config | Yes | `frontend/vercel.json` |
| Public backend URL | No | External deployment action required after pushing to Render |
| Public frontend URL | No | External deployment action required after pushing to Vercel |
| GitHub repository submission link | No | External repository creation required |
| Docker Hub backend image link | No | External Docker Hub push required |

## Review Result

All source-code functionality required by the assessment is implemented. The only checklist items marked `No` require external accounts and public publishing actions: GitHub repository creation, Docker Hub image push, Render deployment, and Vercel deployment.
