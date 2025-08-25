// Cấu hình thông tin tài khoản
const ACCOUNT_CONFIG = {
    // Thông tin tài khoản nhận tiền - ANH CẦN THAY ĐỔI THÔNG TIN NÀY
    accountNo: '0979143369', // Số tài khoản của anh
    accountName: 'NGUYEN HOANG THANH DANH', // Tên tài khoản của anh
    acqId: 970422, // Mã BIN ngân hàng (970422 = MB Bank)
    template: 'compact2' // Template QR code
};

// Danh sách ngân hàng phổ biến với mã BIN
const BANKS = [
    { id: 'VCB', name: 'Vietcombank', acqId: 970436, logo: 'https://api.vietqr.io/image/VCB.png' },
    { id: 'TCB', name: 'Techcombank', acqId: 970407, logo: 'https://api.vietqr.io/image/TCB.png' },
    { id: 'MB', name: 'MB Bank', acqId: 970422, logo: 'https://api.vietqr.io/image/MB.png' },
    { id: 'VPB', name: 'VPBank', acqId: 970432, logo: 'https://api.vietqr.io/image/VPB.png' },
    { id: 'ACB', name: 'ACB', acqId: 970416, logo: 'https://api.vietqr.io/image/ACB.png' },
    { id: 'BIDV', name: 'BIDV', acqId: 970418, logo: 'https://api.vietqr.io/image/BIDV.png' },
    { id: 'AGB', name: 'Agribank', acqId: 970403, logo: 'https://api.vietqr.io/image/AGB.png' },
    { id: 'SCB', name: 'SCB', acqId: 970429, logo: 'https://api.vietqr.io/image/SCB.png' },
    { id: 'TPB', name: 'TPBank', acqId: 970423, logo: 'https://api.vietqr.io/image/TPB.png' },
    { id: 'MSB', name: 'MSB', acqId: 970426, logo: 'https://api.vietqr.io/image/MSB.png' },
    { id: 'OCB', name: 'OCB', acqId: 970448, logo: 'https://api.vietqr.io/image/OCB.png' },
    { id: 'SHB', name: 'SHB', acqId: 970443, logo: 'https://api.vietqr.io/image/SHB.png' }
];

// Biến global
let selectedBank = 'MB'; // Default to MB Bank
let currentQRData = null;

// DOM Elements
const donateForm = document.getElementById('donateForm');
const qrResult = document.getElementById('qrResult');
const qrImage = document.getElementById('qrImage');
const bankGrid = document.getElementById('bankGrid');
const loadingModal = document.getElementById('loadingModal');
const toast = document.getElementById('toast');
const toastMessage = document.getElementById('toastMessage');

// Khởi tạo trang
document.addEventListener('DOMContentLoaded', function() {
    initializeBanks();
    setupEventListeners();
});

// Khởi tạo danh sách ngân hàng
function initializeBanks() {
    bankGrid.innerHTML = '';
    
    BANKS.forEach(bank => {
        const bankItem = document.createElement('div');
        bankItem.className = `bank-item ${bank.id === selectedBank ? 'selected' : ''}`;
        
        // Tạo placeholder image đơn giản
        const placeholderSvg = `<svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="40" height="40" rx="8" fill="#F8F9FA"/>
            <text x="20" y="25" font-family="Arial" font-size="12" fill="#667eea" text-anchor="middle">${bank.id}</text>
        </svg>`;
        const placeholderUrl = 'data:image/svg+xml;base64,' + btoa(placeholderSvg);
        
        bankItem.innerHTML = `
            <img src="${bank.logo}" alt="${bank.name}" onerror="this.src='${placeholderUrl}'">
            <span>${bank.name}</span>
        `;
        
        bankItem.addEventListener('click', () => selectBank(bank.id));
        bankGrid.appendChild(bankItem);
    });
}

// Chọn ngân hàng
function selectBank(bankId) {
    selectedBank = bankId;
    
    // Cập nhật acqId trong config
    const selectedBankInfo = BANKS.find(bank => bank.id === bankId);
    if (selectedBankInfo) {
        ACCOUNT_CONFIG.acqId = selectedBankInfo.acqId;
    }
    
    // Cập nhật UI
    document.querySelectorAll('.bank-item').forEach(item => {
        item.classList.remove('selected');
    });
    
    const selectedItem = Array.from(document.querySelectorAll('.bank-item')).find(item => 
        item.querySelector('span').textContent === selectedBankInfo?.name
    );
    
    if (selectedItem) {
        selectedItem.classList.add('selected');
    }
}

// Setup event listeners
function setupEventListeners() {
    // Form submit
    donateForm.addEventListener('submit', handleFormSubmit);
    
    // Copy account number
    document.getElementById('copyAccount').addEventListener('click', copyAccountNumber);
    
    // Download QR
    document.getElementById('downloadQR').addEventListener('click', downloadQR);
    
    // New donation
    document.getElementById('newDonation').addEventListener('click', resetForm);
}

