# Backend Developer Test

This is a simple backend project built with `NestJS`, `TypeORM` and `PostgreSQL` as a demonstration of skill.

---

## Run the Project

1. **Clone the repository**

```bash
git clone https://github.com/wolfByte125/ellatech_test.git
cd ellatech_test
```

2. **Install Dependecies**

```bash
pnpm install
```

3. **Setup Environment**

```bash
cp .env.example .env
# Edit .env with your database credentials, e.g.:
# DATABASE_URL=postgres://user:password@localhost:5432/sampledb
```

4. **Setup Database**

- Firstly, create a database with the name you used in the .env file you just created. Then run the following

```bash
pnpm run typeorm:run-migration
```

5. **Start the server**

#### Server runs on localhost:3000 by default if not changed

```bash
pnpm run start
# For watch mode
pnpm run start:dev
```

## API Endpoints (Only Required Endpoints are listed below)

### Users

#### POST /users

- Create new user

```json
// Request body
{
  "full_name": "Hakuji Akaza",
  "email": "akaza@gmail.com"
}
```

```json
// Response
{
  "id": "407931ed-28ea-4ba0-89c2-572796b36c73",
  "full_name": "Hakuji Akaza",
  "email": "akaza@gmail.com",
  "created_at": "2025-11-14T10:56:15.416Z",
  "updated_at": "2025-11-14T10:56:15.416Z"
}
```

#### POST /products

- Create new product

```json
// Request body
{
  "name": "Mobile",
  "description": "Small screen device",
  "price": "70000",
  "quantity": "50"
}
```

```json
// Response
{
  "id": "4dad49dc-2824-4cbf-982e-3aa29ec4794c",
  "name": "Mobile",
  "description": "Small screen device",
  "price": "70000",
  "quantity": 50,
  "created_at": "2025-11-14T11:01:35.195Z",
  "updated_at": "2025-11-14T11:01:35.195Z"
}
```

#### PUT /products/adjust

- Adjust product quantity

```json
// Request body
{
  "product_id": "4dad49dc-2824-4cbf-982e-3aa29ec4794c",
  "user_id": "407931ed-28ea-4ba0-89c2-572796b36c73",
  "quantity_change": -5
}
```

```json
// Response
{
  "id": "4dad49dc-2824-4cbf-982e-3aa29ec4794c",
  "name": "Mobile",
  "description": "Small screen device",
  "price": "70000.00",
  "quantity": 45,
  "created_at": "2025-11-14T11:01:35.195Z",
  "updated_at": "2025-11-14T11:03:10.478Z"
}
```

#### GET /products/status/:productId

- Check status of product inside stock

```json
// Response
{
  "product_id": "4dad49dc-2824-4cbf-982e-3aa29ec4794c",
  "name": "Mobile",
  "quantity": 45,
  "status": "IN STOCK"
}
```

#### GET /transactions

- Fetch implicitly registered transactions for product adjustments

```json
// Response
[
  {
    "id": "96fa31f3-b64d-48ca-b729-1df94fc5b62e",
    "product": {
      "id": "4dad49dc-2824-4cbf-982e-3aa29ec4794c",
      "name": "Mobile",
      "description": "Small screen device",
      "price": "70000.00",
      "quantity": 45,
      "created_at": "2025-11-14T11:01:35.195Z",
      "updated_at": "2025-11-14T11:03:10.478Z"
    },
    "user": {
      "id": "407931ed-28ea-4ba0-89c2-572796b36c73",
      "full_name": "Hakuji Akaza",
      "email": "akaza@gmail.com",
      "created_at": "2025-11-14T10:56:15.416Z",
      "updated_at": "2025-11-14T10:56:15.416Z"
    },
    "type": "DECREASE",
    "quantity_change": -5,
    "previous_quantity": 50,
    "new_quantity": 45,
    "created_at": "2025-11-14T11:03:10.599Z"
  }
]
```

## Assumptions & Trade-offs

- Assumned each user has a unique email
- Passwords are not implemented for users in this demo; in a real app, hashing and auth would be required
- Error handling is basic
- Tests and docker compose are not implemented due to some power issues and time running late due to it

## Notes

- DTOs are used to make interaction easier
- All endpoints return JSON
- Migrations are used to create database table (as long as synchronize is set to false)
