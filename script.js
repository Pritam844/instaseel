// ============================================
// FIREBASE SETUP
// ============================================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { getFirestore, doc, getDoc, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";

const app = initializeApp(window.firebaseConfig);
const db  = getFirestore(app);

// ============================================
// SERVICE DATA — LOW COMPETITIVE PRICING
// ============================================
const SERVICES = [
  {
    id: 'followers',
    name: 'Followers',
    emoji: '👥',
    desc: 'Real Instagram followers for your profile',
    delivery: '0–60 min',
    linkType: 'profile',
    placeholder: 'https://instagram.com/username',
    label: 'Instagram Profile Link',
    types: [
      { id: 'basic',   name: 'Basic',        desc: 'Mixed quality followers (No Refill)',            price: 169, pop: false },
      { id: 'popular', name: 'Most Popular',  desc: 'High quality profiles (1 Month Refill)', price: 189, pop: true  },
      { id: 'premium', name: 'Premium',       desc: 'Top quality profiles (3 Months Refill)',      price: 229, pop: false },
      { id: 'ultra',   name: 'Ultra Premium', desc: 'Highest quality Indian (1 Year Refill)',    price: 249, pop: false },
    ]
  },
  {
    id: 'likes',
    name: 'Likes',
    emoji: '❤️',
    desc: 'Instant likes on posts & reels',
    delivery: '0–15 min',
    linkType: 'post',
    placeholder: 'https://instagram.com/p/...',
    label: 'Post or Reel Link',
    types: [
      { id: 'basic',   name: 'Basic',        desc: 'Standard likes (No Refill)',          price: 49, pop: false },
      { id: 'popular', name: 'Most Popular',  desc: 'High quality likes (1 Month Refill)',      price: 59, pop: true  },
      { id: 'premium', name: 'Premium',       desc: 'Real Indian likes (3 Months Refill)',       price: 69, pop: false },
      { id: 'ultra',   name: 'Ultra Premium', desc: 'Top tier instant likes (1 Year Refill)',  price: 79, pop: false },
    ]
  },
  {
    id: 'views',
    name: 'Views',
    emoji: '👁️',
    desc: 'Boost views on reels & videos',
    delivery: '0–10 min',
    linkType: 'post',
    placeholder: 'https://instagram.com/reel/...',
    label: 'Reel or Video Link',
    types: [
      { id: 'basic',   name: 'Basic',        desc: 'Standard views (No Refill)',           price: 9,  pop: false },
      { id: 'popular', name: 'Most Popular',  desc: 'High retention views (1 Month Refill)',     price: 12, pop: true  },
      { id: 'premium', name: 'Premium',       desc: 'Premium quality views (3 Months Refill)',    price: 15, pop: false },
      { id: 'ultra',   name: 'Ultra Premium', desc: 'Highest quality + reach (1 Year Refill)',  price: 29, pop: false },
    ]
  },
  {
    id: 'comments',
    name: 'Comments',
    emoji: '💬',
    desc: 'Real comments on your posts',
    delivery: '0–60 min',
    linkType: 'post',
    placeholder: 'https://instagram.com/p/...',
    label: 'Post Link',
    types: [
      { id: 'random', name: 'Random Comments', desc: 'Pre-written relevant comments', price: 149, pop: true  },
      { id: 'custom', name: 'Custom Comments', desc: 'You provide the comment text',  price: 199, pop: false },
    ]
  },
  {
    id: 'shares',
    name: 'Shares',
    emoji: '🔄',
    desc: 'Increase shares to boost reach',
    delivery: '0–30 min',
    linkType: 'post',
    placeholder: 'https://instagram.com/p/...',
    label: 'Post or Reel Link',
    types: [
      { id: 'basic',   name: 'Basic',   desc: 'Standard shares (No Refill)',      price: 19, pop: true  },
      { id: 'premium', name: 'Premium', desc: 'High quality shares (3 Months Refill)',   price: 25, pop: false },
    ]
  },
  {
    id: 'saves',
    name: 'Saves',
    emoji: '🔖',
    desc: 'Get saves to boost post ranking',
    delivery: '0–30 min',
    linkType: 'post',
    placeholder: 'https://instagram.com/p/...',
    label: 'Post or Reel Link',
    types: [
      { id: 'basic',   name: 'Basic',   desc: 'Standard saves (No Refill)',       price: 39, pop: true  },
      { id: 'premium', name: 'Premium', desc: 'High quality saves (3 Months Refill)',    price: 59, pop: false },
    ]
  },
  {
    id: 'story-views',
    name: 'Story Views',
    emoji: '👀',
    desc: 'Boost your story views',
    delivery: '0–15 min',
    linkType: 'profile',
    placeholder: 'https://instagram.com/username',
    label: 'Instagram Profile Link',
    types: [
      { id: 'basic',   name: 'Basic',   desc: 'Standard story views (No Refill)',  price: 49, pop: true  },
      { id: 'premium', name: 'Premium', desc: 'High quality views (3 Months Refill)',    price: 59, pop: false },
    ]
  },
  {
    id: 'insights',
    name: 'Insights / Visits',
    emoji: '📊',
    desc: 'Boost profile visits & impressions',
    delivery: '0–60 min',
    linkType: 'profile',
    placeholder: 'https://instagram.com/username',
    label: 'Instagram Profile Link',
    types: [
      { id: 'basic',   name: 'Basic',   desc: 'Profile visits & impressions (No Refill)', price: 25, pop: true  },
      { id: 'premium', name: 'Premium', desc: 'High quality with reach (3 Months Refill)',      price: 29, pop: false },
    ]
  },
  {
    id: 'live-viewers',
    name: 'Live Viewers',
    emoji: '🔴',
    desc: 'Real-time viewers for your Live',
    delivery: 'Instant (during live)',
    linkType: 'profile',
    placeholder: 'https://instagram.com/username',
    label: 'Instagram Profile Link',
    types: [
      { id: 'basic',   name: 'Basic (30 min)',    desc: 'Standard live viewers', price: 1399, pop: true  },
      { id: 'premium', name: 'Premium (60 min)',   desc: 'Extended live viewers', price: 3499, pop: false },
    ]
  },
  {
    id: 'trending',
    name: 'Trending Package',
    emoji: '🔥',
    desc: 'Complete growth combo package',
    delivery: '1–24 hours',
    linkType: 'post',
    placeholder: 'https://instagram.com/p/...',
    label: 'Post or Reel Link',
    types: [
      { id: 'starter', name: 'Starter Pack', desc: 'Likes + Views + Shares combo',          price: 1999, pop: false },
      { id: 'viral',   name: 'Viral Pack',   desc: 'Full viral: likes+views+shares+saves',  price: 3999, pop: true  },
      { id: 'mega',    name: 'Mega Pack',     desc: 'Maximum exposure package',               price: 5499, pop: false },
    ]
  },
];

