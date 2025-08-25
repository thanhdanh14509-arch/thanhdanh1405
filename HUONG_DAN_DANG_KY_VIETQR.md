# 📋 Hướng Dẫn Đăng Ký VietQR.IO API

Để sử dụng dịch vụ tạo mã QR của VietQR.IO, anh cần đăng ký tài khoản và lấy API credentials.

## 🚀 Bước 1: Đăng ký tài khoản

1. **Truy cập trang đăng ký**: https://my.vietqr.io/
2. **Click "Đăng ký"** hoặc "Sign Up"
3. **Điền thông tin cá nhân**:
   - Họ và tên
   - Email
   - Số điện thoại
   - Mật khẩu
4. **Xác thực email** và hoàn tất đăng ký

## 🔑 Bước 2: Lấy Client ID và API Key

1. **Đăng nhập** vào tài khoản VietQR.IO
2. **Vào phần "API Management"** hoặc "Quản lý API"
3. **Tạo API Key mới**:
   - Click "Create New API Key"
   - Đặt tên cho API Key (ví dụ: "Donate Website")
   - Chọn quyền truy cập (thường là "Read Only" hoặc "Basic")
4. **Copy thông tin**:
   - **Client ID**: Dãy ký tự dài
   - **API Key**: Dãy ký tự dài

## ⚙️ Bước 3: Cấu hình vào code

Mở file `script.js` và cập nhật thông tin:

```javascript
const VIETQR_CONFIG = {
    // Thông tin tài khoản nhận tiền
    accountNo: '0979143369', // Số tài khoản của anh
    accountName: 'NGUYEN HOANG THANH DANH', // Tên tài khoản của anh
    acqId: 970422, // Mã BIN ngân hàng (970422 = MB Bank)
    template: 'compact2', // Template QR code
    
    // THAY ĐỔI THÔNG TIN NÀY
    clientId: 'YOUR_CLIENT_ID_HERE', // Thay bằng Client ID thật
    apiKey: 'YOUR_API_KEY_HERE' // Thay bằng API Key thật
};
```

## 🏦 Bước 4: Cập nhật thông tin ngân hàng

Nếu anh muốn dùng ngân hàng khác, cập nhật `acqId`:

```javascript
// Ví dụ: Chuyển sang Vietcombank
acqId: 970436, // Vietcombank
accountNo: '1234567890', // Số tài khoản Vietcombank
accountName: 'NGUYEN HOANG THANH DANH', // Tên tài khoản
```

## 📋 Danh sách mã BIN ngân hàng

| Ngân hàng | Mã BIN (acqId) |
|-----------|----------------|
| Vietcombank | 970436 |
| Techcombank | 970407 |
| MB Bank | 970422 |
| VPBank | 970432 |
| ACB | 970416 |
| BIDV | 970418 |
| Agribank | 970403 |
| SCB | 970429 |
| TPBank | 970423 |
| MSB | 970426 |
| OCB | 970448 |
| SHB | 970443 |

## 🔒 Bảo mật

- **Không chia sẻ** Client ID và API Key
- **Không commit** thông tin này lên Git
- **Sử dụng environment variables** nếu deploy lên server

## 🐛 Troubleshooting

### Lỗi thường gặp:

1. **"Invalid credentials"**: Kiểm tra lại Client ID và API Key
2. **"Account not found"**: Kiểm tra lại số tài khoản và mã BIN
3. **"Rate limit exceeded"**: Đã vượt quá giới hạn API calls
4. **"Invalid amount"**: Số tiền không hợp lệ

### Kiểm tra:

1. **Console log**: Mở Developer Tools (F12) xem lỗi
2. **Network tab**: Kiểm tra request/response
3. **API documentation**: https://www.vietqr.io/danh-sach-api/

## 💡 Tips

- **Test trước**: Thử với số tiền nhỏ trước
- **Backup**: Lưu thông tin API credentials an toàn
- **Monitor**: Theo dõi số lượng API calls đã sử dụng
- **Support**: Liên hệ VietQR.IO nếu có vấn đề

## 📞 Hỗ trợ

- **Website**: https://my.vietqr.io/
- **Documentation**: https://www.vietqr.io/danh-sach-api/
- **Email**: support@vietqr.io

---

**Lưu ý**: Sau khi cấu hình xong, trang web sẽ tạo được mã QR tự động! 🎉
