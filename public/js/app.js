// LỚP TRÌNH BÀY (phía trình duyệt): hiển thị và nhận thao tác, mọi dữ liệu lấy qua /api
const $ = (id) => document.getElementById(id);
const money = (n) => n.toLocaleString('vi-VN') + 'đ';
const FREE_SHIP_FROM = 500000, SHIP_FEE = 30000; // chỉ để hiển thị; server tính lại khi đặt hàng

let products = [];
let cart = []; // [{ productId, quantity }]
let activeCategory = '';

const api = async (url, options) => {
  const res = await fetch(url, options);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Có lỗi xảy ra.');
  return data;
};

/* ---------- Danh mục & sản phẩm ---------- */
async function loadCategories() {
  const cats = await api('/api/categories');
  const tones = { gom: '#C9D6CF', vai: '#B7C4D6', go: '#E0CBA8', giay: '#EBDFA9' };
  const all = [{ id: '', label: 'Tất cả' }, ...cats];
  $('materials').innerHTML = '';
  all.forEach((c) => {
    const b = document.createElement('button');
    b.className = 'material';
    b.role = 'tab';
    b.textContent = c.label;
    b.style.setProperty('--tone', tones[c.id] || '#DCE6DF');
    b.setAttribute('aria-selected', c.id === activeCategory);
    b.addEventListener('click', () => { activeCategory = c.id; loadCategories(); loadProducts(); });
    $('materials').appendChild(b);
  });
}

async function loadProducts() {
  products = await api('/api/products' + (activeCategory ? `?category=${activeCategory}` : ''));
  renderGrid();
}

function renderGrid() {
  const grid = $('grid');
  grid.innerHTML = '';
  products.forEach((p) => {
    const card = document.createElement('article');
    card.className = 'card';
    const inCart = cart.find((i) => i.productId === p.id)?.quantity || 0;
    const soldOut = p.stock - inCart <= 0;
    card.innerHTML = `
      <div class="swatch pat-${p.category}" style="--tone:${p.tone}">
        ${p.stock <= 5 ? `<span class="tag-last">Còn ${p.stock}</span>` : ''}
      </div>
      <h3></h3><p></p>
      <div class="card-foot"><span class="price">${money(p.price)}</span>
      <button class="add" ${soldOut ? 'disabled' : ''}>${soldOut ? 'Hết hàng' : 'Thêm vào giỏ'}</button></div>`;
    card.querySelector('h3').textContent = p.name;
    card.querySelector('p').textContent = p.description;
    card.querySelector('.add').addEventListener('click', () => addToCart(p.id));
    grid.appendChild(card);
  });
}

/* ---------- Giỏ hàng ---------- */
function addToCart(id) {
  const p = products.find((x) => x.id === id);
  const line = cart.find((i) => i.productId === id);
  if (line) { if (line.quantity < p.stock) line.quantity++; } else cart.push({ productId: id, quantity: 1 });
  renderCart(); renderGrid(); toggleDrawer(true);
}

function changeQty(id, delta) {
  const line = cart.find((i) => i.productId === id);
  const p = products.find((x) => x.id === id);
  line.quantity = Math.min(p.stock, line.quantity + delta);
  if (line.quantity <= 0) cart = cart.filter((i) => i.productId !== id);
  renderCart(); renderGrid();
}

function renderCart() {
  const list = $('cart-list');
  list.innerHTML = '';
  let subtotal = 0, count = 0;
  cart.forEach((line) => {
    const p = products.find((x) => x.id === line.productId);
    subtotal += p.price * line.quantity; count += line.quantity;
    const li = document.createElement('li');
    li.innerHTML = `<strong></strong><span>${money(p.price * line.quantity)}</span>
      <span class="qty"><button aria-label="Giảm">−</button><span>${line.quantity}</span><button aria-label="Tăng">+</button></span>`;
    li.querySelector('strong').textContent = p.name;
    const [minus, plus] = li.querySelectorAll('.qty button');
    minus.addEventListener('click', () => changeQty(p.id, -1));
    plus.addEventListener('click', () => changeQty(p.id, +1));
    list.appendChild(li);
  });
  if (!cart.length) list.innerHTML = '<li class="empty">Giỏ hàng đang trống. Chọn một món bạn thích nhé.</li>';
  const ship = !cart.length ? 0 : subtotal >= FREE_SHIP_FROM ? 0 : SHIP_FEE;
  $('cart-sum').innerHTML = `
    <div><span>Tạm tính</span><span>${money(subtotal)}</span></div>
    <div><span>Phí giao hàng</span><span>${ship ? money(ship) : 'Miễn phí'}</span></div>
    <div class="total"><span>Tổng cộng</span><span>${money(subtotal + ship)}</span></div>`;
  $('cart-count').textContent = count;
}

function toggleDrawer(open) {
  $('drawer').classList.toggle('open', open);
  $('scrim').classList.toggle('on', open);
  $('drawer').setAttribute('aria-hidden', String(!open));
}

/* ---------- Đặt hàng ---------- */
$('checkout').addEventListener('submit', async (e) => {
  e.preventDefault();
  const msg = $('form-msg');
  msg.className = 'form-msg';
  const f = e.target;
  try {
    const order = await api('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customer: { name: f.name.value, phone: f.phone.value, address: f.address.value },
        items: cart
      })
    });
    cart = []; f.reset();
    await loadProducts(); renderCart();
    msg.className = 'form-msg ok';
    msg.textContent = `Đã đặt hàng. Mã đơn của bạn: ${order.id}. Chúng tôi sẽ gọi xác nhận sớm.`;
  } catch (err) {
    msg.textContent = err.message;
  }
});

$('open-cart').addEventListener('click', () => toggleDrawer(true));
$('close-cart').addEventListener('click', () => toggleDrawer(false));
$('scrim').addEventListener('click', () => toggleDrawer(false));
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') toggleDrawer(false); });

(async function init() {
  await loadCategories();
  await loadProducts();
  renderCart();
})();