// Xử lý form submit
async function handleFormSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(donateForm);
    const donorName = formData.get('donorName').trim();
    const amount = parseInt(formData.get('amount'));
    const message = formData.get('message').trim();
    
    // Validation
    if (!donorName || !amount || amount < 1000) {
        showToast('Vui lòng nhập đầy đủ thông tin và số tiền tối thiểu 1,000 VNĐ', 'error');
        return;
    }
    
    // Hiển thị loading
    showLoading(true);
    
    try {
        // Tạo nội dung chuyển khoản
        const transferContent = message ? `${donorName} - ${message}` : donorName;
        
        // Gọi API VietQR.IO
        const qrData = await generateVietQR(amount, transferContent);
        
        if (qrData) {
            displayQRResult(qrData, donorName, amount, message);
            showToast('Tạo mã QR thành công! 🎉');
        } else {
            showToast('Có lỗi xảy ra khi tạo mã QR. Vui lòng thử lại.', 'error');
        }
    } catch (error) {
        console.error('Error generating QR:', error);
        showToast('Có lỗi xảy ra khi tạo mã QR. Vui lòng thử lại.', 'error');
    } finally {
        showLoading(false);
    }
}

// Tạo QR code - thử API VietQR.IO v2 trước, fallback về QRCode.js
async function generateVietQR(amount, content) {
    try {
        // Thử gọi API VietQR.IO v2 trước
        const apiResult = await tryVietQRAPI(amount, content);
        if (apiResult) {
            return apiResult;
        }
        
        // Nếu API không hoạt động, fallback về QRCode.js
        console.log('API VietQR.IO không khả dụng, sử dụng QRCode.js...');
        return await generateQRWithLibrary(amount, content);
        
    } catch (error) {
        console.error('QR Generation Error:', error);
        // Fallback về QRCode.js
        return await generateQRWithLibrary(amount, content);
    }
}

// Thử gọi API VietQR.IO v2 mà không cần authentication
async function tryVietQRAPI(amount, content) {
    const apiUrl = 'https://api.vietqr.io/v2/generate';
    
    // Chuẩn bị request body theo chuẩn VietQR v2
    const requestBody = {
        accountNo: ACCOUNT_CONFIG.accountNo,
        accountName: ACCOUNT_CONFIG.accountName,
        acqId: ACCOUNT_CONFIG.acqId,
        amount: amount,
        format: 'image',
        template: ACCOUNT_CONFIG.template
    };
    
    // Thêm nội dung chuyển khoản nếu có
    if (content && content.length <= 25) {
        requestBody.addInfo = content;
    } else if (content && content.length > 25) {
        requestBody.addInfo = content.substring(0, 25);
    }
    
    try {
        console.log('Đang thử gọi VietQR.IO API v2...');
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
                // Không có x-client-id và x-api-key
            },
            body: JSON.stringify(requestBody)
        });
        
        console.log('API Response Status:', response.status);
        
        if (response.ok) {
            const result = await response.json();
            console.log('API Response:', result);
            
            if (result.code === '00' && result.data && result.data.qrDataURL) {
                // Lưu thông tin QR hiện tại
                currentQRData = {
                    imageUrl: result.data.qrDataURL,
                    bankId: selectedBank,
                    accountNo: ACCOUNT_CONFIG.accountNo,
                    accountName: ACCOUNT_CONFIG.accountName,
                    amount,
                    content: requestBody.addInfo || ''
                };
                
                showToast('Sử dụng VietQR.IO API thành công! 🎉');
                return currentQRData;
            }
        } else {
            const errorText = await response.text();
            console.log('API Error Response:', errorText);
        }
        
        return null;
    } catch (error) {
        console.log('API Call Error:', error);
        return null;
    }
}

// Tạo QR code sử dụng thư viện JavaScript (fallback)
async function generateQRWithLibrary(amount, content) {
    try {
        // Tạo chuỗi thông tin chuyển khoản
        const qrString = generateVietQRString(amount, content);
        
        // Tạo QR code container
        const qrContainer = document.createElement('div');
        qrContainer.id = 'qr-code-container';
        
        // Xóa QR code cũ nếu có
        const existingQR = document.getElementById('qr-code-container');
        if (existingQR) {
            existingQR.remove();
        }
        
        // Tạo QR code mới
        const qrcode = new QRCode(qrContainer, {
            text: qrString,
            width: 200,
            height: 200,
            colorDark: '#000000',
            colorLight: '#FFFFFF',
            correctLevel: QRCode.CorrectLevel.H
        });
        
        // Chuyển QR code thành image URL
        const canvas = qrContainer.querySelector('canvas');
        const imageUrl = canvas.toDataURL('image/png');
        
        // Lưu thông tin QR hiện tại
        currentQRData = {
            imageUrl: imageUrl,
            bankId: selectedBank,
            accountNo: ACCOUNT_CONFIG.accountNo,
            accountName: ACCOUNT_CONFIG.accountName,
            amount,
            content: content || ''
        };
        
        showToast('Sử dụng QRCode.js library! 📱');
        return currentQRData;
    } catch (error) {
        console.error('QRCode.js Error:', error);
        return null;
    }
}

