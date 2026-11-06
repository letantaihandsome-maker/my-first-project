const store = require('./jsonStore');
const FILE = 'orders.json';

class OrderRepository {
  findAll() { return store.read(FILE); }
  save(order) {
    const all = this.findAll();
    all.push(order);
    store.write(FILE, all);
    return order;
  }
}
module.exports = OrderRepository;
