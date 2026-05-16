// ============================================
// FIREBASE SETUP
// ============================================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { getFirestore, doc, getDoc, setDoc, collection, addDoc, onSnapshot, updateDoc, deleteDoc, query, orderBy } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";

// Global helpers
const $ = s => document.querySelector(s);
const $$ = s => document.querySelectorAll(s);

let db;
try {
  if (!window.firebaseConfig) {
    throw new Error("Firebase Config missing! Check firebase-config.js");
  }
  const app = initializeApp(window.firebaseConfig);
  db = getFirestore(app);
} catch (e) {
  console.error("Firebase Init Error:", e);
  alert("Critical Error: Firebase failed to initialize. " + e.message);
}

// ============================================
// ADMIN PANEL — CONSTANTS
// ============================================
const ADMIN_PASSWORD = 'pritam100';
const AUTH_KEY = 'instaseel_admin_auth';
const STATUS_LIST = ['pending', 'processing', 'completed', 'cancelled'];
const SERVICE_NAMES = ['Followers', 'Likes', 'Views', 'Comments', 'Shares', 'Saves', 'Story Views', 'Insights / Visits', 'Live Viewers', 'Trending Package'];

const DEFAULT_SERVICES_INDIA = [
  { id: 'followers', name: 'Followers', emoji: '👥', types: [{ id: 'basic', name: 'Basic (No Refill)', price: 169 }, { id: 'popular', name: 'Most Popular (1 Month Refill)', price: 189 }, { id: 'premium', name: 'Premium (3 Months Refill)', price: 229 }, { id: 'ultra', name: 'Ultra Premium (1 Year Refill)', price: 249 }] },
  { id: 'likes', name: 'Likes', emoji: '❤️', types: [{ id: 'basic', name: 'Basic (No Refill)', price: 49 }, { id: 'popular', name: 'Most Popular (1 Month Refill)', price: 59 }, { id: 'premium', name: 'Premium (3 Months Refill)', price: 69 }, { id: 'ultra', name: 'Ultra Premium (1 Year Refill)', price: 79 }] },
  { id: 'views', name: 'Views', emoji: '👁️', types: [{ id: 'basic', name: 'Basic (No Refill)', price: 9 }, { id: 'popular', name: 'Most Popular (1 Month Refill)', price: 12 }, { id: 'premium', name: 'Premium (3 Months Refill)', price: 15 }, { id: 'ultra', name: 'Ultra Premium (1 Year Refill)', price: 29 }] },
  { id: 'comments', name: 'Comments', emoji: '💬', types: [{ id: 'random', name: 'Random Comments', price: 149 }, { id: 'custom', name: 'Custom Comments', price: 199 }] },
  { id: 'shares', name: 'Shares', emoji: '🔄', types: [{ id: 'basic', name: 'Basic (No Refill)', price: 19 }, { id: 'premium', name: 'Premium (3 Months Refill)', price: 25 }] },
  { id: 'saves', name: 'Saves', emoji: '🔖', types: [{ id: 'basic', name: 'Basic (No Refill)', price: 39 }, { id: 'premium', name: 'Premium (3 Months Refill)', price: 59 }] },
  { id: 'story-views', name: 'Story Views', emoji: '👀', types: [{ id: 'basic', name: 'Basic (No Refill)', price: 49 }, { id: 'premium', name: 'Premium (3 Months Refill)', price: 59 }] },
  { id: 'insights', name: 'Insights / Visits', emoji: '📊', types: [{ id: 'basic', name: 'Basic (No Refill)', price: 25 }, { id: 'premium', name: 'Premium (3 Months Refill)', price: 29 }] },
  { id: 'live-viewers', name: 'Live Viewers', emoji: '🔴', types: [{ id: 'basic', name: 'Basic (30 min)', price: 1399 }, { id: 'premium', name: 'Premium (60 min)', price: 3499 }] },
  { id: 'trending', name: 'Trending Package', emoji: '🔥', types: [{ id: 'starter', name: 'Starter Pack', price: 1999 }, { id: 'viral', name: 'Viral Pack', price: 3999 }, { id: 'mega', name: 'Mega Pack', price: 5499 }] },
];

