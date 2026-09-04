// ---- Dados reais do cardápio da Churrasqueira VanilC ----
const MENU = [
  // Churrasco
  { id:'ch1', cat:'Churrasco', name:'Frango Inteiro', price:8500 },
  { id:'ch2', cat:'Churrasco', name:'Meio Frango', price:4500 },
  { id:'ch3', cat:'Churrasco', name:'Linguiça', price:2500 },
  { id:'ch4', cat:'Churrasco', name:'Frango à Passarinho', price:6000 },
  { id:'ch5', cat:'Churrasco', name:'Febras', price:4500 },
  { id:'ch6', cat:'Churrasco', name:'Entrecosto', price:4500 },
  { id:'ch7', cat:'Churrasco', name:'Entremeada', price:4500 },
  { id:'ch8', cat:'Churrasco', name:'Chouriço Caseiro', price:7000 },

  // Guarnições & Sopas
  { id:'g1', cat:'Guarnições & Sopas', name:'Pão de Alho', price:1500 },
  { id:'g2', cat:'Guarnições & Sopas', name:'Arroz de Feijão', price:2500 },
  { id:'g3', cat:'Guarnições & Sopas', name:'Feijão Preto', price:2000 },
  { id:'g4', cat:'Guarnições & Sopas', name:'Arroz Branco', price:2000 },
  { id:'g5', cat:'Guarnições & Sopas', name:'Molho Especial', price:1000 },
  { id:'g6', cat:'Guarnições & Sopas', name:'Batata Doce/Rena (Frita)', price:2000 },
  { id:'g7', cat:'Guarnições & Sopas', name:'Banana Pão Frita', price:2000 },
  { id:'g8', cat:'Guarnições & Sopas', name:'Sopa / Caldo Verde', price:2000 },

  // Fast Food & Snacks
  { id:'f1', cat:'Fast Food & Snacks', name:'Hamburguer Duplo', price:5000 },
  { id:'f2', cat:'Fast Food & Snacks', name:'Hamburguer VanilC', price:3000 },
  { id:'f3', cat:'Fast Food & Snacks', name:'Faíta de Carne/Frango', price:3000 },
  { id:'f4', cat:'Fast Food & Snacks', name:'Faíta Mista', price:4000 },
  { id:'f5', cat:'Fast Food & Snacks', name:'Torradas', price:500 },
  { id:'f6', cat:'Fast Food & Snacks', name:'Tosta Mista', desc:'Queijo, fiambre e ovo', price:2200 },
  { id:'f7', cat:'Fast Food & Snacks', name:'Sandes do Boss', price:2000 },
  { id:'f8', cat:'Fast Food & Snacks', name:'Sandes de Queijo e Fiambre', price:1800 },

  // Tábua de Grelhada Mista
  { id:'t1', cat:'Grelhada Mista', name:'Mini Grelhada Mista', desc:'Meio frango, linguiça, febras, pão de alho', price:10500 },
  { id:'t2', cat:'Grelhada Mista', name:'Mini Grelhada Mista Especial', desc:'Meio frango, entrecosto, linguiça, pão de alho, molho especial, batata frita', price:16500 },
  { id:'t3', cat:'Grelhada Mista', name:'Grelhada Mista Clássica', desc:'Frango, chouriço, linguiça, arroz de feijão, batata frita, febras, entrecosto, entremeada', price:25000 },
  { id:'t4', cat:'Grelhada Mista', name:'Grelhada Mista Completa', desc:'Frango, febras, entrecosto, entremeada, chouriço, linguiça, arroz de feijão, batata frita, molho especial, pão de alho', price:35000 },
  { id:'t5', cat:'Grelhada Mista', name:'Grelhada Mista com Picanha', desc:'Frango, febras, picanha, entrecosto, entremeada, chouriço, linguiça, arroz de feijão, batata frita, molho especial, pão de alho', price:47000 },
  { id:'t6', cat:'Grelhada Mista', name:'Big Grelhada Mista', desc:'Picanha, frango inteiro, entrecosto, entremeada, linguiça, chouriço normal/caseiro, febras, pão de alho, batata frita, arroz de feijão, molho especial', price:90000 },
];

const CATEGORIES = ['Churrasco','Guarnições & Sopas','Fast Food & Snacks','Grelhada Mista'];
const WHATSAPP_NUMBER = '244925004040';

let activeCategory = 'Todos';
let cart = {}; // { itemId: qty }

const fmt = (kz) => kz.toLocaleString('pt-PT') + ' Kz';

// ---- Render tabs ----
function renderTabs(){
  const tabsEl = document.getElementById('menuTabs');
  const all = ['Todos', ...CATEGORIES];
  tabsEl.innerHTML = all.map(cat =>
    `<button class="menu-tab ${cat===activeCategory?'active':''}" data-cat="${cat}">${cat}</button>`
  ).join('');
  tabsEl.querySelectorAll('.menu-tab').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      activeCategory = btn.dataset.cat;
      renderTabs();
      renderMenu();
    });
  });
}

