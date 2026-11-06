// LỚP DỮ LIỆU: chỉ biết cách lưu/lấy dữ liệu, không chứa quy tắc nghiệp vụ.
// Muốn đổi sang MySQL/MongoDB chỉ cần viết lại file này.
const store = require('./jsonStore');
const FILE = 'products.json';

class ProductRepository {
  findAll() { return store.read(FILE); }
  findById(id) { return this.findAll().find((p) => p.id === id) || null; }
  updateStock(id, newStock) {
    const all = this.findAll();
    const item = all.find((p) => p.id === id);
    if (item) { item.stock = newStock; store.write(FILE, all); }
  }
}
module.exports = ProductRepository;