// ============================================
// STATE
// ============================================
let state = { category: null, type: null, link: '', quantity: 1000 };

// ============================================
// DOM
// ============================================
const $ = s => document.querySelector(s);
const $$ = s => document.querySelectorAll(s);

const catSelect  = $('#service-category');
const typeList   = $('#type-list');
const linkInput  = $('#insta-link');
const qtyInput   = $('#quantity');
const orderForm  = $('#order-form');
const stickyCta  = $('#sticky-cta');

// ============================================
// INIT
// ============================================
document.addEventListener('DOMContentLoaded', async () => {
  await loadAdminPrices();
  buildServiceCards();
  buildCategoryDropdown();
  bindEvents();
  initReveals();
  initSticky();
  initFAQ();
});

// ============================================
// LOAD ADMIN PRICES FROM FIRESTORE
// ============================================
async function loadAdminPrices() {
  try {
    const docRef = doc(db, "config", "prices");
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const saved = docSnap.data().data;
      if (!saved || !Array.isArray(saved)) return;

      saved.forEach(savedSvc => {
        const svc = SERVICES.find(s => s.id === savedSvc.id);
        if (!svc) return;
        savedSvc.types.forEach(savedType => {
          const t = svc.types.find(ty => ty.id === savedType.id);
          if (t) t.price = savedType.price;
        });
      });
    }
  } catch (err) {
    console.error("Error loading prices from Firestore:", err);
  }
}

