# LEARNING PLAN — Toolshop API + UI E2E (Playwright + TypeScript)

> Mở Claude Code TẠI thư mục này, rồi dán phần "PROMPT KHỞI ĐỘNG" bên dưới vào chat đầu tiên.
> Mỗi ngày chỉ cần gõ ví dụ "Week 1 Day 2" để biết mục tiêu hôm đó.

---

# PHẦN 0 — PROMPT KHỞI ĐỘNG (dán vào chat mới)

## Bối cảnh & cách làm việc tôi muốn
Tôi là học viên bootcamp Playwright (TypeScript), junior. Trả lời tôi bằng TIẾNG VIỆT.
Tôi coi trọng HIỂU BẢN CHẤT, không học vẹt.

Khi tôi STUCK và hỏi "sai ở đâu / tại sao lỗi":
- ĐỪNG trả lời thẳng, ĐỪNG sửa code hộ. Hãy GỢI Ý bằng câu hỏi dẫn dắt để tôi tự sửa.
- Chỉ tiết lộ đáp án nếu tôi đã thử mà vẫn kẹt, hoặc tôi yêu cầu rõ. Luôn giải thích "vì sao".
Khi tôi hỏi để HỌC khái niệm mới (không stuck) thì giải thích kỹ, có ví dụ/ẩn dụ.
Hãy tạo file memory ghi nhớ phong cách này + hồ sơ của tôi + các quyết định kiến trúc ở file này, ngay từ đầu.

## Tôi ĐÃ nắm (đừng giảng lại trừ khi tôi hỏi)
POM (class/constructor/this.page), "làm thì await / lấy thì return", ":" = type & "=" = value,
camelCase vs PascalCase, fixtures (base.extend<MyFixtures>, use, import test từ file fixture),
data fixture vs export const vs data-driven, mẹo "all fail = lỗi chung".

## Việc đầu tiên tôi muốn làm cùng bạn
1. Dạy tôi MÔ HÌNH KẾT HỢP API+UI (3 vai trò ở Phần 1) bằng ví dụ ngắn.
2. Cùng tôi làm Week 1 Day 1: khởi tạo project + cấu trúc + config + 3 GET test đầu tiên.
3. Từ đó mỗi ngày tôi báo "Week X Day Y", bạn ra mục tiêu + để tôi tự code, chỉ gợi ý khi tôi kẹt.
Hãy xác nhận lộ trình và hỏi tôi đã sẵn sàng Day 1 chưa.

---

# PHẦN 1 — DỰ ÁN & MÔ HÌNH KẾT HỢP API + UI

## App & môi trường (dùng PUBLIC INSTANCE trước)
- UI:  https://practicesoftwaretesting.com
- API: https://api.practicesoftwaretesting.com   (Swagger UI: /api/documentation ; spec thô: /docs)
- Auth: JWT. Login: POST /users/login {email,password} -> { access_token }  (XÁC MINH trên Swagger ngày 1)
- User mặc định:
  - Admin:    admin@practicesoftwaretesting.com / welcome01
  - Customer: customer@practicesoftwaretesting.com / welcome01
- RBAC: admin mới DELETE products/brands/categories; user mới có favorites/invoices/messages.
- LƯU Ý: data công khai dùng chung -> ưu tiên test ĐỌC; test GHI dễ flaky (tạo data riêng rồi tự xoá).
- Sau này có thể chuyển self-host Docker -> thiết kế config sao cho đổi baseURL là xong.

## MÔ HÌNH KẾT HỢP API + UI (học NGÀY ĐẦU, trước khi code)
Nhớ 3 vai trò, đừng trộn lẫn:
1) API để ARRANGE (chuẩn bị data nhanh): tạo product/brand bằng API rồi UI verify hiển thị đúng.
2) API để LOGIN nhanh: login qua API lấy token -> lưu storageState -> UI mở ra đã đăng nhập sẵn.
3) API để ASSERT/teardown: sau thao tác UI, gọi API kiểm tra state thật & dọn data.
Quy tắc: "Arrange bằng API (nhanh, ổn định). Act + Assert phần đang TEST bằng UI."

---

# PHẦN 2 — KIẾN TRÚC & QUY ƯỚC (best practice — áp dụng xuyên suốt)

## Phân biệt 2 loại "factory" (đừng nhầm!)
- DATA factory / test-data builder (vd buildUserRegisterRequest) → ✅ GIỮ & dùng nhiều.
  Hàm dựng request body, có overrides: Partial<T> = {}, sinh email/giá trị độc nhất
  (Date.now()+random) để tránh trùng trên instance công khai. Hợp cho API & data-driven.
- PAGE OBJECT factory / PageManager (class tự new ra page object) → ❌ KHÔNG dùng.
  Fixtures (base.extend) đã làm việc này tốt hơn (lazy, tự dọn, parallel-safe, inject qua { }).

