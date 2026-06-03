/**
 * ksd-common.js
 * ໂຄ້ດທີ່ໃຊ້ຮ່ວມກັນທຸກໜ້າ: Drag button, Sidebar, Auth UI, Products, Cart
 * Updated: Real-time Firebase sync for all data
 */

// ========== FIREBASE CONFIG ==========
const FIREBASE_CONFIG = {
  apiKey: 'AIzaSyB_JcmHbO_kOy9v3rvstiqDoIgBYndRfZI',
  authDomain: 'ksd-kingsada.firebaseapp.com',
  databaseURL: 'https://ksd-kingsada-default-rtdb.firebaseio.com',
  projectId: 'ksd-kingsada',
  storageBucket: 'ksd-kingsada.firebasestorage.app',
  messagingSenderId: '984977062231',
  appId: '1:984977062231:web:39ebfc780ebc875dec2612',
};

let firebaseApp = null;
let firebaseDb = null;
let firebaseInitialized = false;

async function initializeFirebase() {
  if (firebaseInitialized) return;
  try {
    const { initializeApp } = await import('https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js');
    const { getDatabase } = await import('https://www.gstatic.com/firebasejs/9.22.0/firebase-database.js');
    
    firebaseApp = initializeApp(FIREBASE_CONFIG);
    firebaseDb = getDatabase(firebaseApp);
    firebaseInitialized = true;
  } catch (e) {
    console.warn('Firebase initialization failed:', e.message);
  }
}

// ========== HELPERS ==========
function escapeAttr(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;');
}

function escapeHtml(str) {
  return escapeAttr(str);
}

// ========== DRAG FLOATING BUTTON ==========
function initDragBtn() {
  const btn = document.getElementById('drag-contact-btn');
  if (!btn || btn.dataset.dragInit === 'true') return;
  btn.dataset.dragInit = 'true';

  let isDragging = false;
  let moved = false;
  let offsetX;
  let offsetY;

  function startDrag(x, y) {
    isDragging = true;
    moved = false;
    const rect = btn.getBoundingClientRect();
    offsetX = x - rect.left;
    offsetY = y - rect.top;
    btn.style.cursor = 'grabbing';
  }

  function moveDrag(x, y) {
    if (!isDragging) return;
    moved = true;
    const nx = Math.max(0, Math.min(x - offsetX, window.innerWidth - btn.offsetWidth));
    const ny = Math.max(0, Math.min(y - offsetY, window.innerHeight - btn.offsetHeight));
    btn.style.left = nx + 'px';
    btn.style.top = ny + 'px';
    btn.style.right = 'auto';
    btn.style.bottom = 'auto';
  }

  function endDrag() {
    isDragging = false;
    btn.style.cursor = 'grab';
  }

  btn.addEventListener('mousedown', e => {
    e.preventDefault();
    startDrag(e.clientX, e.clientY);
  });
  document.addEventListener('mousemove', e => moveDrag(e.clientX, e.clientY));
  document.addEventListener('mouseup', endDrag);

  btn.addEventListener('touchstart', e => {
    const t = e.touches[0];
    startDrag(t.clientX, t.clientY);
  }, { passive: true });

  document.addEventListener('touchmove', e => {
    if (!isDragging) return;
    e.preventDefault();
    const t = e.touches[0];
    moveDrag(t.clientX, t.clientY);
  }, { passive: false });

  document.addEventListener('touchend', () => {
    endDrag();
    if (moved) setTimeout(() => { moved = false; }, 300);
  });

  btn.addEventListener('click', e => {
    if (moved) {
      e.preventDefault();
      return;
    }
    window.location.href = 'contact.html';
  });
}


// ========== SIDEBAR ==========
function toggleSidebar() {
  const sidebar = document.getElementById('my-sidebar');
  const overlay = document.getElementById('sidebar-overlay');
  if (!sidebar) return;
  sidebar.classList.toggle('open');
  if (overlay) overlay.classList.toggle('open');
}

