module.exports = (orderService) => ({
  create: (req, res, next) => {
    try { res.status(201).json(orderService.create(req.body)); } catch (e) { next(e); }
  }
});
