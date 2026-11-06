// LỚP TRÌNH BÀY (phía server): nhận request, gọi service, trả JSON.
module.exports = (productService) => ({
  list: (req, res) => res.json(productService.list(req.query.category)),
  categories: (req, res) => res.json(productService.getCategories()),
  detail: (req, res, next) => {
    try { res.json(productService.get(Number(req.params.id))); } catch (e) { next(e); }
  }
});
