// ============================================
// FIREBASE SETUP
// ============================================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { getFirestore, doc, getDoc, setDoc, collection, onSnapshot, updateDoc, deleteDoc, query, orderBy } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";

const app = initializeApp(window.firebaseConfig);
const db  = getFirestore(app);

// ============================================
// ADMIN PANEL — CONSTANTS
// ============================================
const ADMIN_PASSWORD = 'pritam100';
const STORAGE_KEY = 'instaseel_orders';
const AUTH_KEY = 'instaseel_admin_auth';
const PRICES_KEY = 'instaseel_prices';

const STATUS_LIST = ['pending', 'processing', 'completed', 'cancelled'];

const SERVICE_NAMES = [
  'Followers', 'Likes', 'Views', 'Comments', 'Shares',
  'Saves', 'Story Views', 'Insights / Visits', 'Live Viewers', 'Trending Package'
];

// Default prices structure (mirrors script.js SERVICES)
const DEFAULT_SERVICES = [
  {
    id: 'followers', name: 'Followers', emoji: '👥',
    types: [
      { id: 'basic', name: 'Basic', price: 169 },
      { id: 'popular', name: 'Most Popular', price: 189 },
      { id: 'premium', name: 'Premium', price: 229 },
      { id: 'ultra', name: 'Ultra Premium', price: 249 },
    ]
  },
  {
    id: 'likes', name: 'Likes', emoji: '❤️',
    types: [
      { id: 'basic', name: 'Basic', price: 49 },
      { id: 'popular', name: 'Most Popular', price: 59 },
      { id: 'premium', name: 'Premium', price: 69 },
      { id: 'ultra', name: 'Ultra Premium', price: 79 },
    ]
  },
  {
    id: 'views', name: 'Views', emoji: '👁️',
    types: [
      { id: 'basic', name: 'Basic', price: 9 },
      { id: 'popular', name: 'Most Popular', price: 12 },
      { id: 'premium', name: 'Premium', price: 15 },
      { id: 'ultra', name: 'Ultra Premium', price: 29 },
    ]
  },
  {
    id: 'comments', name: 'Comments', emoji: '💬',
    types: [
      { id: 'random', name: 'Random Comments', price: 149 },
      { id: 'custom', name: 'Custom Comments', price: 199 },
    ]
  },
  {
    id: 'shares', name: 'Shares', emoji: '🔄',
    types: [
      { id: 'basic', name: 'Basic', price: 19 },
      { id: 'premium', name: 'Premium', price: 25 },
    ]
  },
  {
    id: 'saves', name: 'Saves', emoji: '🔖',
    types: [
      { id: 'basic', name: 'Basic', price: 39 },
      { id: 'premium', name: 'Premium', price: 59 },
    ]
  },
  {
    id: 'story-views', name: 'Story Views', emoji: '👀',
    types: [
      { id: 'basic', name: 'Basic', price: 49 },
      { id: 'premium', name: 'Premium', price: 59 },
    ]
  },
  {
    id: 'insights', name: 'Insights / Visits', emoji: '📊',
    types: [
      { id: 'basic', name: 'Basic', price: 25 },
      { id: 'premium', name: 'Premium', price: 29 },
    ]
  },
  {
    id: 'live-viewers', name: 'Live Viewers', emoji: '🔴',
    types: [
      { id: 'basic', name: 'Basic (30 min)', price: 1399 },
      { id: 'premium', name: 'Premium (60 min)', price: 3499 },
    ]
  },
  {
    id: 'trending', name: 'Trending Package', emoji: '🔥',
    types: [
      { id: 'starter', name: 'Starter Pack', price: 1999 },
      { id: 'viral', name: 'Viral Pack', price: 3999 },
      { id: 'mega', name: 'Mega Pack', price: 5499 },
    ]
  },
];

// ============================================
// DOM
// ============================================
const $ = s => document.querySelector(s);
const $$ = s => document.querySelectorAll(s);

