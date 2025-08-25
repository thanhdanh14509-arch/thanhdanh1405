# 🎉 Trang Web Donate với VietQR.IO

Trang web donate hiện đại, responsive với tích hợp VietQR.IO API để tạo mã QR thanh toán tự động.

## ✨ Tính năng

- **🎨 Giao diện đẹp mắt**: Thiết kế modern, clean với gradient background
- **📱 Responsive**: Hoạt động tốt trên mọi thiết bị (desktop, tablet, mobile)
- **🏦 Hỗ trợ nhiều ngân hàng**: 12 ngân hàng phổ biến tại Việt Nam
- **🔍 Tạo QR Code**: Sử dụng thư viện JavaScript, không cần đăng ký API
- **📋 Copy thông tin**: Copy số tài khoản nhanh chóng
- **💾 Download QR**: Tải xuống mã QR để chia sẻ
- **⌨️ Keyboard shortcuts**: Hỗ trợ phím tắt để sử dụng nhanh
- **🎯 UX/UI tối ưu**: Loading states, toast notifications, smooth animations

## 🚀 Cách sử dụng

### 1. Cấu hình thông tin tài khoản

Mở file `script.js` và cập nhật thông tin trong `ACCOUNT_CONFIG`:

```javascript
const ACCOUNT_CONFIG = {
    accountNo: '1234567890',        // Số tài khoản của bạn
    accountName: 'NGUYEN VAN A',    // Tên tài khoản của bạn
    acqId: 970436,                  // Mã BIN ngân hàng (970436 = Vietcombank)
    template: 'compact2'            // Template QR code
};
```

### 2. Danh sách mã ngân hàng

| Mã | Tên ngân hàng |
|----|---------------|
| VCB | Vietcombank |
| TCB | Techcombank |
| MB | MB Bank |
| VPB | VPBank |
| ACB | ACB |
| BIDV | BIDV |
| AGB | Agribank |
| SCB | SCB |
| TPB | TPBank |
| MSB | MSB |
| OCB | OCB |
| SHB | SHB |

### 3. Chạy trang web

1. Mở file `index.html` trong trình duyệt
2. Hoặc sử dụng local server:
   ```bash
   # Với Python
   python -m http.server 8000
   
   # Với Node.js
   npx serve .
   
   # Với PHP
   php -S localhost:8000
   ```

## 🎯 Hướng dẫn sử dụng

### Cho người dùng cuối:

1. **Nhập thông tin**: Điền tên, số tiền và lời nhắn (tùy chọn)
2. **Chọn ngân hàng**: Click vào logo ngân hàng muốn thanh toán
3. **Tạo mã QR**: Click "Tạo Mã QR Thanh Toán"
4. **Thanh toán**: Quét mã QR bằng app ngân hàng
5. **Copy thông tin**: Click nút copy để lưu số tài khoản
6. **Tải QR**: Download mã QR để chia sẻ

### Phím tắt:

- `Ctrl/Cmd + Enter`: Submit form nhanh
- `Escape`: Reset form
- Click vào ngân hàng: Chọn ngân hàng thanh toán

## 🔧 Tùy chỉnh

### Thay đổi màu sắc

Chỉnh sửa CSS variables trong `styles.css`:

```css
:root {
    --primary-color: #667eea;
    --secondary-color: #764ba2;
    --success-color: #27ae60;
    --error-color: #e74c3c;
}
```

### Thêm ngân hàng mới

Thêm vào array `BANKS` trong `script.js`:

```javascript
{ id: 'NEW_BANK', name: 'Tên Ngân Hàng', logo: 'https://api.vietqr.io/image/NEW_BANK.png' }
```

### Tùy chỉnh template QR

Thay đổi `template` trong `VIETQR_CONFIG`:
- `compact`: QR nhỏ gọn
- `compact2`: QR nhỏ gọn với logo
- `qr_only`: Chỉ QR code
- `print`: Template in ấn

## 📱 Responsive Design

Trang web được tối ưu cho:
- **Desktop**: Layout 2 cột, hover effects
- **Tablet**: Layout thích ứng, touch-friendly
- **Mobile**: Layout 1 cột, buttons lớn hơn

## 🔒 Bảo mật

- Không lưu trữ thông tin thanh toán
- Sử dụng HTTPS cho API calls
- Validation dữ liệu đầu vào
- Error handling an toàn

## 🐛 Troubleshooting

### Lỗi thường gặp:

1. **QR không hiển thị**: Kiểm tra thông tin tài khoản trong config
2. **API lỗi**: Kiểm tra kết nối internet và CORS
3. **Copy không hoạt động**: Trình duyệt không hỗ trợ Clipboard API
4. **Logo ngân hàng lỗi**: Sử dụng placeholder image

### Debug:

Mở Developer Tools (F12) và xem Console để kiểm tra:
- API responses
- JavaScript errors
- Network requests

## 📞 Hỗ trợ

Nếu gặp vấn đề:
1. Kiểm tra Console log
2. Verify thông tin tài khoản
3. Test với ngân hàng khác
4. Kiểm tra kết nối internet

## 📄 License

MIT License - Tự do sử dụng và chỉnh sửa.

## 🙏 Credits

- **QRCode.js**: Thư viện tạo mã QR
- **Font Awesome**: Icons
- **Google Fonts**: Typography

---

**Lưu ý**: Đây là trang web demo. Hãy cập nhật thông tin tài khoản thật trước khi sử dụng! 🚀