## POM — Playwright-native
- Locator + action ĐỂ CHUNG 1 class (cohesion cao). KHÔNG tách locator ra file riêng.
- Locator là field readonly, gán trong constructor; ưu tiên getByRole/getByTestId > CSS #id.
- Mỗi page chỉ lo trang của nó. "Làm thì await, lấy thì return".

## BasePage vs ApiClient
- BasePage → ❌ KHOAN lúc đầu. Chỉ thêm khi có hành vi chung THẬT (vd goto chung).
  Khi có UI lặp (header/nav) → tách COMPONENT OBJECT rồi compose, KHÔNG kế thừa BasePage.
- ApiClient / BaseApiClient → ✅ NÊN có. Vì auth header (Bearer token), baseURL,
  xử lý response là logic chung thật sự. Có thể tách ProductApi/UserApi dùng chung phần header.

## Nguyên tắc gốc
Tách/kế thừa CHỈ khi có hành vi chung THẬT — không tách vì "nghe nói nên sạch".
Ưu tiên cohesion (gắn kết) > chia nhỏ cho có vẻ gọn.

## Đặt tên file fixture
Đặt tên rõ (fixtures.ts hoặc baseTest.ts) thay vì index.ts, để tab editor dễ phân biệt.
(index.ts chỉ tiện ở chỗ import ngắn — from '../fixtures' — nhưng nhiều index.ts mở cùng lúc gây rối.)

## Cấu trúc thư mục mục tiêu
api/         apiClient.ts (+ ProductApi/UserApi nếu cần)
pages/       loginPage.ts, productPage.ts, cartPage.ts ...
components/  headerComponent.ts ...  (chỉ tạo khi có UI lặp)
factories/   user.factory.ts ...     (DATA builders)
fixtures/    baseTest.ts (base.extend: inject page objects + apiClient + data)
auth/        admin.json, customer.json  (storageState — sinh tự động, ĐỪNG commit -> .gitignore)
tests/       *.spec.ts
playwright.config.ts:
  - baseURL (UI) + project "setup" (login API lưu storageState) + project "admin"/"customer".

---

# PHẦN 3 — LỘ TRÌNH 3 TUẦN (mỗi ngày ~60–90 phút)

## WEEK 1 — API testing (request context, JWT, CRUD, RBAC ở tầng API)
Mục tiêu cuối tuần: viết lại bộ API test từ file trắng, pass hết, < 20 phút.

- Day 1: Khởi tạo project + cấu trúc + config. Đọc Swagger. 3 GET test (products, categories, brands) bằng fixture `request`.
- Day 2: Auth. POST /users/login cho admin & customer, lấy access_token. Test login đúng/sai.
- Day 3: Authenticated calls (favorites/invoices cần token). Tạo brand/product bằng admin token.
- Day 4: RBAC ở API (TC bên dưới) + negative tests (401/403/404/422).
- Day 5: Refactor thành class ApiClient + viết lại từ đầu. Đo thời gian.

### TC API mẫu (viết đủ format này cho mỗi TC)

TC-API-01 — Lấy danh sách sản phẩm
- Objective: GET /products trả danh sách hợp lệ, không cần auth
- Steps: GET {API}/products
- AC: status 200; body có mảng list; mỗi item có id, name, price; price là number

TC-API-02 — Login admin lấy token
- Input: { email: admin@..., password: welcome01 } ; Steps: POST {API}/users/login
- AC: status 200; có access_token (string, length > 0)

TC-API-03 — Login sai mật khẩu
- Input: admin@... / sai_pass ; AC: status 401 (XÁC MINH); KHÔNG có access_token

TC-API-04 — RBAC: customer KHÔNG được xoá product
- Precondition: token CUSTOMER ; Steps: DELETE {API}/products/{id} Bearer=customer
- AC: status 403; product vẫn còn (GET lại vẫn 200)

TC-API-05 — RBAC: admin xoá được product (dùng product TỰ TẠO)
- Precondition: token admin; POST tạo product mới lấy id
- Steps: DELETE {API}/products/{id} Bearer=admin
- AC: status 200/204; GET lại id đó -> 404

### Pass Week 1
[ ] Viết lại toàn bộ API test từ file trắng < 20 phút
[ ] Tất cả test xanh
[ ] Giải thích tiếng Anh: 401 vs 403 khác gì, JWT để làm gì
[ ] >= 5 commit

---

## WEEK 2 — UI với POM (đi nhanh vì đã biết POM)
Mục tiêu cuối tuần: viết lại UI POM + 5 TC từ file trắng, pass hết, < 25 phút.

- Day 1: Cấu trúc POM. TỰ INSPECT selector (DevTools) — app dùng nhiều data-test. LoginPage + test login UI.
- Day 2: HomePage (catalog): search, sort, list. ProductPage: add to cart.
- Day 3: Cart + bắt đầu checkout. Phân biệt UI admin vs customer (admin thấy link Dashboard).
- Day 4: Bọc page object bằng fixtures.
- Day 5: Viết lại từ đầu. Đo thời gian.

### TC UI mẫu