function injectSharedUI() {
  if (!document.getElementById('sidebar-toggle-btn')) {
    const toggle = document.createElement('div');
    toggle.id = 'sidebar-toggle-btn';
    toggle.className = 'sidebar-toggle-btn';
    toggle.setAttribute('onclick', 'toggleSidebar()');
    toggle.textContent = '☰';
    document.body.prepend(toggle);
  }

  if (!document.getElementById('sidebar-overlay')) {
    const overlay = document.createElement('div');
    overlay.id = 'sidebar-overlay';
    overlay.className = 'sidebar-overlay';
    overlay.onclick = toggleSidebar;
    document.body.appendChild(overlay);
  }

  if (!document.getElementById('my-sidebar')) {
    document.body.insertAdjacentHTML('beforeend', `
      <div id="my-sidebar" class="sidebar-container">
        <div class="sidebar-header">
          <h3>ການຕັ້ງຄ່າບັນຊີ</h3>
          <span class="sidebar-close-btn" onclick="toggleSidebar()">&times;</span>
        </div>
        <div class="sidebar-profile-box">
          <img src="Image/default.png" id="user-img" class="profile-avatar" onerror="this.src='https://ui-avatars.com/api/?name=KSD&background=0d2e1c&color=fff'">
          <h4 id="user-display-name">User Name</h4>
          <p>ຍົດ: <span id="user-role-badge" style="font-weight:bold; background:#1a5c0a; padding:2px 8px; border-radius:4px;">...</span></p>
        </div>
        <div class="sidebar-menu-links">
          <a href="profile.html">👤 ຂໍ້ມູນສ່ວນຕົວ</a>
          <a href="history.html" id="history-menu">📋 ປະຫວັດສັ່ງຊື້</a>
          <a href="cart.html" class="cart-nav-link">🛒 ກະຕ່າສິນຄ້າ</a>
          <a href="#" onclick="openPasswordModal(); return false;">🔒 ປ່ຽນລະຫັດຜ່ານ</a>
          <a href="#" onclick="alert('ກິ່ງສະດາ Version 1.0.0'); return false;">ℹ️ ຂໍ້ມູນລະບົບ</a>
          <a href="#" id="admin-menu" onclick="goToAdmin(); return false;" style="color:#f59e0b; display:none;">⚙️ ລະບົບ Admin</a>
          <hr style="border:0; border-top:1px solid #1a5c0a; margin:10px 0;">
          <div class="language-section">
            <p>🌐 ປ່ຽນພາສາ</p>
            <div class="lang-buttons">
              <button onclick="changeLanguage('lo')" id="lang-lo" class="lang-btn active">ພາສາລາວ</button>
              <button onclick="changeLanguage('en')" id="lang-en" class="lang-btn">English</button>
            </div>
          </div>
          <div id="auth-container" style="margin-top:12px; display:flex; flex-direction:column; gap:8px;"></div>
        </div>
      </div>
    `);
  }

  if (!document.getElementById('password-modal')) {
    document.body.insertAdjacentHTML('beforeend', `
      <div id="password-modal" class="password-modal-bg" onclick="if(event.target===this) closePasswordModal()">
        <div class="password-modal-content">
          <h4>🔒 ປ່ຽນລະຫັດຜ່ານໃໝ່</h4>
          <input type="password" placeholder="ລະຫັດຜ່ານເກົ່າ..." class="pass-input">
          <input type="password" placeholder="ລະຫັດຜ່ານໃໝ່..." class="pass-input">
          <input type="password" placeholder="ຢືນຢັນລະຫັດຜ່ານໃໝ່..." class="pass-input">
          <div class="pass-modal-btns">
            <button onclick="closePasswordModal()" class="btn-cancel-pass">ຍົກເລີກ</button>
            <button onclick="saveNewPassword()" class="btn-save-pass">ບັນທຶກ</button>
          </div>
        </div>
      </div>
    `);
  }

  if (!document.getElementById('drag-contact-btn')) {
    document.body.insertAdjacentHTML('beforeend', `
      <div id="drag-contact-btn" class="circle-contact-link"><span>ຕິດຕໍ່</span></div>
    `);
  }
}

// ========== I18N ==========
const NAV_I18N = {
  lo: {
    'index.html': 'ໜ້າຫຼັກ',
    'products.html': 'ສິນຄ້າ',
    'services.html': 'ບໍລິການ',
    'about.html': 'ກ່ຽວກັບເຮົາ',
    'contact.html': 'ຕິດຕໍ່',
  },
  en: {
    'index.html': 'Home',
    'products.html': 'Products',
    'services.html': 'Services',
    'about.html': 'About',
    'contact.html': 'Contact',
  },
};

