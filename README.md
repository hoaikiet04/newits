
# 🚲 Bike Rental System

> Hệ thống thuê xe đạp đa trạm, ví điện tử & vé chuyến đi
> 
---

## 📌 Giới thiệu

**Bike Rental System** là hệ thống thuê xe đạp trực tuyến cho phép người dùng:

* Đăng ký / đăng nhập tài khoản
* Nạp tiền vào ví (top-up)
* Mua vé (ticket) theo gói hoặc thời hạn
* Thuê xe tại nhiều trạm khác nhau

Đồng thời cung cấp cho **Admin**:

* Quản lý người dùng
* Quản lý trạm xe, xe, lịch sử thuê
* Theo dõi lịch sử nạp tiền, cấu hình hệ thống

Cơ sở dữ liệu được xây dựng với các bảng: `users`, `bikes`, `stations`, `rentals`, `tickets`, `topuphistory`, `systemconfig`. 

---

## 👩‍💼 Vai trò TeamLead

Trong dự án này, vai trò **Team Lead** tập trung vào:

### 1. Quản lý yêu cầu & lập kế hoạch

* Phân tích yêu cầu nghiệp vụ: thuê xe, quản lý trạm, thanh toán, vé/gói cước.
* Chuyển yêu cầu thành **user stories** và backlog rõ ràng.
* Lên kế hoạch theo **milestone**: thiết kế DB → backend API → frontend → tích hợp → kiểm thử.

### 2. Điều phối nhóm & phân công công việc

* Phân chia công việc giữa:

  * **Backend (.NET 8 Web API)**
  * **Frontend (HTML/CSS/JS, Bootstrap)**
  * **Database (MySQL/MariaDB)**
* Theo dõi tiến độ, đảm bảo mọi người nắm rõ scope của mình.
* Kết nối các phần: API ↔ DB ↔ giao diện, giảm xung đột khi tích hợp.

### 3. Đảm bảo chất lượng & technical review

* Review thiết kế database: quan hệ `users` – `tickets`, `rentals`, `topuphistory`, `bikes` – `stations`. 
* Đề xuất quy ước: status xe, phân quyền user/admin, logic tính phí, hạn dùng vé.
* Xây dựng checklist kiểm thử cho:

  * Đăng nhập / đăng ký
  * Thuê xe, trả xe
  * Nạp tiền, mua vé
  * Phân quyền admin / user

### 4. Giao tiếp & báo cáo

* Là đầu mối trao đổi với giảng viên/“khách hàng”.
* Chuẩn bị nội dung demo: luồng thuê xe từ đầu đến cuối, dashboard admin.
* Tổng hợp & chuẩn hóa tài liệu (sơ đồ kiến trúc, ERD, hướng dẫn cài đặt, README).

### 5. Quản lý timeline & rủi ro

* Nhận diện rủi ro: trễ tiến độ, lỗi tích hợp backend–frontend, sai sót nghiệp vụ.
* Điều chỉnh thứ tự ưu tiên, tập trung hoàn thành core features trước.

> README này có thể dùng làm **portfolio** thể hiện kỹ năng Project Coordinator / Team Lead trong dự án thực tế.

---

## 🏗️ Kiến trúc hệ thống

### 🔙 Backend

* **Nền tảng:** ASP.NET Core **.NET 8** (`TargetFramework: net8.0`)
* **Kiến trúc:** Web API + Entity Framework Core (Pomelo MySQL)
* **Các package chính:**

  * `Microsoft.AspNetCore.Authentication.JwtBearer` – xác thực JWT
  * `Pomelo.EntityFrameworkCore.MySql` – kết nối MySQL/MariaDB
  * `Swashbuckle.AspNetCore` – Swagger UI cho API
  * `AutoMapper.Extensions.Microsoft.DependencyInjection` – mapping DTO
  * `BCrypt.Net-Next` – mã hoá mật khẩu

> Thư mục backend (ví dụ): `NetItBe/`

### 🎨 Frontend

* **Công nghệ:** HTML, CSS, JavaScript, Bootstrap, Font Awesome, Animate.css…
* **Các trang chính:**

  * `index.html` – trang chủ & giới thiệu dịch vụ
  * `user.html` – khu vực người dùng
  * `pay.html` – màn hình thanh toán/nạp tiền
  * `admin.html` – giao diện admin
  * `contact.html` – liên hệ

### 🗄️ Database

