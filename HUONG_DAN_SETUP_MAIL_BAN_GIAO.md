# HƯỚNG DẪN THIẾT LẬP THÔNG BÁO EMAIL KHI BÀN GIAO KHÁCH HÀNG
**Dự án:** LV Tiling Pty Ltd - Landing Page & Admin CMS  
**Mục đích:** Giúp chủ website (khách hàng) tự động nhận thông báo ngay khi có khách gửi yêu cầu báo giá trên web, đồng thời tự động gửi thư cảm ơn xác nhận cho khách hàng.

---

## I. TỔNG QUAN HỆ THỐNG GỬI MAIL

Hệ thống sử dụng cơ chế **Email 2 chiều tự động**:
1. **Email 1 (Gửi cho Chủ Web / Kỹ thuật viên):** Thông báo có đơn báo giá mới (Tên, SĐT có nút bấm gọi ngay, Email, Dịch vụ, Khu vực, Diện tích, Ghi chú).
2. **Email 2 (Gửi cho Khách hàng):** Thư cảm ơn xác nhận chuyên nghiệp chuẩn Úc, hẹn liên hệ trong 15-30 phút.

---

## II. CÁCH LẤY MẬT KHẨU ỨNG DỤNG GMAIL (APP PASSWORD)
*(Áp dụng cho tài khoản Gmail của khách hàng: `@gmail.com`)*

Do chính sách bảo mật của Google, bạn không thể dùng mật khẩu đăng nhập thông thường mà bắt buộc phải tạo **Mật khẩu ứng dụng (16 ký tự)**:

1. Đăng nhập vào Gmail của khách hàng.
2. Truy cập vào trang Quản lý tài khoản Google: [https://myaccount.google.com/security](https://myaccount.google.com/security)
3. Tại mục **"Bảo mật" (Security)**:
   - Kiểm tra xem **"Xác minh 2 bước" (2-Step Verification)** đã bật chưa. Nếu chưa, hãy bật lên.
4. Tìm đến mục **"Mật khẩu ứng dụng" (App passwords)**:
   *(Có thể gõ trực tiếp chữ "Mật khẩu ứng dụng" hoặc "App passwords" vào ô tìm kiếm ở trên cùng trang Google Account)*.
5. Nhập tên ứng dụng (ví dụ: `Website LV Tiling`) và nhấn **Tạo (Create)**.
6. Google sẽ hiện ra một popup có **mã 16 ký tự** (ví dụ: `xxxx xxxx xxxx xxxx`).
   > ⚠️ **Lưu ý:** Copy lại mã này (viết liền không khoảng trắng hoặc giữ nguyên khoảng trắng đều được).

---

## III. HƯỚNG DẪN CẤU HÌNH TRÊN TRANG ADMIN WEBSITE

1. Truy cập vào trang quản trị: `https://[ten-mien-website]/admin`
   - **Tài khoản mặc định:** `admin`
   - **Mật khẩu mặc định:** `admin123` (hoặc `lvtiling2026`)
2. Trên thanh menu bên trái, chọn: **Thông Báo Tức Thì** ➔ **Email 2 Chiều**.
3. Điền các trường thông tin:
   - **Email Nhận Thông Báo Của Admin:** Email khách hàng muốn nhận đơn (ví dụ: `lvotiling@gmail.com`).
   - **Tên Người Gửi Hiển Thị:** `LV Tiling Pty Ltd`
   - **Tài Khoản Gmail Gửi Đi (SMTP Username):** Địa chỉ Gmail dùng để gửi (thường trùng với email admin).
   - **Mật Khẩu Ứng Dụng Gmail:** Dán mã 16 ký tự vừa lấy ở Bước II.
   - **SMTP Host:** `smtp.gmail.com` (mặc định đã có).
   - **SMTP Port:** `465` (mặc định đã có).
4. Nhấn **"Lưu Cấu Hình Email"**.

---

## IV. CÁCH KIỂM TRA (TEST) SAU KHI CẤU HÌNH

1. **Test tại chỗ trong Admin:**
   - Tại giao diện cấu hình Email, ở ô "Gửi Email Thử Nghiệm", nhập email muốn nhận thử và nhấn **"Gửi Email Thử Nghiệm"**.
   - Kiểm tra hộp thư xem đã có mail xác nhận `🎉 Kết nối Email SMTP Thành Công!` hay chưa.
2. **Test thực tế ngoài trang chủ:**
   - Ra ngoài trang chủ, kéo xuống form **Request A Quote**.
   - Nhập thông tin thử nghiệm và bấm gửi.
   - Kiểm tra cả 2 hòm thư (Admin nhận mail đơn mới, Khách nhận mail xác nhận).

---

## V. CẤU HÌNH KHI TRIỂN KHAI LÊN PRODUCTION (NẾU DÙNG VERCEL / HOSTING)

Nếu website được deploy lên **Vercel** hoặc môi trường Serverless, cấu hình trong phần **Settings -> Environment Variables** của dự án:

| Tên biến (Key) | Giá trị mẫu | Ghi chú |
| :--- | :--- | :--- |
| `SMTP_HOST` | `smtp.gmail.com` | Máy chủ gửi mail |
| `SMTP_PORT` | `465` | Cổng SSL an toàn |
| `SMTP_USER` | `lvotiling@gmail.com` | Email Gmail gửi đi |
| `SMTP_PASS` | `xxxx xxxx xxxx xxxx` | Mật khẩu ứng dụng 16 ký tự |

*(Nếu chạy trên VPS/Server riêng của khách, các thông tin lưu qua Admin sẽ tự động ghi vào `settings.json` mà không cần setup biến môi trường)*.