// ============================================
// INIT
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  // Check existing session
  if (sessionStorage.getItem(AUTH_KEY) === 'true') {
    showDashboard();
  }

  bindLogin();
  bindDashboard();
  populateServiceFilter();
  bindTabs();
  bindPricing();
});

let ordersUnsubscribe = null;
let allOrders = [];

// ============================================
// LOGIN
// ============================================
function bindLogin() {
  const form = $('#login-form');
  const pwInput = $('#login-password');
  const errorEl = $('#login-error');
  const card = $('.login-card');

  // Toggle password visibility
  $('#toggle-pw').addEventListener('click', () => {
    const isPassword = pwInput.type === 'password';
    pwInput.type = isPassword ? 'text' : 'password';
    $('#eye-open').style.display = isPassword ? 'none' : 'block';
    $('#eye-closed').style.display = isPassword ? 'block' : 'none';
  });

  form.addEventListener('submit', e => {
    e.preventDefault();
    const pw = pwInput.value.trim();

    if (pw === ADMIN_PASSWORD) {
      sessionStorage.setItem(AUTH_KEY, 'true');
      showDashboard();
    } else {
      errorEl.textContent = '❌ Incorrect password. Try again.';
      card.classList.add('shake');
      setTimeout(() => card.classList.remove('shake'), 500);
      pwInput.value = '';
      pwInput.focus();
    }
  });
}

function showDashboard() {
  $('#login-screen').style.display = 'none';
  $('#dashboard').style.display = 'block';
  initRealtimeOrders();
  renderPricingPanel();
}

function initRealtimeOrders() {
  const q = query(collection(db, "orders"), orderBy("date", "desc"));
  ordersUnsubscribe = onSnapshot(q, (snapshot) => {
    allOrders = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    renderOrders();
  });
}

// ============================================
// TAB SWITCHING
// ============================================
function bindTabs() {
  $$('.admin-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      $$('.admin-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const tabName = tab.dataset.tab;
      $$('.tab-content').forEach(c => c.classList.remove('active'));
      const target = document.getElementById('tab-content-' + tabName);
      if (target) target.classList.add('active');
    });
  });
}

// ============================================
// DASHBOARD BINDINGS
// ============================================
function bindDashboard() {
  // Logout
  $('#logout-btn').addEventListener('click', () => {
    sessionStorage.removeItem(AUTH_KEY);
    location.reload();
  });

  // Filters
  $('#filter-status').addEventListener('change', renderOrders);
  $('#filter-service').addEventListener('change', renderOrders);

  // Export
  $('#export-btn').addEventListener('click', exportOrders);

  // Clear all (Careful with Firebase, usually we delete one by one or use a function)
  $('#clear-btn').addEventListener('click', async () => {
    if (confirm('⚠️ Are you sure you want to delete ALL orders? This cannot be undone.')) {
      adminToast('Deleting all orders...');
      for (const order of allOrders) {
        await deleteDoc(doc(db, "orders", order.id));
      }
      adminToast('All orders cleared');
    }
  });

  // Modal close
  $('#modal-close').addEventListener('click', closeModal);
  $('#modal-overlay').addEventListener('click', e => {
    if (e.target === $('#modal-overlay')) closeModal();
  });
}

function populateServiceFilter() {
  const sel = $('#filter-service');
  SERVICE_NAMES.forEach(name => {
    const o = document.createElement('option');
    o.value = name;
    o.textContent = name;
    sel.appendChild(o);
  });
}

