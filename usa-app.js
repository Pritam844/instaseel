// ============================================
// INSTASEEL USA — FULL REACT APP
// ============================================
const { useState, useEffect, useMemo } = React;

// ── SERVICES & PRICES (USD) ──
const SERVICES = [
  {
    id:'followers', name:'Followers', emoji:'👥',
    desc:'Real Instagram followers', delivery:'0–60 min', linkType:'profile',
    types:[
      {id:'basic',name:'Basic',desc:'Mixed quality (No Refill)',price:4.99,pop:false},
      {id:'standard',name:'Standard',desc:'High quality (1 Month Refill)',price:7.99,pop:false},
      {id:'premium',name:'Premium',desc:'Top quality (3 Months Refill)',price:11.99,pop:true},
      {id:'ultra',name:'Ultra',desc:'Highest quality (1 Year Refill)',price:15.99,pop:false},
    ]
  },
  {
    id:'likes', name:'Likes', emoji:'❤️',
    desc:'Instant likes on posts & reels', delivery:'0–15 min', linkType:'post',
    types:[
      {id:'basic',name:'Basic',desc:'Standard likes (No Refill)',price:1.99,pop:false},
      {id:'standard',name:'Standard',desc:'High quality (1 Month Refill)',price:2.99,pop:false},
      {id:'premium',name:'Premium',desc:'Real engagement (3 Months Refill)',price:3.99,pop:true},
      {id:'ultra',name:'Ultra',desc:'Top tier instant (1 Year Refill)',price:4.99,pop:false},
    ]
  },
  {
    id:'views', name:'Views', emoji:'👁️',
    desc:'Boost views on reels & videos', delivery:'0–10 min', linkType:'post',
    types:[
      {id:'basic',name:'Basic',desc:'Standard views (No Refill)',price:0.99,pop:false},
      {id:'standard',name:'Standard',desc:'High retention (1 Month Refill)',price:1.49,pop:false},
      {id:'premium',name:'Premium',desc:'Premium quality (3 Months Refill)',price:1.99,pop:true},
      {id:'ultra',name:'Ultra',desc:'Highest quality + reach (1 Year Refill)',price:2.99,pop:false},
    ]
  },
  {
    id:'comments', name:'Comments', emoji:'💬',
    desc:'Real comments on your posts', delivery:'0–60 min', linkType:'post',
    types:[
      {id:'random',name:'Random Comments',desc:'Pre-written relevant comments',price:8.99,pop:true},
      {id:'custom',name:'Custom Comments',desc:'You provide the comment text',price:11.99,pop:false},
    ]
  },
  {
    id:'shares', name:'Shares', emoji:'🔄',
    desc:'Increase shares to boost reach', delivery:'0–30 min', linkType:'post',
    types:[
      {id:'basic',name:'Basic',desc:'Standard shares (No Refill)',price:1.49,pop:true},
      {id:'premium',name:'Premium',desc:'High quality (3 Months Refill)',price:2.49,pop:false},
    ]
  },
  {
    id:'saves', name:'Saves', emoji:'🔖',
    desc:'Get saves to boost post ranking', delivery:'0–30 min', linkType:'post',
    types:[
      {id:'basic',name:'Basic',desc:'Standard saves (No Refill)',price:2.49,pop:true},
      {id:'premium',name:'Premium',desc:'High quality (3 Months Refill)',price:3.99,pop:false},
    ]
  },
];

const QTY_OPTIONS = [1000,2000,3000,5000,10000,15000,20000,25000,30000,50000];
const ADMIN_PASS = 'instaseel@123';