Database `bikerentalsystem` gồm các bảng chính: 

* `users` – thông tin tài khoản, vai trò, số dư ví
* `bikes` – danh sách xe và trạm hiện tại
* `stations` – các trạm xe (Hà Nội, Hải Phòng, Đà Nẵng, Quy Nhơn, Vũng Tàu, TP.HCM, …)
* `rentals` – lịch sử thuê xe (thời gian, trạm bắt đầu/kết thúc, phí)
* `tickets` – vé/gói sử dụng (theo số lượt hoặc thời hạn)
* `topuphistory` – lịch sử nạp tiền (ZaloPay, v.v.)
* `systemconfig` – cấu hình hệ thống (giá vé, quy tắc tính phí, …)

Quan hệ khoá ngoại được định nghĩa để đảm bảo toàn vẹn dữ liệu giữa `users`, `bikes`, `stations`, `rentals`, `tickets`, `topuphistory`. 

---

## ✨ Tính năng chính

### 👤 Người dùng (User)

* Đăng ký, đăng nhập, quản lý hồ sơ.
* Nạp tiền vào ví (top-up), xem lịch sử nạp tiền.
* Mua vé/gói (theo lượt hoặc theo thời hạn).
* Thuê xe tại các trạm, trả xe ở trạm khác (multi-station).
* Xem lịch sử thuê xe & phí đã trả.

### 🛠️ Quản trị viên (Admin)

* Quản lý người dùng: xem danh sách, quyền, số dư.
* Quản lý xe: trạng thái xe, trạm hiện tại.
* Quản lý trạm: tên, địa điểm, sức chứa.
* Xem & thống kê lịch sử thuê xe, lịch sử nạp tiền.
* Cấu hình một số tham số hệ thống (qua `systemconfig`). 

---

## 📸 Demo giao diện

> ✍️ **Chỗ chèn ảnh demo** – bạn chỉ cần thay đường dẫn ảnh tương ứng (ví dụ lưu trong `docs/demo/` hoặc `screenshots/`).

```md
## 📸 Demo giao diện

### Trang chủ
![Trang chủ](docs/demo/home.png)

### Màn hình người dùng thuê xe
![Thuê xe](docs/demo/rent-bike.png)

### Màn hình thanh toán / nạp tiền
![Thanh toán](docs/demo/payment.png)

### Dashboard quản trị
![Admin Dashboard](docs/demo/admin-dashboard.png)
```

---

## 🧰 Công nghệ sử dụng

* **Backend:**

  * ASP.NET Core (.NET 8)
  * Entity Framework Core
  * JWT Authentication
  * Swagger (API docs)

* **Frontend:**

  * HTML, CSS, JavaScript
  * Bootstrap 5, Font Awesome, Animate.css

* **Database:**

  * MySQL (`bikerentalsystem.sql`) 
---

## 🧪 Quy trình phát triển & kiểm thử

1. **Phân tích & thiết kế**

   * Thiết kế ERD, quan hệ giữa user – vé – thuê xe – top-up. 
   * Thiết kế API, phân quyền, luồng nghiệp vụ.

2. **Phát triển**

   * Backend: xây dựng model, DbContext, repository/service, controller API.
   * Frontend: xây dựng giao diện người dùng, admin, trang thanh toán.

3. **Kiểm thử**

   * Test các luồng chính:

     * Đăng ký/đăng nhập
     * Nạp tiền, mua vé
     * Thuê xe, trả xe
     * Quản trị người dùng, xe, trạm

4. **Hoàn thiện & báo cáo**

   * Viết tài liệu, slide, demo flow cho buổi thuyết trình.
   * Chuẩn hóa README để đưa lên GitHub/Portfolio.

---

## 👨‍👩‍👧‍👦 Thành viên & phân công

> Cập nhật lại theo đúng nhóm của bạn.

* **[Tên bạn] – Team Lead/Frontend Developer**

  * Quản lý yêu cầu & backlog
  * Thiết kế tổng thể (kiến trúc, DB, luồng nghiệp vụ)
  * Review code & kiểm thử tích hợp
  * Tổng hợp tài liệu, chuẩn bị demo & thuyết trình

* **Lê Minh Ty – Backend Developer/Database**

---

Nếu bạn muốn, mình có thể **viết thêm phiên bản README tiếng Anh** hoặc tách riêng một mục “Skills demonstrated as Project Coordinator” để bạn dùng trực tiếp trong CV/LinkedIn.