const UI_I18N = {
  lo: {
    sidebarTitle: 'ການຕັ້ງຄ່າບັນຊີ',
    profile: '👤 ຂໍ້ມູນສ່ວນຕົວ',
    cart: '🛒 ກະຕ່າສິນຄ້າ',
    changePass: '🔒 ປ່ຽນລະຫັດຜ່ານ',
    systemInfo: 'ℹ️ ຂໍ້ມູນລະບົບ',
    admin: '⚙️ ລະບົບ Admin',
    langTitle: '🌐 ປ່ຽນພາສາ',
    addCart: 'ເພີ່ມລົງກະຕ່າ',
    emptyProducts: 'ບໍ່ພົບສິນຄ້າ',
    searchPlaceholder: 'ຄົ້ນຫາສິນຄ້າ...',
    history: '📋 ປະຫວັດສັ່ງຊື້',
    login: '🔑 ເຂົ້າສູ່ລະບົບ',
    register: '📝 ສະໝັກສະມາຊິກ',
    logout: '🚪 ອອກຈາກລະບົບ',
    guestName: 'ບໍ່ໄດ້ເຂົ້າລະບົບ',
  },
  en: {
    sidebarTitle: 'Account Settings',
    profile: '👤 Profile',
    cart: '🛒 Shopping Cart',
    changePass: '🔒 Change Password',
    systemInfo: 'ℹ️ System Info',
    admin: '⚙️ Admin Panel',
    langTitle: '🌐 Language',
    addCart: 'Add to Cart',
    emptyProducts: 'No products found',
    searchPlaceholder: 'Search products...',
    history: '📋 Order History',
    login: '🔑 Login',
    register: '📝 Register',
    logout: '🚪 Logout',
    guestName: 'Not logged in',
  },
};

function applyLanguage(lang) {
  const nav = NAV_I18N[lang] || NAV_I18N.lo;
  const ui = UI_I18N[lang] || UI_I18N.lo;

  document.querySelectorAll('.nav-menu a').forEach(a => {
    const href = a.getAttribute('href');
    if (nav[href]) a.textContent = nav[href];
  });

  const sidebarTitle = document.querySelector('.sidebar-header h3');
  if (sidebarTitle) sidebarTitle.textContent = ui.sidebarTitle;

  const profileLink = document.querySelector('.sidebar-menu-links a[href="profile.html"]');
  if (profileLink) profileLink.textContent = ui.profile;

  const historyLink = document.getElementById('history-menu');
  if (historyLink) historyLink.textContent = ui.history;

  const cartLink = document.querySelector('.sidebar-menu-links a[href="cart.html"]');
  if (cartLink) {
    const badge = cartLink.querySelector('.cart-badge');
    cartLink.textContent = ui.cart;
    if (badge) cartLink.appendChild(badge);
  }

  const sidebarLinks = document.querySelectorAll('.sidebar-menu-links > a[href="#"]');
  if (sidebarLinks[0]) sidebarLinks[0].textContent = ui.changePass;
  if (sidebarLinks[1]) sidebarLinks[1].textContent = ui.systemInfo;

  const adminLink = document.getElementById('admin-menu');
  if (adminLink) adminLink.textContent = ui.admin;

  const langTitle = document.querySelector('.language-section > p');
  if (langTitle) langTitle.textContent = ui.langTitle;

  document.querySelectorAll('.btn-buy').forEach(btn => {
    btn.textContent = ui.addCart;
  });

  const search = document.getElementById('searchInput');
  if (search) search.placeholder = ui.searchPlaceholder;

  document.documentElement.lang = lang === 'en' ? 'en' : 'lo';
}

function enhanceNav() {
  document.querySelectorAll('.nav-menu ul').forEach(ul => {
    if (ul.querySelector('a[href="contact.html"]')) return;
    const li = document.createElement('li');
    li.innerHTML = '<a href="contact.html">ຕິດຕໍ່</a>';
    ul.appendChild(li);
  });
}

function highlightActiveNav() {
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-menu a').forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === page);
  });
}

function updateCartBadge() {
  let count = 0;
  try {
    const cart = JSON.parse(localStorage.getItem('ksd_cart')) || [];
    count = cart.reduce((s, i) => s + Number(i.quantity || 0), 0);
  } catch { /* ignore */ }

  const cartLink = document.querySelector('.sidebar-menu-links a[href="cart.html"]');
  if (!cartLink) return;

  cartLink.classList.add('cart-link');
  let badge = cartLink.querySelector('.cart-badge');
  if (!badge) {
    badge = document.createElement('span');
    badge.className = 'cart-badge';
    cartLink.appendChild(badge);
  }
  if (count > 0) {
    badge.textContent = count > 99 ? '99+' : count;
    badge.style.display = 'inline-block';
  } else {
    badge.style.display = 'none';
  }
}