const DEFAULT_SERVICES_USA = [
  { id: 'followers', name: 'Followers', emoji: '👥', types: [{ id: 'basic', name: 'Basic', price: 3.99 }, { id: 'popular', name: 'Most Popular', price: 5.99 }, { id: 'premium', name: 'Premium', price: 7.99 }, { id: 'ultra', name: 'Ultra Premium', price: 9.99 }] },
  { id: 'likes', name: 'Likes', emoji: '❤️', types: [{ id: 'basic', name: 'Basic', price: 1.99 }, { id: 'popular', name: 'Most Popular', price: 2.99 }, { id: 'premium', name: 'Premium', price: 3.99 }, { id: 'ultra', name: 'Ultra Premium', price: 4.99 }] },
  { id: 'views', name: 'Views', emoji: '👁️', types: [{ id: 'basic', name: 'Basic', price: 0.99 }, { id: 'popular', name: 'Most Popular', price: 1.49 }, { id: 'premium', name: 'Premium', price: 1.99 }, { id: 'ultra', name: 'Ultra Premium', price: 3.99 }] },
  { id: 'comments', name: 'Comments', emoji: '💬', types: [{ id: 'random', name: 'Random Comments', price: 6.99 }, { id: 'custom', name: 'Custom Comments', price: 9.99 }] },
  { id: 'shares', name: 'Shares', emoji: '🔄', types: [{ id: 'basic', name: 'Basic', price: 1.49 }, { id: 'premium', name: 'Premium', price: 2.49 }] },
  { id: 'saves', name: 'Saves', emoji: '🔖', types: [{ id: 'basic', name: 'Basic', price: 2.99 }, { id: 'premium', name: 'Premium', price: 4.99 }] },
  { id: 'story-views', name: 'Story Views', emoji: '👀', types: [{ id: 'basic', name: 'Basic', price: 2.99 }, { id: 'premium', name: 'Premium', price: 4.99 }] },
  { id: 'insights', name: 'Insights / Visits', emoji: '📊', types: [{ id: 'basic', name: 'Basic', price: 1.99 }, { id: 'premium', name: 'Premium', price: 2.99 }] },
  { id: 'live-viewers', name: 'Live Viewers', emoji: '🔴', types: [{ id: 'basic', name: '30 Minutes', price: 24.99 }, { id: 'premium', name: '60 Minutes', price: 49.99 }] },
  { id: 'trending', name: 'Trending Package', emoji: '🔥', types: [{ id: 'starter', name: 'Starter Pack', price: 19.99 }, { id: 'viral', name: 'Viral Pack', price: 39.99 }, { id: 'mega', name: 'Mega Pack', price: 59.99 }] },
];

// ============================================
// STATE
// ============================================
let currentRegion = 'india';
let allOrders = [];
let ordersUnsubscribe = null;

// ============================================
// INIT
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  if (sessionStorage.getItem(AUTH_KEY) === 'true') showDashboard();
  bindLogin();
  bindDashboard();
  populateServiceFilter();
  bindTabs();
  bindPricing();
  bindRegionSwitcher();
});

function bindRegionSwitcher() {
  $$('.region-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const region = btn.dataset.region;
      if (region === currentRegion) return;
      currentRegion = region;
      $$('.region-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const isUSA = currentRegion === 'usa';
      $('#pm-region-label').textContent = isUSA ? 'USA' : 'India';
      $('#pm-currency-label').textContent = isUSA ? '$' : '₹';
      $('#pm-site-label').textContent = isUSA ? 'USA' : 'main';
      $('#view-site-link').href = isUSA ? 'usa.html' : 'index.html';
      if (ordersUnsubscribe) ordersUnsubscribe();
      initRealtimeOrders();
      renderPricingPanel();
    });
  });
}

