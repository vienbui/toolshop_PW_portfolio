# Test Cases — Tool Shop Automation
**App:** https://practicesoftwaretesting.com  
**API:** https://api.practicesoftwaretesting.com  
**Framework:** Playwright + TypeScript

---

## Module 1 — Authentication (UI)
**File:** `tests/E2E/login.spec.ts`

| TC | Scenario | Expected Result |
|---|---|---|
| TC01 | Login with valid credentials | Redirect to `/account`, user menu visible |
| TC02 | Login with wrong password | Stay on login page, error message visible |
| TC03 | Login with unregistered email | Stay on login page, error message visible |
| TC04 | Login with empty fields | Validation errors shown for both fields |
| TC05 | Logout successfully | Redirect to home, login link visible |
| TC06 | Access protected page without login | Redirect to login page |

### Test Data
| Role | Email | Password |
|---|---|---|
| Customer | customer@practicesoftwaretesting.com | welcome01 |
| Admin | admin@practicesoftwaretesting.com | welcome01 |

### Pass Criteria
- [ ] TC01: URL contains `/account` after login
- [ ] TC01: User name visible in nav
- [ ] TC02: Error message visible, URL does not contain `/account`
- [ ] TC03: Error message visible, URL does not contain `/account`
- [ ] TC04: Validation errors visible for empty fields
- [ ] TC05: Redirected to home, login link visible in nav
- [ ] TC06: Redirected to login page when accessing `/account` without session

---

## Module 2 — Product & Search (UI)
**File:** `tests/E2E/product.spec.ts`

| TC | Scenario | Expected Result |
|---|---|---|
| TC01 | Search by exact product name | Matching products displayed |
| TC02 | Search with no results | "No results" message visible |
| TC03 | Filter by category | Only products in that category shown |
| TC04 | Filter by brand | Only products from that brand shown |
| TC05 | View product detail | Correct name, price, description visible |

### Pass Criteria
- [ ] TC01: Product list contains item matching search term
- [ ] TC02: Empty state message visible
- [ ] TC03: All displayed products belong to selected category
- [ ] TC04: All displayed products belong to selected brand
- [ ] TC05: Product name, price, and description match expected values

---

## Module 3 — Cart (UI)
**File:** `tests/E2E/cart.spec.ts`

| TC | Scenario | Expected Result |
|---|---|---|
| TC01 | Add product to cart | Cart count increases by 1 |
| TC02 | Increase quantity in cart | Total price updates correctly |
| TC03 | Remove item from cart | Cart is empty, total is 0 |
| TC04 | Cart persists after page refresh | Items still in cart |

### Pass Criteria
- [ ] TC01: Cart badge shows `1` after adding item
- [ ] TC02: Line total = unit price × quantity
- [ ] TC03: Cart count shows `0`, empty cart message visible
- [ ] TC04: Cart item count unchanged after `page.reload()`

---

## Module 4 — Authentication API
**File:** `tests/API/auth.spec.ts`

| TC | Scenario | Method | Endpoint | Expected Result |
|---|---|---|---|---|
| TC01 | Login with valid credentials | POST | `/users/login` | Status 200, token in response |
| TC02 | Login with wrong password | POST | `/users/login` | Status 401, error message in body |
| TC03 | Login with missing fields | POST | `/users/login` | Status 422, validation error |
| TC04 | Get current user with valid token | GET | `/users/me` | Status 200, user data returned |
| TC05 | Get current user without token | GET | `/users/me` | Status 401 |

### Pass Criteria
- [ ] TC01: `response.status() === 200`, body contains `access_token`
- [ ] TC02: `response.status() === 401`
- [ ] TC03: `response.status() === 422`
- [ ] TC04: `response.status() === 200`, body contains `email` and `first_name`
- [ ] TC05: `response.status() === 401`

---

## Module 5 — Products API
**File:** `tests/API/product.spec.ts`

| TC | Scenario | Method | Endpoint | Expected Result |
|---|---|---|---|---|
| TC01 | Get all products | GET | `/products` | Status 200, array returned |
| TC02 | Get product by valid ID | GET | `/products/{id}` | Status 200, correct product data |
| TC03 | Get product by invalid ID | GET | `/products/{id}` | Status 404 |
| TC04 | Get products with pagination | GET | `/products?page=1` | Correct page size returned |

### Pass Criteria
- [ ] TC01: `response.status() === 200`, body contains `data` array
- [ ] TC02: `response.status() === 200`, `body.id` matches requested ID
- [ ] TC03: `response.status() === 404`
- [ ] TC04: `response.status() === 200`, `body.data.length` matches expected page size

---

## Implementation Order

| Phase | Module | Why |
|---|---|---|
| 1 | Module 1 — Login UI | Foundation, already know the pattern |
| 2 | Module 4 — Auth API | Learn `request` context, simple POST/GET |
| 3 | Module 5 — Products API | GET only, easiest API module |
| 4 | Module 3 — Cart UI | Needs login fixture, builds on Phase 1 |
| 5 | Module 2 — Product UI | Search and filter, most complex UI |

---

## Framework Structure

```
toolshop_PW_portfolio/
├── src/
│   ├── pages/
│   │   ├── LoginPage.ts
│   │   ├── HomePage.ts
│   │   └── CartPage.ts
│   ├── api/
│   │   ├── AuthApi.ts
│   │   └── ProductApi.ts
│   └── fixtures/
│       └── index.ts
├── tests/
│   ├── E2E/
│   │   ├── login.spec.ts
│   │   ├── product.spec.ts
│   │   └── cart.spec.ts
│   └── API/
│       ├── auth.spec.ts
│       └── product.spec.ts
├── playwright.config.ts
└── TEST_CASES.md
```