const FALLBACK_IMAGE = 'Image/KSD.svg';

function changeLanguage(lang) {
  document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('lang-' + lang)?.classList.add('active');
  localStorage.setItem('ksd_lang', lang);
  applyLanguage(lang);
  updateSidebarUI();
  if (lang === 'lo') alert('ປ່ຽນເປັນພາສາລາວຮຽບຮ້ອຍແລ້ວ');
  else alert('Language changed to English');
}

function restoreLanguage() {
  const lang = localStorage.getItem('ksd_lang') || 'lo';
  document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('lang-' + lang)?.classList.add('active');
  applyLanguage(lang);
}

// ========== PASSWORD MODAL ==========
function openPasswordModal() {
  const modal = document.getElementById('password-modal');
  if (modal) modal.classList.add('open');
}

function closePasswordModal() {
  const modal = document.getElementById('password-modal');
  if (modal) modal.classList.remove('open');
}

function saveNewPassword() {
  const inputs = document.querySelectorAll('.pass-input');
  const oldPass = inputs[0]?.value;
  const newPass = inputs[1]?.value;
  const confirm = inputs[2]?.value;
  if (!oldPass || !newPass || !confirm) { alert('ກະລຸນາຕື່ມຂໍ້ມູນໃຫ້ຄົບ'); return; }
  if (newPass !== confirm) { alert('ລະຫັດຜ່ານໃໝ່ບໍ່ກົງກັນ'); return; }
  const savedPass = localStorage.getItem('user_password') || '1234';
  if (oldPass !== savedPass) { alert('ລະຫັດຜ່ານເກົ່າບໍ່ຖືກຕ້ອງ'); return; }
  localStorage.setItem('user_password', newPass);
  updateUserInStore({ password: newPass });
  inputs.forEach(i => { i.value = ''; });
  alert('ປ່ຽນລະຫັດຜ່ານຮຽບຮ້ອຍ!');
  closePasswordModal();
}

// ========== AUTH SYSTEM ==========
const KSD_USERS_KEY = 'ksd_users';
const KSD_SESSION_KEY = 'ksd_logged_in';
const ADMIN_PHONES = ['02054835745'];

function isAdminUser(userOrPhone) {
  const phone = typeof userOrPhone === 'object'
    ? normalizePhone(userOrPhone?.phone)
    : normalizePhone(userOrPhone);
  return ADMIN_PHONES.includes(phone);
}

function resolveUserRole(name, phone) {
  return isAdminUser(phone) ? 'admin' : 'member';
}

function getUsers() {
  try {
    return JSON.parse(localStorage.getItem(KSD_USERS_KEY)) || [];
  } catch {
    return [];
  }
}

function saveUsers(users) {
  localStorage.setItem(KSD_USERS_KEY, JSON.stringify(users));
  syncUsersToFirebase(users);
}

function normalizePhone(phone) {
  return String(phone || '').replace(/\s/g, '');
}

function setSession(user) {
  const role = isAdminUser(user.phone) ? 'admin' : 'member';
  localStorage.setItem(KSD_SESSION_KEY, 'true');
  localStorage.setItem('user_name', user.name || '');
  localStorage.setItem('user_phone', user.phone || '');
  localStorage.setItem('user_password', user.password || '');
  localStorage.setItem('user_role', role);
  localStorage.setItem('user_age', user.age || '');
  localStorage.setItem('user_address', user.address || '');
  if (user.image) localStorage.setItem('user_image', user.image);
}

function clearSession() {
  localStorage.removeItem(KSD_SESSION_KEY);
  ['user_name', 'user_role', 'user_image', 'user_age', 'user_phone', 'user_address', 'user_password'].forEach(k => {
    localStorage.removeItem(k);
  });
}

function isLoggedIn() {
  return localStorage.getItem(KSD_SESSION_KEY) === 'true'
    && !!(localStorage.getItem('user_name') || '').trim();
}

function findUserByPhone(phone) {
  const p = normalizePhone(phone);
  return getUsers().find(u => normalizePhone(u.phone) === p);
}

