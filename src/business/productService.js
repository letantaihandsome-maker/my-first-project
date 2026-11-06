// LỚP NGHIỆP VỤ: quy tắc của cửa hàng, không biết gì về HTTP hay file JSON.
const CATEGORIES = [
  { id: 'gom', label: 'Gốm đất nung' },
  { id: 'vai', label: 'Vải chàm & thổ cẩm' },
  { id: 'go', label: 'Gỗ & tre' },
  { id: 'giay', label: 'Giấy & sáp ong' }
];

class ProductService {
  constructor(productRepo) { this.productRepo = productRepo; }

  getCategories() { return CATEGORIES; }

  list(category) {
    const all = this.productRepo.findAll();
    return category ? all.filter((p) => p.category === category) : all;
  }

  get(id) {
    const product = this.productRepo.findById(id);
    if (!product) {
      const err = new Error('Không tìm thấy sản phẩm.');
      err.status = 404;
      throw err;
    }
    return product;
  }
}
module.exports = ProductService;
