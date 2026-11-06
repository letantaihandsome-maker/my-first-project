const FREE_SHIP_FROM = 500000;
const SHIP_FEE = 30000;
const PHONE_RE = /^(0|\+84)\d{9}$/;

function fail(message) {
  const err = new Error(message);
  err.status = 400;
  return err;
}

class OrderService {
  constructor(orderRepo, productRepo) {
    this.orderRepo = orderRepo;
    this.productRepo = productRepo;
  }

  create({ customer, items }) {
    // 1. Kiểm tra thông tin khách hàng
    const name = (customer?.name || '').trim();
    const phone = (customer?.phone || '').replace(/\s/g, '');
    const address = (customer?.address || '').trim();
    if (name.length < 2) throw fail('Vui lòng nhập họ tên.');
    if (!PHONE_RE.test(phone)) throw fail('Số điện thoại chưa đúng (VD: 0901234567).');
    if (address.length < 8) throw fail('Vui lòng nhập địa chỉ giao hàng đầy đủ.');
    if (!Array.isArray(items) || items.length === 0) throw fail('Giỏ hàng đang trống.');

    // 2. Kiểm tra từng món + tính tiền theo giá ở server (không tin giá từ trình duyệt)
    const lines = items.map(({ productId, quantity }) => {
      const product = this.productRepo.findById(Number(productId));
      const qty = Number(quantity);
      if (!product) throw fail('Có sản phẩm không còn tồn tại.');
      if (!Number.isInteger(qty) || qty < 1 || qty > 20) throw fail(`Số lượng "${product.name}" không hợp lệ.`);
      if (qty > product.stock) throw fail(`"${product.name}" chỉ còn ${product.stock} sản phẩm.`);
      return { product, qty, lineTotal: product.price * qty };
    });

    const subtotal = lines.reduce((sum, l) => sum + l.lineTotal, 0);
    const shipping = subtotal >= FREE_SHIP_FROM ? 0 : SHIP_FEE;

    // 3. Trừ kho và lưu đơn
    lines.forEach((l) => this.productRepo.updateStock(l.product.id, l.product.stock - l.qty));
    return this.orderRepo.save({
      id: 'DH' + Date.now().toString(36).toUpperCase(),
      createdAt: new Date().toISOString(),
      customer: { name, phone, address },
      items: lines.map((l) => ({ productId: l.product.id, name: l.product.name, price: l.product.price, quantity: l.qty })),
      subtotal, shipping, total: subtotal + shipping
    });
  }
}
module.exports = OrderService;