function registerUser({ name, phone, password }) {
  if (findUserByPhone(phone)) {
    return { ok: false, msg: 'ເບີໂທນີ້ຖືກລົງທະບຽນແລ້ວ' };
  }
  const user = {
    id: Date.now(),
    name: name.trim(),
    phone: normalizePhone(phone),
    password,
    role: resolveUserRole(name, phone),
    age: '',
    address: '',
    image: '',
    registeredAt: new Date().toISOString(),
  };
  const users = getUsers();
  users.push(user);
  saveUsers(users);
  setSession(user);
  return { ok: true, user };
}

function loginUser(phone, password) {
  const user = findUserByPhone(phone);
  if (!user) return { ok: false, msg: 'ບໍ່ພົບບັນຊີນີ້ ກະລຸນາສະໝັກກ່ອນ' };
  if (user.password !== password) return { ok: false, msg: 'ລະຫັດຜ່ານບໍ່ຖືກຕ້ອງ' };
  setSession(user);
  return { ok: true, user };
}

function updateUserInStore(updates) {
  const phone = localStorage.getItem('user_phone');
  if (!phone) return false;
  const users = getUsers();
  const idx = users.findIndex(u => normalizePhone(u.phone) === normalizePhone(phone));
  if (idx < 0) return false;

  if (updates.phone && normalizePhone(updates.phone) !== normalizePhone(phone)) {
    if (findUserByPhone(updates.phone)) return false;
    updates.phone = normalizePhone(updates.phone);
  }

  users[idx] = { ...users[idx], ...updates };
  users[idx].role = resolveUserRole(users[idx].name, users[idx].phone);
  saveUsers(users);
  setSession(users[idx]);
  return true;
}

function initAuthStore() {
  let users = getUsers();
  if (!users.length) {
    users = [{
      id: 1,
      name: 'ທ້າວ ສຸກປະເສີດ ດວງບຸຜາ',
      phone: '02054835745',
      password: '1234',
      role: 'admin',
      age: '',
      address: '',
      image: '',
      registeredAt: new Date().toISOString(),
    }];
    saveUsers(users);
  }

  const legacyName = (localStorage.getItem('user_name') || '').trim();
  if (legacyName && legacyName !== 'User Name' && !isLoggedIn()) {
    const legacyPhone = localStorage.getItem('user_phone');
    if (legacyPhone && !findUserByPhone(legacyPhone)) {
      users.push({
        id: Date.now(),
        name: legacyName,
        phone: normalizePhone(legacyPhone),
        password: localStorage.getItem('user_password') || '1234',
        role: localStorage.getItem('user_role') || resolveUserRole(legacyName, legacyPhone),
        age: localStorage.getItem('user_age') || '',
        address: localStorage.getItem('user_address') || '',
        image: localStorage.getItem('user_image') || '',
        registeredAt: new Date().toISOString(),
      });
      saveUsers(users);
    }
  }

  users = getUsers().map(u => ({ ...u, role: resolveUserRole(u.name, u.phone) }));
  saveUsers(users);
}

function guardLoginPage() {
  if (document.body.dataset.loginPage !== 'true') return;
  if (isLoggedIn()) window.location.href = 'index.html';
}

function guardRegisterPage() {
  if (document.body.dataset.registerPage !== 'true') return;
  if (isLoggedIn()) window.location.href = 'index.html';
}

function guardProfileAccess() {
  if (document.body.dataset.profilePage !== 'true') return;
  if (!isLoggedIn()) window.location.href = 'login.html';
}

function guardHistoryAccess() {
  if (document.body.dataset.historyPage !== 'true') return;
  if (!isLoggedIn()) window.location.href = 'login.html';
}

function isAdmin() {
  return isLoggedIn() && isAdminUser(localStorage.getItem('user_phone'));
}

function goToAdmin() {
  if (!isAdmin()) {
    alert('⛔ ທ່ານບໍ່ມີສິດເຂົ້າເຖິງລະບົບ Admin');
    return;
  }
  window.location.href = 'admin.html';
}

