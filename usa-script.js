// ============================================
// FIREBASE SETUP
// ============================================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { getFirestore, doc, getDoc, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";

// Global helpers
const $ = s => document.querySelector(s);
const $$ = s => document.querySelectorAll(s);

let db;
try {
  const app = initializeApp(window.firebaseConfig);
  db = getFirestore(app);
} catch (e) {
  console.error("Firebase Init Error:", e);
}

// ============================================
// SERVICE DATA — USD PRICING
// ============================================
const SERVICES = [
  {
    id: 'followers', name: 'Followers', emoji: '👥', delivery: '0–60 min', linkType: 'profile',
    placeholder: 'https://instagram.com/username', label: 'Instagram Profile Link',
    types: [
      { id: 'basic', name: 'Basic', desc: 'Mixed quality', price: 3.99, pop: false },
      { id: 'popular', name: 'Most Popular', desc: 'HQ + Refill', price: 5.99, pop: true },
      { id: 'premium', name: 'Premium', desc: 'Top quality', price: 7.99, pop: false },
      { id: 'ultra', name: 'Ultra Premium', desc: 'Indian/Real profiles', price: 9.99, pop: false },
    ]
  },
  {
    id: 'likes', name: 'Likes', emoji: '❤️', delivery: '0–15 min', linkType: 'post',
    placeholder: 'https://instagram.com/p/...', label: 'Post or Reel Link',
    types: [
      { id: 'basic', name: 'Basic', desc: 'Standard likes', price: 1.99, pop: false },
      { id: 'popular', name: 'Most Popular', desc: 'HQ likes', price: 2.99, pop: true },
      { id: 'premium', name: 'Premium', desc: 'Real Indian likes', price: 3.99, pop: false },
      { id: 'ultra', name: 'Ultra Premium', desc: 'Top tier instant', price: 4.99, pop: false },
    ]
  },
  {
    id: 'views', name: 'Views', emoji: '👁️', delivery: '0–10 min', linkType: 'post',
    placeholder: 'https://instagram.com/reel/...', label: 'Reel or Video Link',
    types: [
      { id: 'basic', name: 'Basic', desc: 'Standard views', price: 0.99, pop: false },
      { id: 'popular', name: 'Most Popular', desc: 'High retention', price: 1.49, pop: true },
      { id: 'premium', name: 'Premium', desc: 'Premium quality', price: 1.99, pop: false },
      { id: 'ultra', name: 'Ultra Premium', desc: 'Highest quality + reach', price: 3.99, pop: false },
    ]
  },
  {
    id: 'comments', name: 'Comments', emoji: '💬', delivery: '0–60 min', linkType: 'post',
    placeholder: 'https://instagram.com/p/...', label: 'Post Link',
    types: [
      { id: 'random', name: 'Random', desc: 'Pre-written comments', price: 6.99, pop: true },
      { id: 'custom', name: 'Custom', desc: 'User custom text', price: 9.99, pop: false },
    ]
  },
  {
    id: 'shares', name: 'Shares', emoji: '🔄', delivery: '0–30 min', linkType: 'post',
    placeholder: 'https://instagram.com/p/...', label: 'Post or Reel Link',
    types: [
      { id: 'basic', name: 'Basic', desc: 'Standard shares', price: 1.49, pop: true },
      { id: 'premium', name: 'Premium', desc: 'High quality', price: 2.49, pop: false },
    ]
  },
  {
    id: 'saves', name: 'Saves', emoji: '🔖', delivery: '0–30 min', linkType: 'post',
    placeholder: 'https://instagram.com/p/...', label: 'Post or Reel Link',
    types: [
      { id: 'basic', name: 'Basic', desc: 'Standard saves', price: 2.99, pop: true },
      { id: 'premium', name: 'Premium', desc: 'High quality', price: 4.99, pop: false },
    ]
  },
  {
    id: 'story-views', name: 'Story Views', emoji: '👀', delivery: '0–30 min', linkType: 'profile',
    placeholder: 'https://instagram.com/username', label: 'Instagram Profile Link',
    types: [
      { id: 'basic', name: 'Basic', desc: 'Standard views', price: 2.99, pop: true },
      { id: 'premium', name: 'Premium', desc: 'High quality', price: 4.99, pop: false },
    ]
  },
  {
    id: 'insights', name: 'Insights / Visits', emoji: '📊', delivery: '0–30 min', linkType: 'post',
    placeholder: 'https://instagram.com/p/...', label: 'Post or Reel Link',
    types: [
      { id: 'basic', name: 'Basic', desc: 'Standard insights', price: 1.99, pop: true },
      { id: 'premium', name: 'Premium', desc: 'High quality', price: 2.99, pop: false },
    ]
  },
  {
    id: 'live-viewers', name: 'Live Viewers', emoji: '🔴', delivery: '0–10 min', linkType: 'profile',
    placeholder: 'https://instagram.com/username', label: 'Instagram Username',
    types: [
      { id: 'basic', name: '30 Minutes', desc: 'Stable viewers for 30 min', price: 24.99, pop: true },
      { id: 'premium', name: '60 Minutes', desc: 'Stable viewers for 60 min', price: 49.99, pop: false },
    ]
  },
  {
    id: 'trending', name: 'Trending Package', emoji: '🔥', delivery: '0–120 min', linkType: 'post',
    placeholder: 'https://instagram.com/p/...', label: 'Post or Reel Link',
    types: [
      { id: 'starter', name: 'Starter Pack', desc: 'Likes + Views + Saves', price: 19.99, pop: true },
      { id: 'viral', name: 'Viral Pack', desc: 'Boost to Explore Page', price: 39.99, pop: false },
      { id: 'mega', name: 'Mega Pack', desc: 'Max reach and engagement', price: 59.99, pop: false },
    ]
  }
];

