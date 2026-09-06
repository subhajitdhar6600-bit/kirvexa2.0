# Farma Backend API Documentation — Farmer & Dealer Agricultural Marketplace

**Version:** 2.0.0  
**Base URL:** `http://localhost:5000/api`  
**Authentication:** Bearer Token (`Authorization: Bearer <JWT_ACCESS_TOKEN>`)

---

## 1. Test Credentials

| Role | Phone | Email | Password | Initial KCC Status |
|---|---|---|---|---|
| **Master Admin** | `9999999999` | `admin@farma.com` | `Admin@123` | `APPROVED` |
| **Verified Dealer** | `9888888888` | `dealer@farma.com` | `Dealer@123` | `APPROVED` |
| **Verified Farmer** | `9777777777` | `farmer@farma.com` | `Farmer@123` | `APPROVED` |
| **Unverified Farmer** | `9666666666` | `newfarmer@farma.com` | `Farmer@123` | `NOT_APPLIED` |

---

## 2. Standard API Response Structure

### Success Response
```json
{
  "success": true,
  "message": "Request completed successfully",
  "data": {}
}
```

### Error Response
```json
{
  "success": false,
  "code": "KCC_REQUIRED",
  "message": "Approved KCC verification is required to access this service.",
  "errors": []
}
```

### Standard HTTP Status Codes
- `200 OK`: Request succeeded.
- `201 Created`: Resource successfully created.
- `400 Bad Request`: Validation failure or business rule violation.
- `401 Unauthorized`: Missing, expired, or invalid JWT token.
- `403 Forbidden`: Insufficient role permissions or unapproved KCC (`KCC_REQUIRED`).
- `404 Not Found`: Resource does not exist.
- `500 Internal Server Error`: Server exception.

---

## 3. Core Business Rules

1. **Rule 1 — KCC Verification**:
   - Both Farmers and Dealers have a KCC verification status (`NOT_APPLIED`, `PENDING`, `UNDER_REVIEW`, `APPROVED`, `REJECTED`, `EXPIRED`, `SUSPENDED`).
   - If KCC is not `APPROVED`, calling restricted endpoints (e.g., `POST /api/farmer/crops`, `POST /api/dealer/products`) immediately returns `HTTP 403` with `code: "KCC_REQUIRED"`.
2. **Rule 2 — Account Standing**:
   - Accounts marked `SUSPENDED` or `BLOCKED` cannot access protected endpoints or execute transactions.
3. **Rule 4 — Inventory Protection**:
   - Orders cannot exceed available inventory (`INSUFFICIENT_STOCK`).
   - Stock quantities are atomically decremented upon order creation.
4. **Rule 5 — Authoritative Pricing**:
   - Frontend-submitted prices or totals are never trusted.
   - The backend looks up active database records, applies platform discount and tax rules, and calculates authoritative amounts.
5. **Rule 6 — Crop Quantities**:
   - Farmers cannot sell more crop quantity than the available listing quantity.
6. **Rule 7 & 26 — Admin Governance & Audit Logging**:
   - All critical administrative actions (approvals, rejections, status overrides, suspensions) are written to the `AuditLog` collection.
7. **Rule 8 — Mandatory Rejection Reasons**:
   - Rejected KCC applications must supply a non-empty `rejectionReason`.
8. **Rule 10 — Duplicate Application Prevention**:
   - Users cannot submit a new KCC application if they already have one in `PENDING` or `UNDER_REVIEW`.

---

## 4. Complete API Endpoints

### 4.1 Authentication (`/api/auth`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | Public | Register a new Farmer or Dealer account |
| `POST` | `/api/auth/login` | Public | Authenticate with Phone/Email and Password |
| `POST` | `/api/auth/logout` | Authenticated | Revoke refresh token |
| `POST` | `/api/auth/refresh` | Public | Issue new access token using refresh token |
| `POST` | `/api/auth/send-otp` | Public | Generate simulated 6-digit OTP |
| `POST` | `/api/auth/verify-otp` | Public | Authenticate/register via OTP verification |
| `GET` | `/api/auth/me` | Authenticated | Get current authenticated user profile & KCC status |

#### Register Payload Example
```json
{
  "name": "Ramesh Kumar",
  "phone": "9876543210",
  "email": "ramesh@example.com",
  "password": "Password@123",
  "role": "farmer",
  "district": "Patna",
  "state": "Bihar"
}
```

---

### 4.2 Farmer Module (`/api/farmer`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/farmer/profile` | Farmer | Get farmer profile and farm details |
| `PATCH` | `/api/farmer/profile` | Farmer | Update farmer profile |
| `GET` | `/api/farmer/kcc/status` | Farmer | Check KCC status and rejection reasons |
| `GET` | `/api/farmer/kcc` | Farmer | Get list of user's KCC applications |
| `POST` | `/api/farmer/kcc/apply` | Farmer | Submit new KCC application |
| `POST` | `/api/farmer/crops` | Farmer (`requireApprovedKCC`) | Create crop listing for sale |
| `GET` | `/api/farmer/crops` | Farmer | Get farmer's crop listings |
| `GET` | `/api/farmer/crops/:id` | Farmer | Get single crop listing |
| `PATCH` | `/api/farmer/crops/:id` | Farmer | Update crop listing |
| `DELETE` | `/api/farmer/crops/:id` | Farmer | Delete crop listing |
| `GET` | `/api/farmer/sales` | Farmer | Get orders where farmer is the seller |