// ---- Render menu grid ----
function renderMenu(){
  const grid = document.getElementById('menuGrid');
  const catsToShow = activeCategory==='Todos' ? CATEGORIES : [activeCategory];
  let html = '';
  catsToShow.forEach(cat=>{
    html += `<div class="category-banner">${cat}</div>`;
    MENU.filter(i=>i.cat===cat).forEach(item=>{
      const qty = cart[item.id] || 0;
      html += `
        <div class="menu-card" data-id="${item.id}">
          <div class="menu-card-top">
            <span class="menu-card-name">${item.name}</span>
            <span class="menu-card-price">${fmt(item.price)}</span>
          </div>
          ${item.desc ? `<p class="menu-card-desc">${item.desc}</p>` : ''}
          <div class="menu-card-actions">
            <div class="qty-control">
              <button class="qty-minus" aria-label="Diminuir">−</button>
              <span class="qty-value">${qty}</span>
              <button class="qty-plus" aria-label="Aumentar">+</button>
            </div>
            <button class="add-btn">Adicionar</button>
          </div>
        </div>`;
    });
  });
  grid.innerHTML = html;

  grid.querySelectorAll('.menu-card').forEach(card=>{
    const id = card.dataset.id;
    card.querySelector('.qty-plus').addEventListener('click', ()=> updateQty(id, 1));
    card.querySelector('.qty-minus').addEventListener('click', ()=> updateQty(id, -1));
    card.querySelector('.add-btn').addEventListener('click', (e)=>{
      updateQty(id, 1);
      e.target.classList.add('added');
      setTimeout(()=>e.target.classList.remove('added'), 350);
    });
  });
}

function updateQty(id, delta){
  const current = cart[id] || 0;
  const next = Math.max(0, current + delta);
  if(next===0){ delete cart[id]; } else { cart[id] = next; }
  renderMenu();
  renderCart();
}

// ---- Cart ----
function renderCart(){
  const itemsEl = document.getElementById('cartItems');
  const emptyEl = document.getElementById('cartEmpty');
  const totalEl = document.getElementById('cartTotal');
  const countEl = document.getElementById('cartCount');

  const entries = Object.entries(cart);
  countEl.textContent = entries.reduce((sum,[,q])=>sum+q,0);

  if(entries.length===0){
    itemsEl.innerHTML = '';
    itemsEl.appendChild(emptyEl);
    totalEl.textContent = fmt(0);
    return;
  }

  let total = 0;
  itemsEl.innerHTML = entries.map(([id,qty])=>{
    const item = MENU.find(i=>i.id===id);
    const lineTotal = item.price * qty;
    total += lineTotal;
    return `
      <div class="cart-line" data-id="${id}">
        <div>
          <div class="cart-line-name">${qty}× ${item.name}</div>
          <div class="cart-line-price">${fmt(lineTotal)}</div>
          <button class="cart-line-remove">Remover</button>
        </div>
      </div>`;
  }).join('');
  totalEl.textContent = fmt(total);

  itemsEl.querySelectorAll('.cart-line-remove').forEach(btn=>{
    btn.addEventListener('click', (e)=>{
      const id = e.target.closest('.cart-line').dataset.id;
      delete cart[id];
      renderMenu();
      renderCart();
    });
  });
}

// ---- Drawer open/close ----
const drawer = document.getElementById('cartDrawer');
const overlay = document.getElementById('cartOverlay');

function openCart(){
  drawer.classList.add('open');
  overlay.classList.add('open');
  drawer.setAttribute('aria-hidden','false');
}
function closeCart(){
  drawer.classList.remove('open');
  overlay.classList.remove('open');
  drawer.setAttribute('aria-hidden','true');
}

document.getElementById('cartToggle').addEventListener('click', openCart);
document.getElementById('cartClose').addEventListener('click', closeCart);
overlay.addEventListener('click', closeCart);

// ---- Checkout via WhatsApp ----
document.getElementById('checkoutBtn').addEventListener('click', ()=>{
  const entries = Object.entries(cart);
  if(entries.length===0){
    alert('O carrinho está vazio. Adicione um item antes de finalizar.');
    return;
  }
  let total = 0;
  let lines = entries.map(([id,qty])=>{
    const item = MENU.find(i=>i.id===id);
    total += item.price*qty;
    return `• ${qty}× ${item.name} — ${fmt(item.price*qty)}`;
  });
  const message =
`Olá VanilC! Gostaria de fazer o seguinte pedido:\n\n` +
lines.join('\n') +
`\n\nTotal: ${fmt(total)}\n\nPor favor confirmem disponibilidade e tempo de entrega/levantamento. Obrigado!`;

  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  window.open(url, '_blank');
});

// ---- Init ----
renderTabs();
renderMenu();
renderCart();