// ── USERNAME PARSING ──
function parseUsername(input) {
  if (!input || !input.trim()) return null;
  const s = input.trim();
  // Reject post/reel links
  if (/instagram\.com\/(p|reel|stories)\//i.test(s)) return null;
  // Extract from URL
  const urlMatch = s.match(/instagram\.com\/([^/?#]+)/i);
  if (urlMatch) {
    const u = urlMatch[1].replace(/^@/, '');
    return u && u !== '' ? u : null;
  }
  // Plain @username or username
  const clean = s.replace(/^@/, '').replace(/\s+/g, '');
  return clean.length > 0 ? clean : null;
}

function fmtUSD(n) {
  return '$' + n.toFixed(2);
}

function fmtQty(n) {
  if (n >= 1000) return (n/1000) + 'K';
  return n.toString();
}

function getOrders() {
  try { return JSON.parse(localStorage.getItem('instaseel_usa_orders') || '[]'); }
  catch { return []; }
}
function saveOrders(orders) {
  localStorage.setItem('instaseel_usa_orders', JSON.stringify(orders));
}

// ── TOAST ──
function showToast(msg) {
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
// HEADER
// ============================================
function Header({ page, setPage }) {
  return (
    <header className="usa-header">
      <div className="usa-header-inner">
        <div className="usa-logo">
          <span>⚡</span>
          <span>Insta<span className="accent">Seel</span></span>
          <span style={{fontSize:'.7rem',background:'var(--green-light)',color:'var(--green-dark)',padding:'2px 8px',borderRadius:'50px',fontWeight:700,marginLeft:4}}>USA</span>
        </div>
        <nav className="usa-nav">
          <button className={page==='order'?'active':''} onClick={()=>setPage('order')}>Order</button>
          <button className={page==='admin'?'active':''} onClick={()=>setPage('admin')}>Admin</button>
        </nav>
      </div>
    </header>
  );
}

// ============================================
// HERO
// ============================================
function Hero() {
  return (
    <section className="usa-hero">
      <div className="usa-hero-inner">
        <div className="hero-badge"><span className="badge-dot"></span> #1 Instagram Growth Service 🇺🇸</div>
        <h1>Grow Your Instagram<br/><span className="hl">Faster & Cheaper</span></h1>
        <p>Real followers, likes, views & more — starting at just <strong>$0.99/1K</strong>. No password needed. Delivered in minutes.</p>
        <div className="trust-row">
          <div className="trust-pill"><span>🔒</span> No Password</div>
          <div className="trust-pill"><span>⚡</span> Instant Delivery</div>
          <div className="trust-pill"><span>✅</span> Safe & Secure</div>
          <div className="trust-pill"><span>💵</span> Pay in USD</div>
        </div>
      </div>
    </section>
  );
}

// ============================================
// ORDER PAGE
// ============================================
function OrderPage() {
  const [linkInput, setLinkInput] = useState('');
  const [currentFollowers, setCurrentFollowers] = useState('');
  const [selectedSvc, setSelectedSvc] = useState(null);
  const [selectedType, setSelectedType] = useState(null);
  const [quantity, setQuantity] = useState(1000);

  const username = useMemo(() => parseUsername(linkInput), [linkInput]);
  const isPostLink = useMemo(() => /instagram\.com\/(p|reel|stories)\//i.test(linkInput.trim()), [linkInput]);

  // Auto-select popular type when service changes
  useEffect(() => {
    if (selectedSvc) {
      const pop = selectedSvc.types.find(t => t.pop) || selectedSvc.types[0];
      setSelectedType(pop);
    } else {
      setSelectedType(null);
    }
  }, [selectedSvc]);

  const rate = selectedType ? selectedType.price : 0;
  const total = (rate / 1000) * quantity;
  const currentCount = parseInt(currentFollowers) || 0;
  const afterCount = currentCount + quantity;

  function handleSubmit() {
    if (!username) return showToast('Please enter a valid Instagram profile link');
    if (!selectedSvc) return showToast('Please select a service');
    if (!selectedType) return showToast('Please select a quality tier');

    const order = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2,6),
      date: new Date().toISOString(),
      username: username,
      service: selectedSvc.name,
      type: selectedType.name,
      quantity: quantity,
      currentFollowers: currentCount,
      afterFollowers: afterCount,
      rate: fmtUSD(rate) + '/1K',
      total: fmtUSD(total),
      totalNum: total,
      status: 'pending',
      delivery: selectedSvc.delivery,
    };

    const orders = getOrders();
    orders.unshift(order);
    saveOrders(orders);

    showToast('✅ Order placed successfully!');
    setLinkInput(''); setCurrentFollowers(''); setSelectedSvc(null); setSelectedType(null); setQuantity(1000);
  }

  return (
    <div>
      <Hero />

      {username && (
        <div className="username-display">
          <h2><span className="at">@{username}</span> — Place your order</h2>
        </div>
      )}

      <div className="order-wrap">
        <div className="order-card">
          <h2>Place Your Order</h2>
          <p className="sub">Takes less than 30 seconds • No sign-up needed</p>

          {/* Instagram Link */}
          <div className="field">
            <label className="field-label">🔗 Instagram Profile Link or Username</label>
            <input className="field-input" type="text" placeholder="https://instagram.com/username or @username"
              value={linkInput} onChange={e => setLinkInput(e.target.value)} />
            {isPostLink && <span className="field-hint" style={{color:'#ef4444',fontWeight:600}}>⚠️ Please enter a profile link, not a post/reel link</span>}
            {!isPostLink && <span className="field-hint">We never ask for your password 🔒</span>}
          </div>

          {/* Current Followers */}
          {username && (
            <div className="field">
              <label className="field-label">📊 Current {selectedSvc ? selectedSvc.name : 'Followers'} Count</label>
              <input className="field-input" type="number" placeholder="e.g. 5000" min="0"
                value={currentFollowers} onChange={e => setCurrentFollowers(e.target.value)} />
              <span className="field-hint">Enter your current count so we can show the expected result</span>
            </div>
          )}

          {/* Service Selector */}
          {username && (
            <div className="field">
              <label className="field-label">📦 Select Service</label>
              <div className="svc-grid">
                {SERVICES.map(s => (
                  <button key={s.id} className={'svc-btn' + (selectedSvc?.id===s.id?' active':'')}
                    onClick={() => setSelectedSvc(s)}>
                    <span className="emoji">{s.emoji}</span>
                    <span className="name">{s.name}</span>
                    <span className="from">From {fmtUSD(Math.min(...s.types.map(t=>t.price)))}/1K</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quality Tier */}
          {selectedSvc && (
            <div className="field">
              <label className="field-label">⭐ Quality Tier</label>
              <div className="type-list">
                {selectedSvc.types.map(t => (
                  <div key={t.id} className={'type-card' + (selectedType?.id===t.id?' active':'')}
                    onClick={() => setSelectedType(t)}>
                    {t.pop && <span className="tc-pop">Popular</span>}
                    <div className="tc-radio"></div>
                    <div className="tc-info">
                      <div className="tc-name">{t.name}</div>
                      <div className="tc-desc">{t.desc}</div>
                    </div>
                    <div className="tc-price">{fmtUSD(t.price)}/1K</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          {selectedType && (
            <div className="field">
              <label className="field-label">📊 Quantity</label>
              <div className="qty-presets">
                {QTY_OPTIONS.map(q => (
                  <button key={q} className={'qty-preset' + (quantity===q?' active':'')}
                    onClick={() => setQuantity(q)}>
                    {fmtQty(q)}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Result Box */}
          {selectedType && currentCount > 0 && (
            <div className="result-box">
              <div className="label">Expected Result</div>
              <div className="counts">
                <span>{currentCount.toLocaleString('en-US')}</span>
                <span className="arrow">→</span>
                <span className="after">{afterCount.toLocaleString('en-US')} {selectedSvc.name}</span>
              </div>
            </div>
          )}

          {/* Summary */}
          {selectedType && (
            <div className="summary">
              <div className="sum-row"><span>Service</span><strong>{selectedSvc.name}</strong></div>
              <div className="sum-row"><span>Type</span><strong>{selectedType.name}</strong></div>
              <div className="sum-row"><span>Quantity</span><strong>{quantity.toLocaleString('en-US')}</strong></div>
              <div className="sum-row"><span>Rate</span><strong>{fmtUSD(rate)}/1K</strong></div>
              <hr className="sum-hr"/>
              <div className="sum-row sum-total"><span>Total</span><strong>{fmtUSD(total)}</strong></div>
              <div className="sum-delivery">⏱ Estimated delivery: {selectedSvc.delivery}</div>
            </div>
          )}

          {/* Submit */}
          {selectedType && (
            <button className="submit-btn" onClick={handleSubmit} disabled={!username}>
              <span>🚀 Place Order</span>
              <span className="price-tag">{fmtUSD(total)}</span>
            </button>
          )}

          <p className="payment-note">💳 <strong>PayPal</strong> and <strong>Credit Card</strong> accepted. Payment details shared after order.</p>
        </div>
      </div>

      <footer className="usa-footer">
        <p>© 2026 InstaSeel USA. All rights reserved. • No password required • Instant delivery</p>
      </footer>
    </div>
  );
}

// ============================================
// ADMIN PAGE
// ============================================
function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [pass, setPass] = useState('');
  const [error, setError] = useState('');
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (authed) setOrders(getOrders());
  }, [authed]);

  function handleLogin(e) {
    e.preventDefault();
    if (pass === ADMIN_PASS) { setAuthed(true); setError(''); }
    else setError('Incorrect password');
  }

  function updateStatus(idx, newStatus) {
    const updated = [...orders];
    updated[idx].status = newStatus;
    setOrders(updated);
    saveOrders(updated);
    showToast('Status updated to ' + newStatus);
  }

  if (!authed) {
    return (
      <div className="admin-login">
        <h2>🔐 Admin Panel</h2>
        <p>Enter password to access the dashboard</p>
        <form onSubmit={handleLogin}>
          <input className="field-input" type="password" placeholder="Enter admin password"
            value={pass} onChange={e => setPass(e.target.value)} autoFocus />
          <button type="submit" className="login-btn">Unlock Dashboard</button>
        </form>
        {error && <p className="error">{error}</p>}
      </div>
    );
  }

  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((s,o) => s + (o.totalNum || 0), 0);
  const completed = orders.filter(o => o.status === 'done').length;
  const pending = orders.filter(o => o.status === 'pending').length;

  return (
    <div className="admin-wrap">
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:24}}>
        <h2 style={{fontSize:'1.4rem',fontWeight:800}}>📊 Admin Dashboard</h2>
        <button onClick={() => setAuthed(false)} style={{padding:'8px 16px',background:'var(--bg)',border:'1.5px solid var(--border)',borderRadius:'50px',fontSize:'.82rem',fontWeight:600}}>🔒 Logout</button>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📦</div>
          <div className="stat-val">{totalOrders}</div>
          <div className="stat-label">Total Orders</div>
        </div>
        <div className="stat-card green">
          <div className="stat-icon">💰</div>
          <div className="stat-val">{fmtUSD(totalRevenue)}</div>
          <div className="stat-label">Total Revenue</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-val">{completed}</div>
          <div className="stat-label">Completed</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⏳</div>
          <div className="stat-val">{pending}</div>
          <div className="stat-label">Pending</div>
        </div>
      </div>

      <div className="admin-table-wrap">
        <div className="admin-table-header">
          <h3>All Orders</h3>
          <span style={{fontSize:'.82rem',color:'var(--text-muted)'}}>{totalOrders} order{totalOrders!==1?'s':''}</span>
        </div>

        {orders.length === 0 ? (
          <div className="no-orders">
            <span className="emoji">📭</span>
            <p>No orders yet. Orders will appear here once placed.</p>
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Username</th>
                <th>Service</th>
                <th>Type</th>
                <th>Qty</th>
                <th>Before</th>
                <th>After</th>
                <th>Price</th>
                <th>Date & Time</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o, i) => {
                const d = new Date(o.date);
                const dateStr = d.toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'});
                const timeStr = d.toLocaleTimeString('en-US',{hour:'2-digit',minute:'2-digit'});
                const statusClass = o.status==='done'?'status-done':o.status==='progress'?'status-progress':'status-pending';
                return (
                  <tr key={o.id || i}>
                    <td style={{fontWeight:700}}>@{o.username}</td>
                    <td>{o.service}</td>
                    <td>{o.type}</td>
                    <td>{(o.quantity||0).toLocaleString('en-US')}</td>
                    <td>{(o.currentFollowers||0).toLocaleString('en-US')}</td>
                    <td style={{color:'var(--green)',fontWeight:700}}>{(o.afterFollowers||0).toLocaleString('en-US')}</td>
                    <td style={{fontWeight:700}}>{o.total}</td>
                    <td style={{fontSize:'.78rem'}}>{dateStr}<br/><span style={{color:'var(--text-muted)'}}>{timeStr}</span></td>
                    <td>
                      <select className="status-select" value={o.status} onChange={e => updateStatus(i, e.target.value)}>
                        <option value="pending">⏳ Pending</option>
                        <option value="progress">🔄 In Progress</option>
                        <option value="done">✅ Done</option>
                      </select>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      <footer className="usa-footer">
        <p>© 2026 InstaSeel USA Admin Panel</p>
      </footer>
    </div>
  );
}

// ============================================
// APP ROOT
// ============================================
function App() {
  const [page, setPage] = useState('order');

  return (
    <div>
      <Header page={page} setPage={setPage} />
      {page === 'order' ? <OrderPage /> : <AdminPage />}
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
