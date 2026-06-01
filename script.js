const phoneNumber = "919673548133";

const menuItems = [
  { id: "banoffee", name: "Banoffee", category: "dessert", img: "banoffee.jpg", desc: "Creamy banana, caramel and biscuit-layer dessert for sweet café cravings." },
  { id: "cafelattee", name: "Café Latte", category: "coffee", img: "cafelattee.jpg", desc: "Smooth espresso with steamed milk and a soft café finish." },
  { id: "cocomacaroons", name: "Coco Macaroons", category: "dessert", img: "cocomacaroons.jpg", desc: "Coconut-rich bite-sized treats with a golden bakery texture." },
  { id: "cupcake", name: "Cupcake", category: "dessert", img: "cupcake.jpg", desc: "Soft sponge, pretty frosting and celebration-ready charm." },
  { id: "dodol", name: "Dodol", category: "dessert", img: "dodol.jpg", desc: "Traditional Goan sweetness with deep caramel coconut notes." },
  { id: "flatwhite", name: "Flat White", category: "coffee", img: "flatwhite.jpg", desc: "Velvety microfoam, balanced espresso and a clean finish." },
  { id: "lemonicetea", name: "Lemon Ice Tea", category: "cold", img: "lemonicetea.jpg", desc: "Bright, chilled and refreshing for Miramar afternoons." },
  { id: "operacake", name: "Opera Cake", category: "dessert", img: "operacake.jpg", desc: "Elegant layered cake with coffee, chocolate and patisserie finesse." },
  { id: "pasta", name: "Pasta", category: "cafe", img: "pasta.jpg", desc: "Comforting café plate for a savoury break between desserts." },
  { id: "menu", name: "Ask for Today’s Menu", category: "cafe", img: "menu.jpg", desc: "Check daily specials, availability, custom cakes and fresh counter items." }
];

let cart = JSON.parse(localStorage.getItem("pv_cart") || "{}");

const menuGrid = document.getElementById("menuGrid");
const cartItems = document.getElementById("cartItems");
const sendOrder = document.getElementById("sendOrder");
const clearCart = document.getElementById("clearCart");
const customerName = document.getElementById("customerName");
const orderNote = document.getElementById("orderNote");

function titleCase(value){
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function renderMenu(filter = "all"){
  const filtered = filter === "all" ? menuItems : menuItems.filter(item => item.category === filter);
  menuGrid.innerHTML = filtered.map(item => `
    <article class="menu-card reveal visible" data-category="${item.category}">
      <img src="assets/${item.img}" alt="${item.name}" loading="lazy" />
      <div class="menu-card-body">
        <div class="menu-meta"><span class="tag">${titleCase(item.category)}</span><span>♡</span></div>
        <h3>${item.name}</h3>
        <p>${item.desc}</p>
        <button class="add-btn" data-id="${item.id}" type="button">Add to WhatsApp Order</button>
      </div>
    </article>
  `).join("");
}

function saveCart(){
  localStorage.setItem("pv_cart", JSON.stringify(cart));
}

function renderCart(){
  const ids = Object.keys(cart);
  if(!ids.length){
    cartItems.innerHTML = `<p class="empty">No items added yet.</p>`;
  } else {
    cartItems.innerHTML = ids.map(id => {
      const item = menuItems.find(product => product.id === id);
      return `
        <div class="cart-row">
          <div><strong>${item.name}</strong><br><small>${titleCase(item.category)}</small></div>
          <div class="qty">
            <button type="button" data-action="minus" data-id="${id}">−</button>
            <strong>${cart[id]}</strong>
            <button type="button" data-action="plus" data-id="${id}">+</button>
          </div>
        </div>
      `;
    }).join("");
  }
  updateWhatsAppLink();
  saveCart();
}

function updateWhatsAppLink(){
  const ids = Object.keys(cart);
  const lines = ids.map(id => {
    const item = menuItems.find(product => product.id === id);
    return `• ${item.name} x ${cart[id]}`;
  });
  const name = customerName.value.trim();
  const note = orderNote.value.trim();
  const message = [
    "Hi Patisserie Victoria, I would like to place an order.",
    name ? `Name: ${name}` : "Name:",
    "",
    lines.length ? "Order items:\n" + lines.join("\n") : "Order items: I would like to enquire about today's availability.",
    "",
    note ? `Note: ${note}` : "Note:",
    "",
    "Please confirm availability and total amount."
  ].join("\n");
  sendOrder.href = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
}

menuGrid.addEventListener("click", event => {
  const button = event.target.closest(".add-btn");
  if(!button) return;
  cart[button.dataset.id] = (cart[button.dataset.id] || 0) + 1;
  renderCart();
  document.getElementById("order").scrollIntoView({ behavior: "smooth", block: "start" });
});

cartItems.addEventListener("click", event => {
  const button = event.target.closest("button");
  if(!button) return;
  const id = button.dataset.id;
  if(button.dataset.action === "plus") cart[id] = (cart[id] || 0) + 1;
  if(button.dataset.action === "minus") {
    cart[id] -= 1;
    if(cart[id] <= 0) delete cart[id];
  }
  renderCart();
});

clearCart.addEventListener("click", () => {
  cart = {};
  renderCart();
});

[customerName, orderNote].forEach(input => input.addEventListener("input", updateWhatsAppLink));

document.querySelectorAll(".filter-btn").forEach(button => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".filter-btn").forEach(btn => btn.classList.remove("active"));
    button.classList.add("active");
    renderMenu(button.dataset.filter);
  });
});

const toggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");
toggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  toggle.setAttribute("aria-expanded", String(isOpen));
});

document.querySelectorAll(".nav-links a").forEach(link => link.addEventListener("click", () => {
  navLinks.classList.remove("open");
  toggle.setAttribute("aria-expanded", "false");
}));

document.getElementById("quickOrder").addEventListener("click", () => {
  document.getElementById("order").scrollIntoView({ behavior: "smooth" });
});

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if(entry.isIntersecting) entry.target.classList.add("visible");
  });
}, { threshold: 0.14 });

document.querySelectorAll(".reveal").forEach(item => observer.observe(item));

renderMenu();
renderCart();