// ========== AUTH / ROLE UI ==========
function updateSidebarUI() {
  const lang = localStorage.getItem('ksd_lang') || 'lo';
  const ui = UI_I18N[lang] || UI_I18N.lo;
  const loggedIn = isLoggedIn();
  const admin = isAdmin();
  const role = admin ? 'admin' : 'member';
  const name = loggedIn ? (localStorage.getItem('user_name') || '') : ui.guestName;
  const img = localStorage.getItem('user_image') || 'Image/default.png';

  const nameEl = document.getElementById('user-display-name');
  const imgEl = document.getElementById('user-img');
  const badge = document.getElementById('user-role-badge');
  const adminMenu = document.getElementById('admin-menu');
  const profileLink = document.querySelector('.sidebar-menu-links a[href="profile.html"]');
  const historyLink = document.getElementById('history-menu');
  const passLinks = document.querySelectorAll('.sidebar-menu-links > a[href="#"]');

  if (nameEl) nameEl.innerText = name;
  if (imgEl) imgEl.src = img;
  if (badge) badge.innerText = loggedIn ? ((admin) ? '👑 Admin' : '👤 Member') : '—';
  if (adminMenu) adminMenu.style.display = admin ? 'block' : 'none';
  if (profileLink) profileLink.style.display = loggedIn ? '' : 'none';
  if (historyLink) historyLink.style.display = loggedIn ? '' : 'none';
  if (passLinks[0]) passLinks[0].style.display = loggedIn ? '' : 'none';

  updateAuthUI();
}

function updateAuthUI() {
  const container = document.getElementById('auth-container');
  if (!container) return;
  const lang = localStorage.getItem('ksd_lang') || 'lo';
  const ui = UI_I18N[lang] || UI_I18N.lo;

  if (isLoggedIn()) {
    container.innerHTML = `<a href="#" class="logout-btn" onclick="logoutUser(); return false;">${ui.logout}</a>`;
  } else {
    container.innerHTML = `
      <a href="login.html" class="login-btn">${ui.login}</a>
      <a href="register.html" class="register-btn" style="text-align:center;">${ui.register}</a>`;
  }
}

function logoutUser() {
  clearSession();
  updateSidebarUI();
  alert('ອອກຈາກລະບົບແລ້ວ');
  if (document.body.dataset.profilePage === 'true' || document.body.dataset.adminPage === 'true') {
    window.location.href = 'login.html';
  }
}

function guardAdminAccess() {
  if (document.body.dataset.adminPage !== 'true') return;
  if (!isAdmin()) {
    alert('⛔ ທ່ານບໍ່ມີສິດເຂົ້າເຖິງໜ້າ Admin');
    window.location.href = isLoggedIn() ? 'index.html' : 'login.html';
  }
}

// ========== PRODUCT RENDER (ໜ້າຫຼັກ + products.html) ==========
const DEFAULT_PRODUCTS = [
  { id: 1, name: 'ນໍ້າໝາກພ້າວ ຊາດາ', price: 99000, desc: 'ນໍ້າໝາກພ້າວ ຫອມຫວານສົດຊື່ນ', image: 'Image/Coconut.jpeg' },
  { id: 2, name: 'ນ້ຳມັນປາມກິ່ງສະດາ', price: 159000, desc: 'ບໍ່ວ່າຈະເປັນຜັດຈະທອດ ໄວ້ໃຈກິ່ງສະດາ', image: 'Image/ນ້ຳມັນ.jpeg' },
  { id: 3, name: 'ນ້ຳອາໂລເວລ້າ', price: 99000, desc: 'ນ້ຳເຜິ້ງໝາກນາວ ພ້ອມເນື້ອຫວ້ານຫາງແຂ້ ຫອມຫວານ', image: 'Image/ອາໂລເວລາ.jpeg' },
  { id: 4, name: 'ນ້ຳໝາກໄມ້ຊາດາ', price: 99000, desc: 'ນ້ຳໝາກໄມ້ ຫອມຫວານ ຫຼາຍລົດຊາດ', image: 'Image/3.jpg' },
];

function normalizeProduct(p) {
  if (!p || typeof p !== 'object') return null;
  const name = String(p.name || '').trim();
  if (!name) return null;
  return {
    id: p.id != null ? p.id : Date.now(),
    name,
    price: Math.max(0, Number(p.price) || 0),
    desc: String(p.desc || '').trim(),
    image: String(p.image || FALLBACK_IMAGE).trim() || FALLBACK_IMAGE,
  };
}