// ============================================
// LOAD & RENDER ORDERS
// ============================================
function renderOrders() {
  const orders = allOrders;
  const statusFilter = $('#filter-status').value;
  const serviceFilter = $('#filter-service').value;

  let filtered = orders;
  if (statusFilter !== 'all') filtered = filtered.filter(o => o.status === statusFilter);
  if (serviceFilter !== 'all') filtered = filtered.filter(o => o.service === serviceFilter);

  const tbody = $('#orders-tbody');
  const cardsEl = $('#orders-cards');
  const emptyEl = $('#orders-empty');
  const tableEl = $('#orders-table');

  if (filtered.length === 0) {
    emptyEl.style.display = 'block';
    tableEl.style.display = 'none';
    cardsEl.innerHTML = '';
    cardsEl.style.display = 'none';
  } else {
    emptyEl.style.display = 'none';
    tableEl.style.display = '';
    cardsEl.style.display = '';

    // Desktop table
    tbody.innerHTML = filtered.map(o => `
      <tr>
        <td><strong>#${o.id.substring(0, 5)}</strong></td>
        <td>${formatDate(o.date)}</td>
        <td><strong>${o.service}</strong></td>
        <td>${o.type}</td>
        <td><span class="order-link" title="${escHtml(o.link)}">${escHtml(o.link)}</span></td>
        <td><strong>${Number(o.quantity).toLocaleString('en-IN')}</strong></td>
        <td><strong style="color:var(--green)">${o.price}</strong></td>
        <td><span class="status-badge status-${o.status}">${o.status}</span></td>
        <td>
          <div class="act-btns">
            <button class="act-btn act-view" onclick="viewOrder('${o.id}')" title="View">👁</button>
            <button class="act-btn act-status" onclick="cycleStatus('${o.id}')" title="Change Status">✔</button>
            <button class="act-btn act-delete" onclick="deleteOrder('${o.id}')" title="Delete">✕</button>
          </div>
        </td>
      </tr>
    `).join('');

    // Mobile cards
    cardsEl.innerHTML = filtered.map(o => `
      <div class="order-mcard">
        <div class="mc-head">
          <span class="mc-id">#${o.id.substring(0, 5)}</span>
          <span class="status-badge status-${o.status}">${o.status}</span>
        </div>
        <div class="mc-body">
          <div class="mc-field"><span>Service</span><strong>${o.service}</strong></div>
          <div class="mc-field"><span>Type</span><strong>${o.type}</strong></div>
          <div class="mc-field"><span>Quantity</span><strong>${Number(o.quantity).toLocaleString('en-IN')}</strong></div>
          <div class="mc-field"><span>Price</span><strong class="mc-price">${o.price}</strong></div>
          <div class="mc-field" style="grid-column:1/-1"><span>Link</span><strong class="mc-link">${escHtml(o.link)}</strong></div>
          <div class="mc-field"><span>Date</span><strong>${formatDate(o.date)}</strong></div>
          <div class="mc-field"><span>Delivery</span><strong>${o.delivery || '—'}</strong></div>
        </div>
        <div class="mc-actions">
          <button class="mc-abtn a-view" onclick="viewOrder('${o.id}')">👁 View</button>
          <button class="mc-abtn a-status" onclick="cycleStatus('${o.id}')">✔ Status</button>
          <button class="mc-abtn a-delete" onclick="deleteOrder('${o.id}')">✕ Delete</button>
        </div>
      </div>
    `).join('');
  }

  updateStats();
}

// ============================================
// STATS
// ============================================
function updateStats() {
  const orders = allOrders;
  const today = new Date().toDateString();

  const totalRevenue = orders.reduce((sum, o) => {
    const num = parseFloat(o.price.replace(/[₹,]/g, '')) || 0;
    return sum + num;
  }, 0);

  const todayOrders = orders.filter(o => new Date(o.date).toDateString() === today);
  const pending = orders.filter(o => o.status === 'pending');

  $('#stat-total').textContent = orders.length;
  $('#stat-revenue').textContent = `₹${Math.round(totalRevenue).toLocaleString('en-IN')}`;
  $('#stat-today').textContent = todayOrders.length;
  $('#stat-pending').textContent = pending.length;
}