TC-UI-01 — Đăng nhập UI thành công (customer)
- Steps: mở /auth/login, fill email+password, submit
- AC: URL chứa /account (XÁC MINH); menu user visible; không có lỗi

TC-UI-02 — Đăng nhập sai mật khẩu
- AC: vẫn ở trang login; thông báo lỗi visible (đọc đúng text qua DevTools rồi assert)

TC-UI-03 — Tìm kiếm sản phẩm
- Steps: gõ từ khoá vào ô search, submit ; AC: kết quả chỉ chứa item khớp; số kết quả >= 1

TC-UI-04 — Thêm sản phẩm vào giỏ
- Steps: mở 1 product, bấm Add to cart ; AC: badge giỏ = 1; sản phẩm có trong giỏ

TC-UI-05 — Đăng xuất
- AC: về trạng thái chưa đăng nhập; nav hiện "Sign in" trở lại

### Pass Week 2
[ ] Viết lại UI POM + 5 TC từ file trắng < 25 phút
[ ] Tất cả xanh; selector viết từ trí nhớ (quên thì tự inspect, KHÔNG copy)
[ ] Giải thích mỗi TC bằng tiếng Anh 2–3 câu
[ ] >= 6 commit

---

## WEEK 3 — KẾT HỢP API + UI + multi-role (storageState) ★ phần chính
Mục tiêu cuối tuần: bộ test "lai" chạy đúng, login qua API, 2 role tách project, RBAC end-to-end.

- Day 1: Học pattern storageState. Viết "setup project": login API cho admin & customer -> lưu auth/admin.json, auth/customer.json. Cấu hình 2 project (admin, customer) dùng storageState.
- Day 2: Pattern "API arrange -> UI assert" (TC-MIX-01).
- Day 3: Pattern "API fast login" + "UI act -> API assert" (TC-MIX-02).
- Day 4: RBAC end-to-end giữa UI và API (TC-MIX-03).
- Day 5: Capstone flow + viết lại. Đo thời gian.

### TC kết hợp mẫu

TC-MIX-01 — Tạo product bằng API, verify trên UI
- Arrange (API, admin): POST /products tạo product tên độc nhất ("QA-{timestamp}")
- Act (UI): mở catalog, search đúng tên đó
- AC: product hiện trong kết quả UI đúng tên/giá
- Teardown (API): DELETE product; GET lại -> 404

TC-MIX-02 — storageState fast login + UI thao tác + API verify
- Precondition: project "customer" (đã có storageState customer)
- Act (UI): mở 1 product, bấm "Add to favorites"
- AC (API): GET /favorites bằng token customer -> có product vừa thêm
- Teardown: xoá favorite qua API

TC-MIX-03 — RBAC end-to-end
- A (UI, customer): customer KHÔNG thấy khu vực Admin Dashboard
- B (API, customer token): DELETE /products/{id} -> 403
- C (UI/API, admin): admin THẤY Dashboard và xoá được product tự tạo
- AC: cả 3 phần đúng kỳ vọng

### Pass Week 3 (tốt nghiệp project)
[ ] setup project tạo được auth/admin.json & auth/customer.json tự động
[ ] 2 project (admin/customer) chạy đúng bằng storageState (không login UI lại trong test)
[ ] >= 3 test "lai" (MIX) xanh và ỔN ĐỊNH khi chạy lại 3 lần
[ ] Mọi test GHI data đều tự dọn (không để rác trên server công khai)
[ ] Giải thích tiếng Anh: khi nào dùng API vs UI cho mỗi bước
[ ] >= 8 commit

---

# PHẦN 4 — CHEAT SHEETS

## API (verify lại trên Swagger /api/documentation ngày 1)
Base: https://api.practicesoftwaretesting.com
- POST /users/login        {email,password} -> {access_token}   (header: Authorization: Bearer <token>)
- POST /users/register     đăng ký customer mới
- GET  /users/me           user hiện tại (cần token)
- GET/POST /products       ; GET/PUT/DELETE /products/{id}        (DELETE cần admin)
- GET/POST /brands         ; GET/PUT/PATCH/DELETE /brands/{id}    (DELETE cần admin)
- GET /categories , /categories/tree
- GET/POST/DELETE /favorites          (cần user token)
- GET /invoices , /invoices/search    (cần user token)
- POST /messages                       (cần user token)
- POST /payment/check , GET /postcode-lookup
HTTP: 200 OK, 201 Created, 204 No Content, 401 chưa auth, 403 sai quyền, 404 không thấy, 422 sai dữ liệu.

## UI — TỰ INSPECT (app dùng thuộc tính data-test)
Ngày 1: mở DevTools trên login/catalog/product/cart, ghi lại selector [data-test="..."].
Từ ngày 2: viết selector từ trí nhớ; quên thì inspect lại, KHÔNG xin đưa sẵn.
Cần tìm: ô email/password + nút login; ô search + nút search; sort dropdown;
nút Add to cart; badge giỏ hàng; menu user/nav; link Admin Dashboard (chỉ admin thấy).
