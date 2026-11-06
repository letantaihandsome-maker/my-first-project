# Xưởng Nhỏ - Web bán hàng thủ công (kiến trúc 3 lớp)

## Chạy dự án
```bash
npm install
npm start
# mở http://localhost:3000
```
Yêu cầu: Node.js 18 trở lên.

## Kiến trúc 3 lớp
| Lớp | Thư mục | Trách nhiệm |
|---|---|---|
| Trình bày (Presentation) | `public/` và `src/presentation/` | Giao diện HTML5/CSS3/JS, routes và controllers nhận request, trả JSON |
| Nghiệp vụ (Business) | `src/business/` | Kiểm tra dữ liệu, tính tiền, phí ship, trừ kho |
| Dữ liệu (Data) | `src/data/` | Đọc/ghi `db/*.json` qua các repository |

Luồng gọi một chiều: `Controller -> Service -> Repository`.
Lớp trên chỉ gọi lớp ngay dưới nó, nên có thể thay file JSON bằng MySQL/MongoDB mà không sửa lớp nghiệp vụ.

## API
- `GET /api/categories`
- `GET /api/products?category=gom`
- `GET /api/products/:id`
- `POST /api/orders` với `{ customer: {name, phone, address}, items: [{productId, quantity}] }`

Đơn hàng được lưu trong `src/data/db/orders.json`.