function getProducts() {
  try {
    const stored = JSON.parse(localStorage.getItem('backend_products'));
    if (!Array.isArray(stored)) return DEFAULT_PRODUCTS.map(normalizeProduct).filter(Boolean);
    const list = stored.map(normalizeProduct).filter(Boolean);
    return list.length ? list : DEFAULT_PRODUCTS.map(normalizeProduct).filter(Boolean);
  } catch {
    return DEFAULT_PRODUCTS.map(normalizeProduct).filter(Boolean);
  }
}

function renderProducts() {
  const grid = document.getElementById('dynamic-product-grid');
  if (!grid) return;
  const list = getProducts();
  const lang = localStorage.getItem('ksd_lang') || 'lo';
  const ui = UI_I18N[lang] || UI_I18N.lo;

  if (!list.length) {
    grid.innerHTML = `<div class="product-empty">${ui.emptyProducts}</div>`;
    return;
  }

  grid.innerHTML = list.map(p => `
    <div class="product-card">
      <div class="product-img">
        <img src="${escapeAttr(p.image)}" alt="${escapeAttr(p.name)}" onerror="this.src='${FALLBACK_IMAGE}'">
      </div>
      <div class="product-info">
        <h3>${escapeHtml(p.name)}</h3>
        <p class="price">${Number(p.price).toLocaleString()} ກີບ</p>
        <p class="desc">${escapeHtml(p.desc)}</p>
        <button class="btn-buy"
          data-id="${escapeAttr(p.id)}"
          data-name="${escapeAttr(p.name)}"
          data-price="${Number(p.price)}"
          data-image="${escapeAttr(p.image)}">
          ${ui.addCart}
        </button>
      </div>
    </div>
  `).join('');
}

// ========== CART (ksd_cart key) ==========
function addToCart(id, name, price, image) {
  if (!id || !name) {
    showToast('❌ ບໍ່ສາມາດເພີ່ມສິນຄ້ານີ້ໄດ້');
    return;
  }
  const numPrice = Number(price);
  if (Number.isNaN(numPrice) || numPrice < 0) {
    showToast('❌ ລາຄາສິນຄ້າບໍ່ຖືກຕ້ອງ');
    return;
  }
  let cart = JSON.parse(localStorage.getItem('ksd_cart')) || [];
  const existing = cart.find(i => String(i.id) === String(id));
  if (existing) {
    existing.quantity = Number(existing.quantity) + 1;
  } else {
    cart.push({ id: String(id), name, price: numPrice, image: image || FALLBACK_IMAGE, quantity: 1 });
  }
  localStorage.setItem('ksd_cart', JSON.stringify(cart));
  updateCartBadge();
  showToast(`🛒 ເພີ່ມ "${name}" ເຂົ້າກະຕ່າແລ້ວ!`);
}

// ========== TOAST NOTIFICATION ==========
function showToast(msg) {
  let toast = document.getElementById('ksd-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'ksd-toast';
    toast.style.cssText = `
      position:fixed; bottom:120px; left:50%; transform:translateX(-50%);
      background:#0d2e1c; color:#fff; padding:12px 24px; border-radius:30px;
      font-size:15px; z-index:99999; box-shadow:0 4px 12px rgba(0,0,0,0.3);
      opacity:0; transition:opacity 0.3s; pointer-events:none;`;
    document.body.appendChild(toast);
  }
  toast.innerText = msg;
  toast.style.opacity = '1';
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => { toast.style.opacity = '0'; }, 2500);
}

// ========== SEARCH ==========
function searchProduct() {
  const val = (document.getElementById('searchInput')?.value || '').toLowerCase();
  const cards = document.querySelectorAll('#dynamic-product-grid .product-card');
  const lang = localStorage.getItem('ksd_lang') || 'lo';
  const ui = UI_I18N[lang] || UI_I18N.lo;
  let visible = 0;

  cards.forEach(card => {
    const show = card.innerText.toLowerCase().includes(val);
    card.style.display = show ? '' : 'none';
    if (show) visible++;
  });

  const grid = document.getElementById('dynamic-product-grid');
  let empty = grid?.querySelector('.product-empty-search');
  if (val && visible === 0 && grid) {
    if (!empty) {
      empty = document.createElement('div');
      empty.className = 'product-empty product-empty-search';
      grid.appendChild(empty);
    }
    empty.textContent = ui.emptyProducts;
    empty.style.display = '';
  } else if (empty) {
    empty.style.display = 'none';
  }
}