// ============================================
// ORDER ACTIONS
// ============================================
window.viewOrder = function(id) {
  const o = allOrders.find(x => x.id === id);
  if (!o) return;

  $('#modal-title').textContent = `Order #${o.id.substring(0, 5)}`;

  $('#modal-body').innerHTML = `
    <div class="detail-row"><span class="detail-label">Order ID</span><span class="detail-value">#${o.id}</span></div>
    <div class="detail-row"><span class="detail-label">Date</span><span class="detail-value">${formatDate(o.date)}</span></div>
    <div class="detail-row"><span class="detail-label">Service</span><span class="detail-value">${o.service}</span></div>
    <div class="detail-row"><span class="detail-label">Type</span><span class="detail-value">${o.type}</span></div>
    <div class="detail-row"><span class="detail-label">Link</span><span class="detail-value" style="color:var(--blue)">${escHtml(o.link)}</span></div>
    <div class="detail-row"><span class="detail-label">Quantity</span><span class="detail-value">${Number(o.quantity).toLocaleString('en-IN')}</span></div>
    <div class="detail-row"><span class="detail-label">Rate</span><span class="detail-value">${o.rate || '—'}</span></div>
    <div class="detail-row"><span class="detail-label">Total Price</span><span class="detail-value" style="color:var(--green);font-size:1.1rem">${o.price}</span></div>
    <div class="detail-row"><span class="detail-label">Delivery</span><span class="detail-value">${o.delivery || '—'}</span></div>
    <div class="detail-row"><span class="detail-label">Status</span><span class="detail-value"><span class="status-badge status-${o.status}">${o.status}</span></span></div>
  `;

  $('#modal-footer').innerHTML = `
    <button class="mbtn-cancel" onclick="closeModal()">Close</button>
    <button class="mbtn-primary" onclick="cycleStatus('${o.id}'); closeModal();">Change Status</button>
  `;

  $('#modal-overlay').style.display = 'flex';
};

window.cycleStatus = async function(id) {
  const o = allOrders.find(x => x.id === id);
  if (!o) return;

  const currentIdx = STATUS_LIST.indexOf(o.status);
  const nextIdx = (currentIdx + 1) % STATUS_LIST.length;
  const newStatus = STATUS_LIST[nextIdx];

  try {
    await updateDoc(doc(db, "orders", id), { status: newStatus });
    adminToast(`Order #${o.id.substring(0, 5)} → ${newStatus}`);
  } catch (err) {
    console.error("Error updated status:", err);
  }
};

window.deleteOrder = async function(id) {
  if (!confirm(`Delete order?`)) return;
  try {
    await deleteDoc(doc(db, "orders", id));
    adminToast(`Order deleted`);
  } catch (err) {
    console.error("Error deleting order:", err);
  }
};

function closeModal() {
  $('#modal-overlay').style.display = 'none';
}

// ============================================
// EXPORT
// ============================================
function exportOrders() {
  const orders = allOrders;
  if (orders.length === 0) return adminToast('No orders to export');

  const headers = ['ID', 'Date', 'Service', 'Type', 'Link', 'Quantity', 'Rate', 'Price', 'Delivery', 'Status'];
  const rows = orders.map(o => [
    o.id,
    formatDate(o.date),
    o.service,
    o.type,
    o.link,
    o.quantity,
    o.rate || '',
    o.price,
    o.delivery || '',
    o.status
  ]);

  let csv = headers.join(',') + '\n';
  rows.forEach(r => {
    csv += r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',') + '\n';
  });

  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `instaseel_orders_${new Date().toISOString().split('T')[0]}.csv`;
  a.click();
  URL.revokeObjectURL(url);
  adminToast('Orders exported as CSV');
}

// ============================================
// PRICING MANAGEMENT
// ============================================
async function getSavedPrices() {
  try {
    const docRef = doc(db, "config", "prices");
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data().data;
    }
    return null;
  } catch (err) {
    console.error("Error getting prices:", err);
    return null;
  }
}