// ============================================
// BUILD SERVICE CARDS
// ============================================
function buildServiceCards() {
  const grid = $('#services-grid');
  grid.innerHTML = SERVICES.map(s => `
    <div class="svc-card" data-sid="${s.id}" tabindex="0" role="button" aria-label="Select ${s.name}">
      <span class="svc-emoji">${s.emoji}</span>
      <div class="svc-name">${s.name}</div>
      <div class="svc-tag">From ₹${Math.min(...s.types.map(t => t.price))}/1K</div>
    </div>
  `).join('');

  // Stagger reveal
  const cards = grid.querySelectorAll('.svc-card');
  const obs = new IntersectionObserver(entries => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        setTimeout(() => e.target.classList.add('show'), i * 70);
        obs.unobserve(e.target);
      }
    });
  }, { threshold: .1 });
  cards.forEach(c => obs.observe(c));

  // Click → jump to order
  cards.forEach(c => c.addEventListener('click', () => {
    catSelect.value = c.dataset.sid;
    catSelect.dispatchEvent(new Event('change'));
    $('#order-section').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }));
}

// ============================================
// BUILD CATEGORY DROPDOWN
// ============================================
function buildCategoryDropdown() {
  SERVICES.forEach(s => {
    const o = document.createElement('option');
    o.value = s.id;
    o.textContent = `${s.emoji} ${s.name}`;
    catSelect.appendChild(o);
  });
}

// ============================================
// EVENTS
// ============================================
function bindEvents() {
  catSelect.addEventListener('change', onCategoryPick);

  $('#qty-minus').addEventListener('click', () => adjustQty(-100));
  $('#qty-plus').addEventListener('click', () => adjustQty(+100));

  qtyInput.addEventListener('input', () => {
    state.quantity = parseInt(qtyInput.value) || 0;
    syncPresets();
    calcPrice();
  });

  $$('.preset').forEach(b => b.addEventListener('click', () => {
    const v = parseInt(b.dataset.v);
    qtyInput.value = v;
    state.quantity = v;
    syncPresets();
    calcPrice();
  }));

  linkInput.addEventListener('input', () => {
    state.link = linkInput.value.trim();
    calcPrice();
  });

  orderForm.addEventListener('submit', onSubmit);
}

function adjustQty(delta) {
  const v = Math.max(10, (parseInt(qtyInput.value) || 0) + delta);
  qtyInput.value = v;
  state.quantity = v;
  syncPresets();
  calcPrice();
}

// ============================================
// CATEGORY PICK
// ============================================
function onCategoryPick() {
  const svc = SERVICES.find(s => s.id === catSelect.value);
  if (!svc) return;

  state.category = svc;
  state.type = null;

  // Update link label
  $('#link-label-text').textContent = svc.label;
  linkInput.placeholder = svc.placeholder;

  // Build type cards
  typeList.innerHTML = svc.types.map((t, i) => `
    <div class="type-card" data-ti="${i}" tabindex="0" role="radio" aria-checked="false">
      ${t.pop ? '<span class="tc-pop">Popular</span>' : ''}
      <div class="tc-radio"></div>
      <div class="tc-info">
        <div class="tc-name">${t.name}</div>
        <div class="tc-desc">${t.desc}</div>
      </div>
      <div class="tc-price">₹${t.price}/1K</div>
    </div>
  `).join('');

  typeList.querySelectorAll('.type-card').forEach(card => {
    card.addEventListener('click', () => {
      typeList.querySelectorAll('.type-card').forEach(c => {
        c.classList.remove('active');
        c.setAttribute('aria-checked', 'false');
      });
      card.classList.add('active');
      card.setAttribute('aria-checked', 'true');
      state.type = svc.types[parseInt(card.dataset.ti)];
      reveal('link');
      calcPrice();
    });
  });

  // Auto-select popular
  const pi = svc.types.findIndex(t => t.pop);
  if (pi >= 0) typeList.querySelectorAll('.type-card')[pi].click();

  reveal('type');
}