function bindLogin() {
  const form = $('#login-form');
  const pwInput = $('#login-password');
  $('#toggle-pw').addEventListener('click', () => {
    const isPassword = pwInput.type === 'password';
    pwInput.type = isPassword ? 'text' : 'password';
    $('#eye-open').style.display = isPassword ? 'none' : 'block';
    $('#eye-closed').style.display = isPassword ? 'block' : 'none';
  });
  form.addEventListener('submit', e => {
    e.preventDefault();
    if (pwInput.value.trim() === ADMIN_PASSWORD) {
      sessionStorage.setItem(AUTH_KEY, 'true');
      showDashboard();
    } else {
      $('#login-error').textContent = '❌ Incorrect password.';
      $('.login-card').classList.add('shake');
      setTimeout(() => $('.login-card').classList.remove('shake'), 500);
      pwInput.value = '';
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
  if (!db) return;
  const coll = currentRegion === 'usa' ? "orders_usa" : "orders";
  const q = query(collection(db, coll), orderBy("date", "desc"));
  ordersUnsubscribe = onSnapshot(q, (snapshot) => {
    allOrders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    renderOrders();
  }, (err) => {
    console.error("Snapshot error:", err);
    if (err.message.includes('permission')) {
      alert("Permission Error: Please update your Firestore Rules as instructed.");
    }
  });
}

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

function bindDashboard() {
  $('#logout-btn').addEventListener('click', () => { sessionStorage.removeItem(AUTH_KEY); location.reload(); });
  $('#filter-status').addEventListener('change', renderOrders);
  $('#filter-service').addEventListener('change', renderOrders);
  $('#export-btn').addEventListener('click', exportOrders);
  $('#clear-btn').addEventListener('click', async () => {
    const coll = currentRegion === 'usa' ? "orders_usa" : "orders";
    if (confirm(`⚠️ Delete ALL ${currentRegion.toUpperCase()} orders?`)) {
      for (const order of allOrders) await deleteDoc(doc(db, coll, order.id));
      adminToast('All orders cleared');
    }
  });
  $('#modal-close').addEventListener('click', closeModal);
  $('#modal-overlay').addEventListener('click', e => { if (e.target === $('#modal-overlay')) closeModal(); });

  $('#add-order-btn').addEventListener('click', openCreateModal);
  $('#create-modal-close').addEventListener('click', closeCreateModal);
  $('#create-modal-cancel').addEventListener('click', closeCreateModal);
  $('#admin-create-order-form').addEventListener('submit', onAdminCreateSubmit);
  $('#ac-service').addEventListener('change', updateAcTiers);
  $('#ac-type').addEventListener('change', updateAcPrice);
  $('#ac-qty').addEventListener('input', () => { updateAcPrice(); updateAcAfter(); });
  $('#ac-before').addEventListener('input', updateAcAfter);
}

function openCreateModal() {
  const isUSA = currentRegion === 'usa';
  $$('.region-label').forEach(el => el.textContent = isUSA ? 'USA' : 'India');
  $$('.currency-label').forEach(el => el.textContent = isUSA ? '$' : '₹');
  populateAcServices();
  $('#create-order-overlay').style.display = 'flex';
}

function closeCreateModal() { $('#create-order-overlay').style.display = 'none'; $('#admin-create-order-form').reset(); }

async function populateAcServices() {
  const services = await getCurrentPrices();
  const sel = $('#ac-service');
  sel.innerHTML = '<option value="" disabled selected>Select Service</option>' + services.map(s => `<option value="${s.id}">${s.emoji} ${s.name}</option>`).join('');
}

async function updateAcTiers() {
  const services = await getCurrentPrices();
  const svc = services.find(s => s.id === $('#ac-service').value);
  const sel = $('#ac-type');
  if (svc) sel.innerHTML = '<option value="" disabled selected>Select Tier</option>' + svc.types.map(t => `<option value="${t.id}">${t.name}</option>`).join('');
}

async function updateAcPrice() {
  const services = await getCurrentPrices();
  const svc = services.find(s => s.id === $('#ac-service').value);
  if (svc) {
    const type = svc.types.find(t => t.id === $('#ac-type').value);
    if (type) {
      const qty = parseInt($('#ac-qty').value) || 0;
      const price = (type.price / 1000) * qty;
      $('#ac-price').value = currentRegion === 'usa' ? price.toFixed(2) : Math.round(price);
    }
  }
}

function updateAcAfter() {
  const before = parseInt($('#ac-before').value) || 0;
  const qty = parseInt($('#ac-qty').value) || 0;
  $('#ac-after').value = before + qty;
}

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

async function onAdminCreateSubmit(e) {
  e.preventDefault();
  if (!db) return alert("Database not ready!");
  
  const isUSA = currentRegion === 'usa';
  const coll = isUSA ? "orders_usa" : "orders";
  const symbol = isUSA ? '$' : '₹';
  
  try {
    const services = await getCurrentPrices();
    const svcId = $('#ac-service').value;
    const typeId = $('#ac-type').value;
    
    if (!svcId || !typeId) throw new Error("Please select both Service and Tier");

    const svc = services.find(s => s.id === svcId);
    const type = svc.types.find(t => t.id === typeId);

    const link = $('#ac-link').value.trim();
    const username = parseUsername(link);
    const priceVal = $('#ac-price').value.trim();
    const fmtPrice = priceVal.includes(symbol) ? priceVal : `${symbol}${priceVal}`;

    const data = {
      date: new Date().toISOString(),
      service: svc.name,
      type: type.name,
      link: link,
      username: username,
      quantity: Number($('#ac-qty').value) || 1000,
      before_count: Number($('#ac-before').value) || 0,
      after_count: Number($('#ac-after').value) || 0,
      price: fmtPrice,
      status: 'pending'
    };

    console.log("Submitting order to:", coll, data);
    await addDoc(collection(db, coll), data);
    adminToast('✅ Order created successfully');
    closeCreateModal();
  } catch (err) { 
    console.error("Create Order Error:", err);
    alert("Error creating order: " + err.message);
  }
}

function populateServiceFilter() {
  const sel = $('#filter-service');
  SERVICE_NAMES.forEach(name => {
    const o = document.createElement('option');
    o.value = name; o.textContent = name; sel.appendChild(o);
  });
}

function renderOrders() {
  const statusFilter = $('#filter-status').value;
  const serviceFilter = $('#filter-service').value;
  let filtered = allOrders;
  if (statusFilter !== 'all') filtered = filtered.filter(o => o.status === statusFilter);
  if (serviceFilter !== 'all') filtered = filtered.filter(o => o.service === serviceFilter);

  const tableEl = $('#orders-table');
  const tbody = $('#orders-tbody');
  const thead = tableEl.querySelector('thead');

  if (filtered.length === 0) {
    $('#orders-empty').style.display = 'block'; tableEl.style.display = 'none';
  } else {
    $('#orders-empty').style.display = 'none'; tableEl.style.display = '';
    thead.innerHTML = `<tr><th>#</th><th>Date</th><th>User</th><th>Service</th><th>Link</th><th>Before</th><th>After</th><th>Qty</th><th>Price</th><th>Status</th><th>Actions</th></tr>`;
    tbody.innerHTML = filtered.map(o => `
      <tr>
        <td><strong>#${o.id.substring(0, 5)}</strong></td>
        <td>${formatDate(o.date)}</td>
        <td><strong>@${o.username || '—'}</strong></td>
        <td><strong>${o.service}</strong><br><small>${o.type}</small></td>
        <td><span class="order-link" title="${escHtml(o.link)}">${escHtml(o.link)}</span></td>
        <td>${o.before_count ?? '—'}</td>
        <td>${o.after_count ?? '—'}</td>
        <td><strong>${Number(o.quantity).toLocaleString()}</strong></td>
        <td><strong style="color:var(--green)">${o.price}</strong></td>
        <td><span class="status-badge status-${o.status}">${o.status}</span></td>
        <td><div class="act-btns">
          <button class="act-btn act-view" onclick="viewOrder('${o.id}')">👁</button>
          <button class="act-btn act-status" onclick="cycleStatus('${o.id}')">✔</button>
          <button class="act-btn act-delete" onclick="deleteOrder('${o.id}')">✕</button>
        </div></td>
      </tr>
    `).join('');
  }
  updateStats();
}

function updateStats() {
  const totalRevenue = allOrders.reduce((sum, o) => sum + (parseFloat(o.price.replace(/[₹$,]/g, '')) || 0), 0);
  const symbol = currentRegion === 'usa' ? '$' : '₹';
  $('#stat-total').textContent = allOrders.length;
  $('#stat-revenue').textContent = symbol + (currentRegion === 'usa' ? totalRevenue.toFixed(2) : Math.round(totalRevenue).toLocaleString('en-IN'));
  $('#stat-today').textContent = allOrders.filter(o => new Date(o.date).toDateString() === new Date().toDateString()).length;
  $('#stat-pending').textContent = allOrders.filter(o => o.status === 'pending').length;
}

window.viewOrder = function(id) {
  const o = allOrders.find(x => x.id === id);
  if (!o) return;
  $('#modal-title').textContent = `Order #${o.id.substring(0, 5)}`;
  $('#modal-body').innerHTML = `
    <div class="detail-row"><span class="detail-label">Order ID</span><span class="detail-value">#${o.id}</span></div>
    <div class="detail-row"><span class="detail-label">Date</span><span class="detail-value">${formatDate(o.date)}</span></div>
    <div class="detail-row"><span class="detail-label">User</span><span class="detail-value">@${o.username || '—'}</span></div>
    <div class="detail-row"><span class="detail-label">Service</span><span class="detail-value">${o.service} (${o.type})</span></div>
    <div class="detail-row"><span class="detail-label">Link</span><span class="detail-value" style="color:var(--blue)">${escHtml(o.link)}</span></div>
    <div class="detail-row"><span class="detail-label">Growth</span><span class="detail-value">${o.before_count ?? '—'} → ${o.after_count ?? '—'}</span></div>
    <div class="detail-row"><span class="detail-label">Quantity</span><span class="detail-value">${Number(o.quantity).toLocaleString()}</span></div>
    <div class="detail-row"><span class="detail-label">Total Price</span><span class="detail-value" style="color:var(--green)">${o.price}</span></div>
    <div class="detail-row"><span class="detail-label">Status</span><span class="detail-value"><span class="status-badge status-${o.status}">${o.status}</span></span></div>
  `;
  $('#modal-footer').innerHTML = `<button class="mbtn-cancel" onclick="closeModal()">Close</button><button class="mbtn-primary" onclick="cycleStatus('${o.id}'); closeModal();">Change Status</button>`;
  $('#modal-overlay').style.display = 'flex';
};

window.cycleStatus = async function(id) {
  if (!db) return;
  const coll = currentRegion === 'usa' ? "orders_usa" : "orders";
  const o = allOrders.find(x => x.id === id);
  if (!o) return;
  const newStatus = STATUS_LIST[(STATUS_LIST.indexOf(o.status) + 1) % STATUS_LIST.length];
  try { await updateDoc(doc(db, coll, id), { status: newStatus }); adminToast(`Status updated`); } catch (err) {}
};

window.deleteOrder = async function(id) {
  if (!db) return;
  const coll = currentRegion === 'usa' ? "orders_usa" : "orders";
  if (!confirm(`Delete order?`)) return;
  try { await deleteDoc(doc(db, coll, id)); adminToast(`Order deleted`); } catch (err) {}
};

function closeModal() { $('#modal-overlay').style.display = 'none'; }

function exportOrders() {
  const headers = ['ID', 'Date', 'User', 'Service', 'Type', 'Link', 'Before', 'After', 'Quantity', 'Price', 'Status'];
  const rows = allOrders.map(o => [o.id, formatDate(o.date), o.username || '', o.service, o.type, o.link, o.before_count || '', o.after_count || '', o.quantity, o.price, o.status]);
  let csv = headers.join(',') + '\n' + rows.map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');
  const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' })); a.download = `orders_${currentRegion}.csv`; a.click();
}

async function getCurrentPrices() {
  if (!db) return currentRegion === 'usa' ? DEFAULT_SERVICES_USA : DEFAULT_SERVICES_INDIA;
  const priceDoc = currentRegion === 'usa' ? "prices_usa" : "prices";
  const defaultServices = currentRegion === 'usa' ? DEFAULT_SERVICES_USA : DEFAULT_SERVICES_INDIA;
  try {
    const docSnap = await getDoc(doc(db, "config", priceDoc));
    if (docSnap.exists()) {
      const saved = docSnap.data().data;
      return defaultServices.map(svc => {
        const savedSvc = saved.find(s => s.id === svc.id);
        if (savedSvc) svc.types.forEach(t => { const st = savedSvc.types.find(ty => ty.id === t.id); if (st) t.price = st.price; });
        return svc;
      });
    }
  } catch (err) {}
  return JSON.parse(JSON.stringify(defaultServices));
}

function bindPricing() {
  $('#pm-save-btn').addEventListener('click', savePrices);
  $('#pm-reset-btn').addEventListener('click', async () => {
    const priceDoc = currentRegion === 'usa' ? "prices_usa" : "prices";
    if (confirm(`Reset prices?`)) { try { await deleteDoc(doc(db, "config", priceDoc)); adminToast('Reset to defaults'); renderPricingPanel(); } catch (err) {} }
  });
}

async function renderPricingPanel() {
  const services = await getCurrentPrices();
  const symbol = currentRegion === 'usa' ? '$' : '₹';
  $('#pm-services-list').innerHTML = services.map(svc => `
    <div class="pm-svc-card">
      <button class="pm-svc-header" onclick="togglePmAccordion(this)">
        <div class="pm-svc-left"><span class="pm-svc-emoji">${svc.emoji}</span><span class="pm-svc-name">${svc.name}</span></div>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M6 9l6 6 6-6"/></svg>
      </button>
      <div class="pm-svc-body"><div class="pm-types-grid">${svc.types.map(t => `
        <div class="pm-type-row">
          <span class="pm-type-name">${t.name}</span>
          <div class="pm-price-input-wrap"><span>${symbol}</span><input type="number" class="pm-price-input" data-svc="${svc.id}" data-type="${t.id}" value="${t.price}" step="0.01" /><span>/1K</span></div>
        </div>`).join('')}</div></div>
    </div>`).join('');
}

window.togglePmAccordion = function(btn) {
  const card = btn.closest('.pm-svc-card'); const isOpen = card.classList.contains('open');
  $$('.pm-svc-card').forEach(c => c.classList.remove('open')); if (!isOpen) card.classList.add('open');
};

async function savePrices() {
  if (!db) return;
  const priceDoc = currentRegion === 'usa' ? "prices_usa" : "prices";
  const services = await getCurrentPrices();
  $$('.pm-price-input').forEach(input => {
    const svc = services.find(s => s.id === input.dataset.svc);
    if (svc) { const t = svc.types.find(ty => ty.id === input.dataset.type); if (t) t.price = parseFloat(input.value) || 0; }
  });
  try {
    await setDoc(doc(db, "config", priceDoc), { data: services.map(s => ({ id: s.id, types: s.types.map(t => ({ id: t.id, price: t.price })) })) });
    adminToast('✅ Prices saved');
  } catch (err) {}
}

function formatDate(dateStr) {
  try { const d = new Date(dateStr); return d.toLocaleDateString(currentRegion === 'usa' ? 'en-US' : 'en-IN', { day: '2-digit', month: 'short' }) + ' ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); } catch { return dateStr || '—'; }
}

function escHtml(str) { const div = document.createElement('div'); div.textContent = str || ''; return div.innerHTML; }

function adminToast(msg) {
  const old = document.querySelector('.admin-toast'); if (old) old.remove();
  const el = document.createElement('div'); el.className = 'admin-toast show'; el.textContent = msg; document.body.appendChild(el);
  setTimeout(() => { el.classList.remove('show'); setTimeout(() => el.remove(), 300); }, 3000);
}