// Tạo chuỗi thông tin chuyển khoản đơn giản
function generateVietQRString(amount, content) {
    const bankInfo = BANKS.find(bank => bank.id === selectedBank);
    const bankName = bankInfo ? bankInfo.name : 'Unknown Bank';
    
    // Tạo chuỗi thông tin chuyển khoản
    const transferInfo = {
        bank: bankName,
        accountNo: ACCOUNT_CONFIG.accountNo,
        accountName: ACCOUNT_CONFIG.accountName,
        amount: amount,
        content: content || ''
    };
    
    // Format thành chuỗi JSON đơn giản
    return JSON.stringify(transferInfo);
}

// Hiển thị kết quả QR
function displayQRResult(qrData, donorName, amount, message) {
    // Cập nhật QR image
    qrImage.src = qrData.imageUrl;
    
    // Cập nhật thông tin thanh toán
    const bankInfo = BANKS.find(bank => bank.id === qrData.bankId);
    document.getElementById('bankName').textContent = bankInfo ? bankInfo.name : qrData.bankId;
    document.getElementById('accountNumber').textContent = qrData.accountNo;
    document.getElementById('accountName').textContent = qrData.accountName;
    document.getElementById('displayAmount').textContent = formatCurrency(amount);
    document.getElementById('displayMessage').textContent = message || 'Không có lời nhắn';
    
    // Hiển thị section QR
    qrResult.style.display = 'block';
    
    // Scroll đến QR result
    qrResult.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// Copy số tài khoản
async function copyAccountNumber() {
    const accountNumber = document.getElementById('accountNumber').textContent;
    
    try {
        await navigator.clipboard.writeText(accountNumber);
        showToast('Đã copy số tài khoản vào clipboard! 📋');
    } catch (error) {
        console.error('Copy failed:', error);
        showToast('Không thể copy. Vui lòng thử lại.', 'error');
    }
}

// Download QR code
function downloadQR() {
    if (!currentQRData) {
        showToast('Không có mã QR để tải xuống.', 'error');
        return;
    }
    
    const link = document.createElement('a');
    link.href = currentQRData.imageUrl;
    link.download = `qr-donate-${currentQRData.amount}-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showToast('Đã tải xuống mã QR! 📥');
}

// Reset form
function resetForm() {
    donateForm.reset();
    qrResult.style.display = 'none';
    
    // Clear QR image
    if (currentQRData && currentQRData.imageUrl) {
        URL.revokeObjectURL(currentQRData.imageUrl);
        currentQRData = null;
    }
    
    // Scroll về đầu trang
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    showToast('Đã reset form. Sẵn sàng cho lần ủng hộ mới! ✨');
}

// Hiển thị loading
function showLoading(show) {
    loadingModal.style.display = show ? 'flex' : 'none';
}

// Hiển thị toast message
function showToast(message, type = 'success') {
    toastMessage.textContent = message;
    
    // Thay đổi màu sắc theo type
    if (type === 'error') {
        toast.style.background = '#e74c3c';
    } else {
        toast.style.background = '#27ae60';
    }
    
    toast.style.display = 'flex';
    
    // Tự động ẩn sau 3 giây
    setTimeout(() => {
        toast.style.display = 'none';
    }, 3000);
}

// Format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(amount);
}

// Error handling cho image loading - backup method
document.addEventListener('error', function(e) {
    if (e.target.tagName === 'IMG' && e.target.parentElement.classList.contains('bank-item')) {
        const bankId = e.target.alt.split(' ')[0];
        
        // Tạo placeholder SVG đơn giản
        const placeholderSvg = `<svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="40" height="40" rx="8" fill="#F8F9FA"/>
            <text x="20" y="25" font-family="Arial" font-size="12" fill="#667eea" text-anchor="middle">${bankId}</text>
        </svg>`;
        const placeholderUrl = 'data:image/svg+xml;base64,' + btoa(placeholderSvg);
        
        e.target.src = placeholderUrl;
    }
}, true);

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + Enter để submit form
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        if (donateForm.checkValidity()) {
            donateForm.dispatchEvent(new Event('submit'));
        }
    }
    
    // Escape để reset form
    if (e.key === 'Escape') {
        resetForm();
    }
});

// Auto-resize textarea
document.getElementById('message').addEventListener('input', function() {
    this.style.height = 'auto';
    this.style.height = Math.min(this.scrollHeight, 120) + 'px';
});

// Smooth scroll cho anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Console log để debug
console.log('🚀 Donate Page đã sẵn sàng!');
console.log('💡 Tips:');
console.log('- Ctrl/Cmd + Enter: Submit form nhanh');
console.log('- Escape: Reset form');
console.log('- Click vào ngân hàng để chọn');
console.log('📧 Liên hệ: Nếu có vấn đề gì, hãy check console log này!');