// ============================================
// STATE
// ============================================
let state = { category: null, type: null, link: '', quantity: 1000 };

// ============================================
// INIT
// ============================================
function init() {
  buildServiceCards();
  buildCategoryDropdown();
  bindEvents();
  initReveals();
  loadAdminPrices();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// ============================================
// HELPERS
// ============================================
function parseUsername(val) {
  if (!val) return "";
  const s = val.trim();
  if (s.includes('instagram.com/')) {
    const parts = s.split('instagram.com/')[1].split('/');
    let u = parts[0];
    if (u === 'p' || u === 'reel' || u === 'stories') return ""; 
    return u.replace('@', '');
  }
  return s.replace('@', '').split(' ')[0];
}

async function loadAdminPrices() {
  if (!db) return;
  try {
    const docSnap = await getDoc(doc(db, "config", "prices_usa"));
    if (docSnap.exists()) {
      const saved = docSnap.data().data;
      saved.forEach(savedSvc => {
        const svc = SERVICES.find(s => s.id === savedSvc.id);
        if (svc) savedSvc.types.forEach(st => {
          const t = svc.types.find(ty => ty.id === st.id);
          if (t) t.price = st.price;
        });
      });
      buildServiceCards();
      buildCategoryDropdown();
      calcPrice();
    }
  } catch (err) { console.error("Error loading prices:", err); }
}

function buildServiceCards() {
  const grid = $('#services-grid');
  if (!grid) return;
  
  grid.innerHTML = SERVICES.map(s => `
    <div class="svc-card" data-sid="${s.id}">
      <span class="svc-emoji">${s.emoji}</span>
      <div class="svc-name">${s.name}</div>
      <div class="svc-tag">From $${Math.min(...s.types.map(t => t.price))}/1K</div>
    </div>
  `).join('');

  $$('.svc-card').forEach(c => c.addEventListener('click', () => {
    const catSelect = $('#service-category');
    if (catSelect) {
      catSelect.value = c.dataset.sid;
      catSelect.dispatchEvent(new Event('change'));
      const orderSec = $('#order-section');
      if (orderSec) orderSec.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }));
}

function buildCategoryDropdown() {
  const catSelect = $('#service-category');
  if (!catSelect) return;
  
  const currentVal = catSelect.value;
  catSelect.innerHTML = '<option value="" disabled selected>Choose a service…</option>';
  SERVICES.forEach(s => {
    const o = document.createElement('option');
    o.value = s.id;
    o.textContent = `${s.emoji} ${s.name}`;
    catSelect.appendChild(o);
  });
  if (currentVal) catSelect.value = currentVal;
}

// ============================================
// EVENTS
// ============================================
function bindEvents() {
  const catSelect = $('#service-category');
  if (catSelect) catSelect.addEventListener('change', onCategoryPick);

  const minus = $('#qty-minus');
  const plus = $('#qty-plus');
  if (minus) minus.addEventListener('click', () => adjustQty(-100));
  if (plus) plus.addEventListener('click', () => adjustQty(+100));

  const qtyInput = $('#quantity');
  if (qtyInput) {
    qtyInput.addEventListener('input', () => {
      state.quantity = parseInt(qtyInput.value) || 0;
      syncPresets();
      calcPrice();
    });
  }

  $$('.preset').forEach(b => b.addEventListener('click', () => {
    const v = parseInt(b.dataset.v);
    if (qtyInput) qtyInput.value = v;
    state.quantity = v;
    syncPresets();
    calcPrice();
  }));

  const linkInput = $('#insta-link');
  if (linkInput) {
    linkInput.addEventListener('input', () => {
      state.link = linkInput.value.trim();
      const u = parseUsername(state.link);
      const heading = $('#order-heading');
      if (heading) {
        if (u) heading.innerHTML = `<span style="color:var(--green)">@${u}</span> — Place Your Order`;
        else heading.textContent = "Place Your Order";
      }
      calcPrice();
    });
  }

  const orderForm = $('#order-form');
  if (orderForm) orderForm.addEventListener('submit', onSubmit);
}

function adjustQty(delta) {
  const qtyInput = $('#quantity');
  if (!qtyInput) return;
  const v = Math.max(10, (parseInt(qtyInput.value) || 0) + delta);
  qtyInput.value = v;
  state.quantity = v;
  syncPresets();
  calcPrice();
}

function onCategoryPick() {
  const catSelect = $('#service-category');
  const svc = SERVICES.find(s => s.id === catSelect.value);
  if (!svc) return;
  state.category = svc;
  state.type = null;

  const linkLabel = $('#link-label-text');
  if (linkLabel) linkLabel.textContent = svc.label;
  const linkInput = $('#insta-link');
  if (linkInput) linkInput.placeholder = svc.placeholder;

  const typeList = $('#type-list');
  if (typeList) {
    typeList.innerHTML = svc.types.map((t, i) => `
      <div class="type-card" data-ti="${i}">
        ${t.pop ? '<span class="tc-pop">Popular</span>' : ''}
        <div class="tc-radio"></div>
        <div class="tc-info">
          <div class="tc-name">${t.name}</div>
          <div class="tc-desc">${t.desc}</div>
        </div>
        <div class="tc-price">$${t.price}/1K</div>
      </div>
    `).join('');

    $$('.type-card').forEach(card => card.addEventListener('click', () => {
      $$('.type-card').forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      state.type = svc.types[parseInt(card.dataset.ti)];
      reveal('link');
      calcPrice();
    }));

    const pi = svc.types.findIndex(t => t.pop);
    if (pi >= 0) $$('.type-card')[pi].click();
    reveal('type');
  }
}

function reveal(step) {
  if (step === 'type') {
    const field = $('#field-type');
    if (field) field.classList.remove('is-hidden');
  }
  if (step === 'link') {
    ['#field-link', '#field-qty', '#summary', '#submit-btn'].forEach(f => {
      const el = $(f);
      if (el) el.classList.remove('is-hidden');
    });
  }
}

function calcPrice() {
  if (!state.category || !state.type) return;
  const qty = state.quantity || 0;
  const rate = state.type.price;
  const total = (rate / 1000) * qty;

  const s_svc = $('#s-service');
  const s_type = $('#s-type');
  const s_qty = $('#s-qty');
  const s_rate = $('#s-rate');
  const s_total = $('#s-total');
  const sub_price = $('#sub-price');

  if (s_svc) s_svc.textContent = state.category.name;
  if (s_type) s_type.textContent = state.type.name;
  if (s_qty) s_qty.textContent = qty.toLocaleString('en-US');
  if (s_rate) s_rate.textContent = `$${rate}/1000`;
  if (s_total) s_total.textContent = `$${total.toFixed(2)}`;
  if (sub_price) sub_price.textContent = `$${total.toFixed(2)}`;
}

async function onSubmit(e) {
  e.preventDefault();
  if (!state.link) return toast('Enter link');
  const qty = state.quantity;
  const rate = state.type.price;
  const totalNum = (rate / 1000) * qty;
  const total = `$${totalNum.toFixed(2)}`;

  if (db) {
    try {
      const data = {
        date: new Date().toISOString(),
        service: state.category.name,
        type: state.type.name,
        link: state.link,
        username: parseUsername(state.link),
        quantity: qty,
        price: total,
        status: 'pending'
      };
      await addDoc(collection(db, "orders_usa"), data);
    } catch (err) { console.error("Error saving:", err); }
  }

  const msg = `🔥 NEW USA ORDER
👤 User: @${parseUsername(state.link)}
📦 Service: ${state.category.name}
⭐ Tier: ${state.type.name}
🔗 Link: ${state.link}
📊 Qty: ${qty.toLocaleString('en-US')}
💰 Total: ${total}`;

  window.open(`https://t.me/velvettool?text=${encodeURIComponent(msg)}`, '_blank');
}

function syncPresets() {
  $$('.preset').forEach(b => b.classList.toggle('active', parseInt(b.dataset.v) === state.quantity));
}

function toast(m) {
  const el = document.createElement('div');
  el.className = 'toast show';
  el.textContent = m;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 3000);
}

function initReveals() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
  });
  // Removed .services from here to ensure they are visible immediately
  $$('.how, .pricing-highlight, .faq').forEach(el => { 
    el.classList.add('reveal'); 
    obs.observe(el); 
  });
}