// ============================================
// PROGRESSIVE REVEAL
// ============================================
function reveal(step) {
  if (step === 'type') $('#field-type').classList.remove('is-hidden');
  if (step === 'link') {
    $('#field-link').classList.remove('is-hidden');
    $('#field-qty').classList.remove('is-hidden');
    $('#summary').classList.remove('is-hidden');
    $('#submit-btn').classList.remove('is-hidden');
  }
}

// ============================================
// PRICE CALCULATION
// ============================================
function calcPrice() {
  if (!state.category || !state.type) return;

  const qty = Math.max(0, state.quantity || 0);
  const rate = state.type.price;
  const total = (rate / 1000) * qty;
  const fmt = fmtINR(total);

  $('#s-service').textContent = state.category.name;
  $('#s-type').textContent = state.type.name;
  $('#s-qty').textContent = qty.toLocaleString('en-IN');
  $('#s-rate').textContent = `₹${rate}/1000`;
  $('#s-total').textContent = fmt;
  $('#sub-price').textContent = fmt;
  $('#s-delivery-text').textContent = `Estimated: ${state.category.delivery}`;
}

function fmtINR(n) {
  if (n > 0 && n < 1) return `₹${n.toFixed(2)}`;
  return `₹${Math.round(n).toLocaleString('en-IN')}`;
}

// ============================================
// SYNC PRESET BUTTONS
// ============================================
function syncPresets() {
  $$('.preset').forEach(b => b.classList.toggle('active', parseInt(b.dataset.v) === state.quantity));
}

// ============================================
// SUBMIT → TELEGRAM
// ============================================
async function onSubmit(e) {
  e.preventDefault();

  if (!state.category)    return toast('Please select a service');
  if (!state.type)        return toast('Please select a service type');
  if (!state.link)        return toast('Please enter your Instagram link/username'), linkInput.focus();
  if (!state.quantity || state.quantity < 10) return toast('Minimum quantity is 10'), qtyInput.focus();

  const qty  = state.quantity;
  const rate = state.type.price;
  const totalNum = (rate / 1000) * qty;
  const total = fmtINR(totalNum);

  // Save order to Firestore
  try {
    const orderData = {
      date: new Date().toISOString(),
      service: state.category.name,
      type: state.type.name,
      link: state.link,
      quantity: qty,
      rate: `₹${rate}/1K`,
      price: total,
      delivery: state.category.delivery,
      status: 'pending'
    };
    await addDoc(collection(db, "orders"), orderData);
  } catch (err) {
    console.error("Error saving order to Firestore:", err);
  }

  const msg = `🔥 New Order
📦 Service: ${state.category.name}
⭐ Type: ${state.type.name}
🔗 Link: ${state.link}
📊 Quantity: ${qty.toLocaleString('en-IN')}
💰 Rate: ₹${rate}/1K
💵 Price: ${total}
⏱ Delivery: ${state.category.delivery}`;

  window.open(`https://t.me/velvettool?text=${encodeURIComponent(msg)}`, '_blank');
  toast('✅ Opening Telegram…');
}

// ============================================
// TOAST
// ============================================
function toast(msg) {
  const old = document.querySelector('.toast');
  if (old) old.remove();

  const el = document.createElement('div');
  el.className = 'toast';
  el.textContent = msg;
  document.body.appendChild(el);
  requestAnimationFrame(() => el.classList.add('show'));
  setTimeout(() => { el.classList.remove('show'); setTimeout(() => el.remove(), 300); }, 3000);
}

// ============================================
// SCROLL REVEALS
// ============================================
function initReveals() {
  const els = $$('.how, .pricing-highlight, .faq');
  els.forEach(el => el.classList.add('reveal'));

  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
    });
  }, { threshold: .12 });

  els.forEach(el => obs.observe(el));
}

// ============================================
// STICKY CTA
// ============================================
function initSticky() {
  const hero = $('#hero-section');
  const obs = new IntersectionObserver(([e]) => {
    stickyCta.classList.toggle('visible', !e.isIntersecting);
  }, { threshold: 0 });
  obs.observe(hero);
}

// ============================================
// FAQ
// ============================================
function initFAQ() {
  $$('.faq-q').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.parentElement;
      const open = item.classList.contains('open');
      $$('.faq-item').forEach(i => i.classList.remove('open'));
      if (!open) item.classList.add('open');
    });
  });
}