async function getCurrentPrices() {
  const saved = await getSavedPrices();
  if (!saved) return JSON.parse(JSON.stringify(DEFAULT_SERVICES));

  // Merge saved prices into default structure
  return DEFAULT_SERVICES.map(svc => {
    const savedSvc = saved.find(s => s.id === svc.id);
    return {
      ...svc,
      types: svc.types.map(t => {
        if (savedSvc) {
          const savedType = savedSvc.types.find(st => st.id === t.id);
          if (savedType) return { ...t, price: savedType.price };
        }
        return { ...t };
      })
    };
  });
}

function bindPricing() {
  $('#pm-save-btn').addEventListener('click', savePrices);
  $('#pm-reset-btn').addEventListener('click', async () => {
    if (confirm('⚠️ Reset all prices to defaults? This cannot be undone.')) {
      try {
        await deleteDoc(doc(db, "config", "prices"));
        adminToast('✅ Prices reset to defaults');
        renderPricingPanel();
      } catch (err) {
        console.error("Error resetting prices:", err);
      }
    }
  });
}

async function renderPricingPanel() {
  const services = await getCurrentPrices();
  const container = $('#pm-services-list');

  container.innerHTML = services.map((svc, si) => `
    <div class="pm-svc-card" id="pm-svc-${svc.id}">
      <button class="pm-svc-header" data-svc-idx="${si}" onclick="togglePmAccordion(this)">
        <div class="pm-svc-left">
          <span class="pm-svc-emoji">${svc.emoji}</span>
          <span class="pm-svc-name">${svc.name}</span>
          <span class="pm-svc-count">${svc.types.length} types</span>
        </div>
        <svg class="pm-svc-arrow" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M6 9l6 6 6-6"/></svg>
      </button>
      <div class="pm-svc-body">
        <div class="pm-types-grid">
          ${svc.types.map(t => `
            <div class="pm-type-row">
              <div class="pm-type-info">
                <span class="pm-type-name">${t.name}</span>
              </div>
              <div class="pm-price-input-wrap">
                <span class="pm-currency">₹</span>
                <input type="number" class="pm-price-input" 
                  data-svc="${svc.id}" data-type="${t.id}" 
                  value="${t.price}" min="1" step="1" />
                <span class="pm-per">/1K</span>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `).join('');
}

window.togglePmAccordion = function(btn) {
  const card = btn.closest('.pm-svc-card');
  const isOpen = card.classList.contains('open');
  // Close all first
  $$('.pm-svc-card').forEach(c => c.classList.remove('open'));
  if (!isOpen) card.classList.add('open');
};

async function savePrices() {
  const inputs = $$('.pm-price-input');
  const services = await getCurrentPrices();

  inputs.forEach(input => {
    const svcId = input.dataset.svc;
    const typeId = input.dataset.type;
    const newPrice = parseInt(input.value) || 0;

    const svc = services.find(s => s.id === svcId);
    if (svc) {
      const t = svc.types.find(ty => ty.id === typeId);
      if (t) t.price = newPrice;
    }
  });

  // Save just the id+types with prices
  const toSave = services.map(s => ({
    id: s.id,
    types: s.types.map(t => ({ id: t.id, price: t.price }))
  }));

  try {
    await setDoc(doc(db, "config", "prices"), { data: toSave });
    adminToast('✅ All prices saved! Changes are live on the main site.');
  } catch (err) {
    console.error("Error saving prices:", err);
  }
}

// ============================================
// HELPERS
// ============================================
function formatDate(dateStr) {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) +
      ' ' + d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  } catch {
    return dateStr || '—';
  }
}

function escHtml(str) {
  const div = document.createElement('div');
  div.textContent = str || '';
  return div.innerHTML;
}

function adminToast(msg) {
  const old = document.querySelector('.admin-toast');
  if (old) old.remove();

  const el = document.createElement('div');
  el.className = 'admin-toast';
  el.textContent = msg;
  document.body.appendChild(el);
  requestAnimationFrame(() => el.classList.add('show'));
  setTimeout(() => {
    el.classList.remove('show');
    setTimeout(() => el.remove(), 300);
  }, 3000);
}