// ========== FIREBASE REAL-TIME SYNC ==========
async function setupFirebaseListeners() {
  await initializeFirebase();
  if (!firebaseDb) return;

  try {
    const { ref, onValue } = await import('https://www.gstatic.com/firebasejs/9.22.0/firebase-database.js');

    // Real-time product updates
    onValue(ref(firebaseDb, 'products'), snapshot => {
      const data = snapshot.val();
      if (!data || !Object.keys(data).length) return;
      const fbProducts = Object.entries(data)
        .map(([key, val]) => normalizeProduct({
          id: key,
          name: val.name,
          price: val.price,
          desc: val.desc,
          image: val.image,
        }))
        .filter(Boolean);
      if (!fbProducts.length) return;
      localStorage.setItem('backend_products', JSON.stringify(fbProducts));
      renderProducts();
      console.log('✅ Products updated from Firebase');
    }, error => {
      console.warn('Firebase products listener error:', error.message);
    });

    // Real-time orders updates
    onValue(ref(firebaseDb, 'orders'), snapshot => {
      const data = snapshot.val();
      if (data) {
        const fbOrders = Array.isArray(data) ? data : Object.values(data);
        localStorage.setItem('backend_orders', JSON.stringify(fbOrders));
        console.log('✅ Orders updated from Firebase');
      }
    }, error => {
      console.warn('Firebase orders listener error:', error.message);
    });

    // Real-time users updates
    onValue(ref(firebaseDb, 'users'), snapshot => {
      const data = snapshot.val();
      if (data) {
        const fbUsers = Array.isArray(data) ? data : Object.values(data);
        localStorage.setItem(KSD_USERS_KEY, JSON.stringify(fbUsers));
        console.log('✅ Users updated from Firebase');
      }
    }, error => {
      console.warn('Firebase users listener error:', error.message);
    });

  } catch (e) {
    console.warn('Firebase listeners setup failed:', e.message);
  }
}

async function syncProductsToFirebase(products) {
  await initializeFirebase();
  if (!firebaseDb) return;
  try {
    const { ref, set } = await import('https://www.gstatic.com/firebasejs/9.22.0/firebase-database.js');
    const data = {};
    products.forEach(p => {
      data[String(p.id)] = { name: p.name, price: p.price, desc: p.desc, image: p.image };
    });
    await set(ref(firebaseDb, 'products'), data);
    console.log('✅ Products synced to Firebase');
  } catch (e) {
    console.warn('Firebase products sync failed:', e.message);
  }
}

async function syncOrdersToFirebase(orders) {
  await initializeFirebase();
  if (!firebaseDb) return;
  try {
    const { ref, set } = await import('https://www.gstatic.com/firebasejs/9.22.0/firebase-database.js');
    await set(ref(firebaseDb, 'orders'), orders);
    console.log('✅ Orders synced to Firebase');
  } catch (e) {
    console.warn('Firebase orders sync failed:', e.message);
  }
}

async function syncUsersToFirebase(users) {
  await initializeFirebase();
  if (!firebaseDb) return;
  try {
    const { ref, set } = await import('https://www.gstatic.com/firebasejs/9.22.0/firebase-database.js');
    await set(ref(firebaseDb, 'users'), users);
    console.log('✅ Users synced to Firebase');
  } catch (e) {
    console.warn('Firebase users sync failed:', e.message);
  }
}

// ========== INIT ON LOAD ==========
document.addEventListener('click', e => {
  const btn = e.target.closest('.btn-buy');
  if (btn) {
    addToCart(btn.dataset.id, btn.dataset.name, btn.dataset.price, btn.dataset.image);
  }
});

document.addEventListener('DOMContentLoaded', () => {
  initAuthStore();

  if (!localStorage.getItem('backend_products')) {
    localStorage.setItem('backend_products', JSON.stringify(DEFAULT_PRODUCTS));
  }

  injectSharedUI();
  initDragBtn();
  enhanceNav();
  highlightActiveNav();
  guardLoginPage();
  guardRegisterPage();
  guardProfileAccess();
  guardHistoryAccess();
  guardAdminAccess();
  updateSidebarUI();
  updateCartBadge();
  restoreLanguage();
  renderProducts();

  document.querySelector('.search-btn')?.addEventListener('click', searchProduct);
  document.getElementById('searchInput')?.addEventListener('keydown', e => {
    if (e.key === 'Enter') searchProduct();
  });

  // Setup real-time Firebase listeners
  setupFirebaseListeners();
});