---

### 4.3 Dealer Module (`/api/dealer`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/dealer/profile` | Dealer | Get dealer shop profile |
| `PATCH` | `/api/dealer/profile` | Dealer | Update dealer shop profile |
| `GET` | `/api/dealer/kcc/status` | Dealer | Get dealer verification status |
| `POST` | `/api/dealer/kcc/apply` | Dealer | Apply for Dealer KCC verification |
| `POST` | `/api/dealer/products` | Dealer (`requireApprovedKCC`) | List new agricultural product for sale |
| `GET` | `/api/dealer/products` | Dealer | Get dealer's product listings |
| `GET` | `/api/dealer/products/:id` | Dealer | Get single product detail |
| `PATCH` | `/api/dealer/products/:id` | Dealer | Edit product detail |
| `PATCH` | `/api/dealer/products/:id/stock` | Dealer | Update product stock quantity |
| `DELETE` | `/api/dealer/products/:id` | Dealer | Delete product listing |
| `GET` | `/api/dealer/orders` | Dealer | Get customer orders received by dealer |
| `PATCH` | `/api/dealer/orders/:id/status` | Dealer | Progress order status (Processing, Shipped, etc.) |
| `GET` | `/api/dealer/sales` | Dealer | Sales analytics and revenue summary |
| `GET` | `/api/dealer/transactions` | Dealer | Transaction payment records |

---

### 4.4 Marketplace Browsing & Shopping

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/products` | Public | Browse products with search, category, brand filters |
| `GET` | `/api/products/:id` | Public | Product detail with calculated discount |
| `GET` | `/api/categories` | Public | Get product and crop categories |
| `GET` | `/api/crops` | Public | Browse active farmer crops |
| `GET` | `/api/crops/:id` | Public | Crop listing detail |
| `POST` | `/api/crops/:id/buy` | Authenticated | Purchase crop from farmer |
| `GET` | `/api/cart` | Authenticated | Live cart with calculated subtotal, tax, delivery |
| `POST` | `/api/cart/items` | Authenticated | Add product to cart |
| `PATCH` | `/api/cart/items/:id` | Authenticated | Update item quantity |
| `DELETE` | `/api/cart/items/:id` | Authenticated | Remove item from cart |
| `DELETE` | `/api/cart` | Authenticated | Clear cart |
| `POST` | `/api/orders` | Authenticated | Place order (backend verified) |
| `GET` | `/api/orders` | Authenticated | Buyer order history |
| `GET` | `/api/orders/:id` | Authenticated | Order detail with delivery & payment tracking |
| `POST` | `/api/orders/:id/cancel` | Authenticated | Cancel order |

---

### 4.5 Admin Governance Module (`/api/admin`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/admin/dashboard` | Admin | Real-time platform metrics and activity |
| `GET` | `/api/admin/users` | Admin | List users with filters (role, status, KCC) |
| `GET` | `/api/admin/users/:id` | Admin | Get user details |
| `PATCH` | `/api/admin/users/:id/status` | Admin | Suspend, activate, or block user account |
| `GET` | `/api/admin/kcc` | Admin | List KCC applications |
| `GET` | `/api/admin/kcc/:id` | Admin | View KCC application details |
| `POST` | `/api/admin/kcc/:id/approve` | Admin | Approve KCC application |
| `POST` | `/api/admin/kcc/:id/reject` | Admin | Reject KCC application with reason |
| `POST` | `/api/admin/kcc/:id/request-correction` | Admin | Request corrections (sets status to UNDER_REVIEW) |
| `GET` | `/api/admin/products` | Admin | Manage dealer products |
| `POST` | `/api/admin/products/:id/approve` | Admin | Approve pending product |
| `POST` | `/api/admin/products/:id/reject` | Admin | Reject product with reason |
| `GET` | `/api/admin/crops` | Admin | Moderate farmer crop listings |
| `GET` | `/api/admin/orders` | Admin | View all platform orders |
| `PATCH` | `/api/admin/orders/:id/status` | Admin | Administrative order status override |
| `GET` | `/api/admin/audit-logs` | Admin | View complete audit trail of admin actions |
| `GET` | `/api/admin/settings` | Admin | Get dynamic platform settings |
| `PATCH` | `/api/admin/settings` | Admin | Update dynamic platform business rules |

---

## 5. Automated Testing & Verification
You can run the full automated verification test suite at any time:
```bash
node server/scripts/testPRD.js
```
And re-seed sample data with:
```bash
node server/scripts/seedPRD.js
```
