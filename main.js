import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";
import { getAI, getGenerativeModel, GoogleAIBackend } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-ai.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, sendPasswordResetEmail, deleteUser } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";
import { getFirestore, collection, addDoc, getDocs, getDoc, deleteDoc, updateDoc, doc, query, where, setDoc } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDbjHCHaRhcwBNFCyphhW7fPkGqPXxoZPM",
  authDomain: "spendwise-a662a.firebaseapp.com",
  projectId: "spendwise-a662a",
  storageBucket: "spendwise-a662a.firebasestorage.app",
  messagingSenderId: "310761626417",
  appId: "1:310761626417:web:6f7d664eec15a289112e10",
  measurementId: "G-YQRVKCBTR5"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const ai = getAI(app, { backend: new GoogleAIBackend() });
const aiModel = getGenerativeModel(ai, { model: "gemini-3.8-flash" });

// DOM Elements
const email = document.getElementById("email");
const password = document.getElementById("password");
const signupBtn = document.getElementById("signupBtn");
const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");
const authSection = document.getElementById("authSection");
const togglePasswordBtn = document.getElementById("togglePasswordBtn");
const passwordEyeIcon = document.getElementById("passwordEyeIcon");
const forgotPasswordBtn = document.getElementById("forgotPasswordBtn");

const homeSection = document.getElementById("homeSection");
const analyticsSection = document.getElementById("analyticsSection");
const budgetSection = document.getElementById("budgetSection");
const profileSection = document.getElementById("profileSection");
const aiSection = document.getElementById("aiSection");
const savingsSection = document.getElementById("savingsSection");

const footerNav = document.querySelector(".footer-nav");
const navHome = document.getElementById("navHome");
const navAnalytics = document.getElementById("navAnalytics");
const navBudget = document.getElementById("navBudget");
const navAi = document.getElementById("navAi");
const navSavings = document.getElementById("navSavings");

const aiInput = document.getElementById("aiInput");
const aiSendBtn = document.getElementById("aiSendBtn");
const chatMessages = document.getElementById("chatMessages");

const expenseName = document.getElementById("expenseName");
const amount = document.getElementById("expenseAmount");
const expenseNote = document.getElementById("expenseNote");
const addBtn = document.getElementById("addBtn");
const expenseList = document.getElementById("expenseList");
const type = document.getElementById("type");
const category = document.getElementById("category");

const incomeDisplay = document.getElementById("income");
const expenseDisplay = document.getElementById("expense");
const total = document.getElementById("balance");

const monthFilter = document.getElementById("monthFilter");
const searchBar = document.getElementById("searchBar");

const transactionModal = document.getElementById("transactionModal");
const openTransactionModal = document.getElementById("openTransactionModal");
const closeTransactionModal = document.getElementById("closeTransactionModal");

const transactionDetailModal = document.getElementById("transactionDetailModal");
const detailContent = document.getElementById("detailContent");
const openEditFromDetailBtn = document.getElementById("openEditFromDetailBtn");
const deleteFromDetailBtn = document.getElementById("deleteFromDetailBtn");
const closeDetailTopBtn = document.getElementById("closeDetailTopBtn");

const editModal = document.getElementById("editModal");
const editTitle = document.getElementById("editTitle");
const editAmount = document.getElementById("editAmount");
const editNote = document.getElementById("editNote");
const editType = document.getElementById("editType");
const editCategory = document.getElementById("editCategory");
const saveEditBtn = document.getElementById("saveEditBtn");
const cancelEditBtn = document.getElementById("cancelEditBtn");

const budgetAmount = document.getElementById("budgetAmount");
const budgetSpent = document.getElementById("budgetSpent");
const budgetRemaining = document.getElementById("budgetRemaining");
const budgetProgress = document.getElementById("budgetProgress");
const budgetStatus = document.getElementById("budgetStatus");
const editBudgetBtn = document.getElementById("editBudgetBtn");
const budgetModal = document.getElementById("budgetModal");
const budgetInput = document.getElementById("budgetInput");
const saveBudgetBtn = document.getElementById("saveBudgetBtn");
const cancelBudgetBtn = document.getElementById("cancelBudgetBtn");
const budgetModalTitle = document.getElementById("budgetModalTitle");
const categoryBudgetContainer = document.getElementById("categoryBudgetContainer");

const categoryLimitModal = document.getElementById("categoryLimitModal");
const categoryLimitModalTitle = document.getElementById("categoryLimitModalTitle");
const categoryLimitModalSubtitle = document.getElementById("categoryLimitModalSubtitle");
const categoryLimitInput = document.getElementById("categoryLimitInput");
const saveCategoryLimitBtn = document.getElementById("saveCategoryLimitBtn");
const cancelCategoryLimitBtn = document.getElementById("cancelCategoryLimitBtn");

let activeCategoryForLimit = null;

const profileBtn = document.getElementById("profileBtn");
const profileBackBtn = document.getElementById("profileBackBtn");
const profileLogoutBtn = document.getElementById("profileLogoutBtn");
const changePasswordBtn = document.getElementById("changePasswordBtn");
const exportDataBtn = document.getElementById("exportDataBtn");
const deleteAccountBtn = document.getElementById("deleteAccountBtn");
const feedbackBtn = document.getElementById("feedbackBtn");
const profileThemeBtn = document.getElementById("profileThemeBtn");
const profileEmail = document.getElementById("profileEmail");
const profileEmailRow = document.getElementById("profileEmailRow");
const profileTransactions = document.getElementById("profileTransactions");
const profileIncome = document.getElementById("profileIncome");
const profileExpenses = document.getElementById("profileExpenses");
const profileThemeIcon = document.getElementById("profileThemeIcon");
const profileThemeText = document.getElementById("profileThemeText");

const currencyBtn = document.getElementById("currencyBtn");
const currencyText = document.getElementById("currencyText");
const currencyModal = document.getElementById("currencyModal");
const closeCurrencyModal = document.getElementById("closeCurrencyModal");
const currencyOptionsContainer = document.getElementById("currencyOptionsContainer");

const openCategoryModalBtn = document.getElementById("openCategoryModalBtn");
const categoryModal = document.getElementById("categoryModal");
const newCategoryName = document.getElementById("newCategoryName");
const saveCategoryBtn = document.getElementById("saveCategoryBtn");
const cancelCategoryBtn = document.getElementById("cancelCategoryBtn");

const analyticsMonthSelect = document.getElementById("analyticsMonthSelect");
const menuBtn = document.getElementById("menuBtn");
const headerMenu = document.getElementById("headerMenu");

const themeBtn = document.getElementById("themeBtn");
const themeIcon = document.getElementById("themeIcon");
const themeText = document.getElementById("themeText");

// Password Visibility Toggle
if (togglePasswordBtn) {
  togglePasswordBtn.addEventListener("click", () => {
    if (password.type === "password") {
      password.type = "text";
      passwordEyeIcon.className = "fa-solid fa-eye-slash";
    } else {
      password.type = "password";
      passwordEyeIcon.className = "fa-solid fa-eye";
    }
  });
}

// Forgot Password Handler
if (forgotPasswordBtn) {
  forgotPasswordBtn.addEventListener("click", async () => {
    const emailVal = email.value.trim();
    if (!emailVal) return showToast("Please enter your email address first.", "error");
    try {
      await sendPasswordResetEmail(auth, emailVal);
      showToast("Password reset email sent to " + emailVal);
    } catch (error) {
      showToast(error.message, "error");
    }
  });
}

// Feedback Option Handler
if (feedbackBtn) {
  feedbackBtn.addEventListener("click", () => {
    window.location.href = "mailto:klarotech.official@gmail.com?subject=SpendWISE%20Feedback&body=Hi%20KlaroTech,%20here%20is%20my%20feedback:";
  });
}

// Currencies
const currencies = {
  INR: { name: "Indian Rupee", symbol: "₹", code: "INR", flag: "🇮🇳" },
  USD: { name: "US Dollar", symbol: "$", code: "USD", flag: "🇺🇸" },
  EUR: { name: "Euro", symbol: "€", code: "EUR", flag: "🇪🇺" },
  GBP: { name: "British Pound", symbol: "£", code: "GBP", flag: "🇬🇧" },
  CAD: { name: "Canadian Dollar", symbol: "CA$", code: "CAD", flag: "🇨🇦" },
  AUD: { name: "Australian Dollar", symbol: "A$", code: "AUD", flag: "🇦🇺" },
  JPY: { name: "Japanese Yen", symbol: "¥", code: "JPY", flag: "🇯🇵" },
  CNY: { name: "Chinese Yuan", symbol: "¥", code: "CNY", flag: "🇨🇳" },
  AED: { name: "UAE Dirham", symbol: "AED", code: "AED", flag: "🇦🇪" },
  SGD: { name: "Singapore Dollar", symbol: "S$", code: "SGD", flag: "🇸🇬" }
};

let selectedCurrency = localStorage.getItem("currency") || "INR";

// Toast helper
function showToast(message, type = "success") {
  const existing = document.querySelector(".toast");
  if (existing) existing.remove();
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 2400);
}

function getCurrency() { return currencies[selectedCurrency] || currencies.INR; }
function formatMoney(amount) {
  const currency = getCurrency();
  return `${currency.symbol}${Number(amount).toLocaleString("en-IN")}`;
}

function populateCurrencyOptions() {
  if (!currencyOptionsContainer) return;
  currencyOptionsContainer.innerHTML = "";
  Object.values(currencies).forEach(c => {
    const btn = document.createElement("button");
    btn.className = `currency-option ${c.code === selectedCurrency ? "selected" : ""}`;
    btn.innerHTML = `
      <span class="currency-flag">${c.flag}</span>
      <span class="currency-info"><strong>${c.name}</strong><small>${c.symbol} ${c.code}</small></span>
    `;
    btn.addEventListener("click", () => {
      selectedCurrency = c.code;
      localStorage.setItem("currency", selectedCurrency);
      updateCurrencyUI();
      updateBalance();
      updateBudget();
      if (chartInstance || barChartInstance) updateCharts();
      updateProfile();
      showExpense();
      currencyModal.classList.remove("show");
    });
    currencyOptionsContainer.appendChild(btn);
  });
}
function updateCurrencyUI() {
  const currency = getCurrency();
  if (currencyText) currencyText.textContent = `${currency.name} (${currency.symbol} ${currency.code})`;
}
populateCurrencyOptions();
updateCurrencyUI();

// Custom Categories
let customCategories = JSON.parse(localStorage.getItem("customCategories") || '["🍕 Food", "🛒 Shopping", "🚗 Transport", "🧾 Bills", "🎬 Entertainment", "💰 Salary", "💼 Business", "📱 Internet", "💻 Wifi", "🏷 Subscription", "✈ Travel", "🛍 Beauty", "🎁 Gift", "🐶 Pet", "💸 Investments", "🏠 Home", "Others"]');

function populateCategorySelects() {
  [category, editCategory].forEach(sel => {
    if (!sel) return;
    const currentVal = sel.value;
    sel.innerHTML = customCategories.map(cat => `<option value="${cat}">${cat}</option>`).join("");
    sel.value = currentVal;
  });
}
populateCategorySelects();

if (openCategoryModalBtn) openCategoryModalBtn.addEventListener("click", () => categoryModal.classList.add("show"));
if (cancelCategoryBtn) cancelCategoryBtn.addEventListener("click", () => categoryModal.classList.remove("show"));
if (saveCategoryBtn) {
  saveCategoryBtn.addEventListener("click", () => {
    const name = newCategoryName.value.trim();
    if (!name) return showToast("Enter a category name.", "error");
    if (!customCategories.includes(name)) {
      customCategories.push(name);
      localStorage.setItem("customCategories", JSON.stringify(customCategories));
      populateCategorySelects();
      renderCategoryBudgetsUI();
    }
    const successMsg = document.createElement("div");
    successMsg.textContent = "Category added! 🎉";
    successMsg.style.cssText = "position:fixed; bottom:90px; left:50%; transform:translateX(-50%); background:#22c55e; color:#061008; padding:10px 20px; border-radius:12px; font-weight:700; z-index:3000; box-shadow:0 5px 20px rgba(34,197,94,0.4);";
    document.body.appendChild(successMsg);
    setTimeout(() => successMsg.remove(), 2000);

    newCategoryName.value = "";
    categoryModal.classList.remove("show");
  });
}

let editingTransactionId = null;
let selectedTransactionForDetail = null;
let chartInstance = null;
let barChartInstance = null;
const transactions = [];

signupBtn.addEventListener("click", async () => {
  if (!email.value.trim() || !password.value) return showToast("Enter email and password.", "error");
  try {
    await createUserWithEmailAndPassword(auth, email.value, password.value);
    showToast("Account created successfully!");
    email.value = ""; password.value = "";
  } catch (error) { showToast(error.message, "error"); }
});

loginBtn.addEventListener("click", async () => {
  if (!email.value.trim() || !password.value) return showToast("Enter email and password.", "error");
  try {
    await signInWithEmailAndPassword(auth, email.value, password.value);
    email.value = ""; password.value = "";
  } catch (error) { showToast(error.message, "error"); }
});

logoutBtn.addEventListener("click", async () => {
  try { await signOut(auth); clearUserData(); } catch (error) { showToast(error.message, "error"); }
});

if (deleteAccountBtn) {
  deleteAccountBtn.addEventListener("click", async () => {
    const user = auth.currentUser;
    if (!user) return;
    if (confirm("Are you sure you want to permanently delete your SpendWISE account? This action cannot be undone.")) {
      try {
        await deleteUser(user);
        clearUserData();
        showToast("Account deleted successfully.");
      } catch (error) {
        showToast("Could not delete account. Please log out and log back in first.", "error");
      }
    }
  });
}

function clearUserData() {
  transactions.length = 0;
  savingsGoals.length = 0;
  categoryBudgets = {};
  monthlyBudget = 0;

  if (expenseList) expenseList.innerHTML = "";
  if (goalsContainer) goalsContainer.innerHTML = "";
  if (categoryBudgetContainer) categoryBudgetContainer.innerHTML = "";
  
  if (chatMessages) {
    chatMessages.innerHTML = `
      <div class="message-wrapper ai-wrapper">
        <div class="chat-avatar ai-avatar">
          <i class="fa-solid fa-robot"></i>
        </div>
        <div class="message ai-msg">
          Hello! I'm your SpendWISE AI assistant. Ask me anything about your spending or how to save money! 💡
        </div>
      </div>
    `;
  }

  if (incomeDisplay) incomeDisplay.textContent = "₹0";
  if (expenseDisplay) expenseDisplay.textContent = "₹0";
  if (total) total.textContent = "₹0";
  if (budgetAmount) budgetAmount.textContent = "₹0";
  if (budgetSpent) budgetSpent.textContent = "₹0";
  if (budgetRemaining) budgetRemaining.textContent = "₹0";
  if (budgetProgress) budgetProgress.style.width = "0%";
}

onAuthStateChanged(auth, async (user) => {
  if (user) {
    clearUserData();
    authSection.classList.remove("show-auth");
    homeSection.classList.add("active-section");
    analyticsSection.classList.remove("active-section");
    budgetSection.classList.remove("active-section");
    profileSection.classList.remove("active-section");
    aiSection.classList.remove("active-section");
    savingsSection.classList.remove("active-section");
    
    const fab = document.getElementById("openTransactionModal");
    if (fab) fab.classList.remove("hidden");
    
    footerNav.classList.add("show-nav");
    navHome.classList.add("active");
    navAnalytics.classList.remove("active");
    navBudget.classList.remove("active");
    navAi.classList.remove("active");
    navSavings.classList.remove("active");

    await loadTransactions();
    await loadBudget(user);
    await loadCategoryBudgets(user);
    await loadSavingsGoals();
  } else {
    clearUserData();
    authSection.classList.add("show-auth");
    homeSection.classList.remove("active-section");
    analyticsSection.classList.remove("active-section");
    budgetSection.classList.remove("active-section");
    profileSection.classList.remove("active-section");
    aiSection.classList.remove("active-section");
    savingsSection.classList.remove("active-section");
    footerNav.classList.remove("show-nav");
    const fab = document.getElementById("openTransactionModal");
    if (fab) fab.classList.add("hidden");
  }
});

if (openTransactionModal) openTransactionModal.addEventListener("click", () => transactionModal.classList.add("show"));
if (closeTransactionModal) closeTransactionModal.addEventListener("click", () => transactionModal.classList.remove("show"));
transactionModal.addEventListener("click", (e) => { if (e.target === transactionModal) transactionModal.classList.remove("show"); });

addBtn.addEventListener("click", async () => {
  if (!expenseName.value.trim() || !amount.value) return showToast("Please enter a title and amount.", "error");
  const user = auth.currentUser;
  if (!user) return showToast("Please login first.", "error");

  const now = new Date();
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const transaction = {
    uid: user.uid,
    id: Date.now(),
    title: expenseName.value.trim(),
    amount: Number(amount.value),
    note: expenseNote ? expenseNote.value.trim() : "",
    type: type.value,
    category: category.value,
    date: `${now.getDate()} / ${months[now.getMonth()]} / ${now.getFullYear()}`
  };

  try {
    const docRef = await addDoc(collection(db, "transactions"), transaction);
    transactionModal.classList.remove("show");
    transaction.firestoreId = docRef.id;
    transactions.push(transaction);
    showToast("Transaction added");

    populateMonthFilter();
    updateBalance();
    updateBudget();
    showExpense();
    updateProfile();

    expenseName.value = "";
    amount.value = "";
    if (expenseNote) expenseNote.value = "";
    if (chartInstance || barChartInstance) updateCharts();
  } catch (error) { showToast(error.message, "error"); }
});

const typeToggle = document.getElementById("typeToggle");
typeToggle.addEventListener("click", (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;
  typeToggle.querySelectorAll("button").forEach(b => b.classList.remove("on"));
  btn.classList.add("on");
  type.value = btn.dataset.value;
});

async function loadTransactions() {
  const user = auth.currentUser;
  if (!user) return;
  try {
    transactions.length = 0;
    incomeDisplay.textContent = "Loading...";
    expenseDisplay.textContent = "Loading...";
    total.textContent = "Loading...";
    const q = query(collection(db, "transactions"), where("uid", "==", user.uid));
    const snapshot = await getDocs(q);
    snapshot.forEach(doc => transactions.push({ firestoreId: doc.id, ...doc.data() }));

    populateMonthFilter();
    showExpense();
    updateBalance();
    updateProfile();
  } catch (error) { console.error(error); }
}

function showExpense(listToDisplay = transactions) {
  expenseList.innerHTML = "";
  if (listToDisplay.length === 0) {
    expenseList.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">💸</div>
        <h5>No transactions yet</h5>
        <p>Start tracking by adding your first income or expense.</p>
      </div>`;
    return;
  }

  const grouped = {};
  listToDisplay.forEach(t => {
    const dKey = t.date;
    if (!grouped[dKey]) grouped[dKey] = [];
    grouped[dKey].push(t);
  });

  Object.entries(grouped).forEach(([dateStr, items]) => {
    const dateTitle = document.createElement("div");
    dateTitle.className = "transaction-date-group-title";
    dateTitle.textContent = dateStr;
    expenseList.appendChild(dateTitle);

    items.forEach(transaction => {
      const card = document.createElement("div");
      card.classList.add("list");
      card.style.borderLeft = transaction.type === "income" ? "5px solid var(--accent-green)" : "5px solid var(--accent-red)";
      card.innerHTML = `
        <div class="left">
          <h4>${transaction.title}</h4>
          <p>${transaction.category} ${transaction.note ? "• " + transaction.note : ""}</p>
        </div>
        <div class="right">
          <h3 class="${transaction.type}">${transaction.type === "income" ? "+" : "-"}${formatMoney(transaction.amount)}</h3>
        </div>
      `;
      card.addEventListener("click", () => openTransactionDetail(transaction));
      expenseList.appendChild(card);
    });
  });
}

function openTransactionDetail(transaction) {
  selectedTransactionForDetail = transaction;
  detailContent.innerHTML = `
    <div><strong>Title:</strong> ${transaction.title}</div>
    <div><strong>Amount:</strong> ${formatMoney(transaction.amount)} (${transaction.type})</div>
    <div><strong>Category:</strong> ${transaction.category}</div>
    <div><strong>Date:</strong> ${transaction.date}</div>
    <div><strong>Note:</strong> ${transaction.note || "No note added"}</div>
  `;
  transactionDetailModal.classList.add("show");
}

if (closeDetailTopBtn) closeDetailTopBtn.addEventListener("click", () => transactionDetailModal.classList.remove("show"));

openEditFromDetailBtn.addEventListener("click", () => {
  if (!selectedTransactionForDetail) return;
  transactionDetailModal.classList.remove("show");
  editingTransactionId = selectedTransactionForDetail.firestoreId;
  editTitle.value = selectedTransactionForDetail.title;
  editAmount.value = selectedTransactionForDetail.amount;
  if (editNote) editNote.value = selectedTransactionForDetail.note || "";
  editType.value = selectedTransactionForDetail.type;
  editCategory.value = selectedTransactionForDetail.category;
  editModal.classList.add("show");
});

deleteFromDetailBtn.addEventListener("click", async () => {
  if (!selectedTransactionForDetail) return;
  if (!confirm("Are you sure you want to delete this transaction?")) return;
  try {
    await deleteDoc(doc(db, "transactions", selectedTransactionForDetail.firestoreId));
    const idx = transactions.findIndex(t => t.firestoreId === selectedTransactionForDetail.firestoreId);
    if (idx !== -1) transactions.splice(idx, 1);
    transactionDetailModal.classList.remove("show");
    populateMonthFilter();
    updateBalance();
    updateBudget();
    showExpense();
    updateProfile();
    if (chartInstance || barChartInstance) updateCharts();
  } catch (error) { showToast(error.message, "error"); }
});

saveEditBtn.addEventListener("click", async () => {
  if (!editingTransactionId) return;
  const updatedData = {
    title: editTitle.value.trim(),
    amount: Number(editAmount.value),
    note: editNote ? editNote.value.trim() : "",
    type: editType.value,
    category: editCategory.value
  };

  try {
    await updateDoc(doc(db, "transactions", editingTransactionId), updatedData);
    const t = transactions.find(item => item.firestoreId === editingTransactionId);
    if (t) {
      t.title = updatedData.title;
      t.amount = updatedData.amount;
      t.note = updatedData.note;
      t.type = updatedData.type;
      t.category = updatedData.category;
    }
    editModal.classList.remove("show");
    editingTransactionId = null;
    showExpense();
    updateBalance();
    updateBudget();
    updateProfile();
    if (chartInstance || barChartInstance) updateCharts();
  } catch (error) { showToast(error.message, "error"); }
});

cancelEditBtn.addEventListener("click", () => {
  editModal.classList.remove("show");
  editingTransactionId = null;
});

function updateBalance() {
  const income = transactions.filter(t => t.type === "income").reduce((s, t) => s + t.amount, 0);
  incomeDisplay.textContent = `+ ${formatMoney(income)}`;
  const expense = transactions.filter(t => t.type === "expense").reduce((s, t) => s + t.amount, 0);
  expenseDisplay.textContent = `- ${formatMoney(expense)}`;
  total.textContent = `${formatMoney(income - expense)}`;
  // Subtle pulse on balance update
  total.classList.remove("pulse");
  void total.offsetWidth;
  total.classList.add("pulse");
}

searchBar.addEventListener("input", () => {
  const q = searchBar.value.toLowerCase().trim();
  const res = transactions.filter(t => t.title.toLowerCase().includes(q) || t.category.toLowerCase().includes(q) || (t.note && t.note.toLowerCase().includes(q)));
  showExpense(res);
});

let monthlyBudget = 0;
let categoryBudgets = {};

async function loadCategoryBudgets(user) {
  try {
    const snap = await getDoc(doc(db, "budgets", `${user.uid}_categories`));
    if (snap.exists()) categoryBudgets = snap.data().limits || {};
    else categoryBudgets = {};
    updateBudget();
  } catch (e) { console.error(e); }
}

async function saveCategoryBudgetsToDB() {
  const user = auth.currentUser;
  if (!user) return;
  try {
    await setDoc(doc(db, "budgets", `${user.uid}_categories`), { uid: user.uid, limits: categoryBudgets });
  } catch (e) { console.error(e); }
}

function updateBudget() {
  const now = new Date();
  const currentMonth = now.toLocaleString("en-US", { month: "short" });
  const currentYear = now.getFullYear().toString();

  let spent = 0;
  const categorySpent = {};

  transactions.forEach(t => {
    if (t.type !== "expense") return;
    const parts = t.date.split(" / ");
    if (parts.length === 3 && parts[1] === currentMonth && parts[2] === currentYear) {
      spent += Number(t.amount);
      categorySpent[t.category] = (categorySpent[t.category] || 0) + Number(t.amount);
    }
  });

  let computedTotalBudget = monthlyBudget;
  const catEntries = Object.entries(categoryBudgets);
  if (catEntries.length > 0) {
    computedTotalBudget = catEntries.reduce((sum, [, limit]) => sum + Number(limit), 0);
  }

  budgetAmount.textContent = formatMoney(computedTotalBudget);
  budgetSpent.textContent = formatMoney(spent);
  const remaining = computedTotalBudget - spent;
  budgetRemaining.textContent = remaining >= 0 ? formatMoney(remaining) : `-${formatMoney(Math.abs(remaining))}`;

  const percentage = computedTotalBudget > 0 ? (spent / computedTotalBudget) * 100 : 0;
  budgetProgress.style.width = `${Math.min(percentage, 100)}%`;

  if (computedTotalBudget > 0 && percentage >= 100) {
    budgetStatus.textContent = "Total budget exceeded!";
  } else if (computedTotalBudget > 0) {
    budgetStatus.textContent = `${percentage.toFixed(0)}% of total budget used`;
  } else {
    budgetStatus.textContent = "Set category budgets or total budget";
  }

  renderCategoryBudgetsUI(categorySpent);
}

function renderCategoryBudgetsUI(categorySpent = {}) {
  if (!categoryBudgetContainer) return;
  categoryBudgetContainer.innerHTML = "";

  const budgetableCategories = customCategories.filter(cat => !cat.toLowerCase().includes("salary"));

  const sortedCategories = [...budgetableCategories].sort((a, b) => {
    const limitA = categoryBudgets[a] || 0;
    const limitB = categoryBudgets[b] || 0;
    if (limitA > 0 && limitB === 0) return -1;
    if (limitA === 0 && limitB > 0) return 1;
    return 0;
  });

  sortedCategories.forEach(cat => {
    const limit = categoryBudgets[cat] || 0;
    const spent = categorySpent[cat] || 0;
    const isExceeded = limit > 0 && spent > limit;
    const rem = limit - spent;
    const hasLimit = limit > 0;

    const card = document.createElement("div");
    card.className = "category-budget-card";
    card.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:flex-start;">
        <div>
          <strong style="font-size: 0.98rem; font-weight:700; display:block; margin-bottom: 6px;">${cat}</strong>
          <div style="display:flex; flex-direction:column; gap:3px; color:var(--text-muted); font-size:0.82rem;">
            <span>Budget: <strong style="color:var(--text-main);">${formatMoney(limit)}</strong></span>
            <span>Spend: <strong style="color:var(--accent-red);">${formatMoney(spent)}</strong></span>
            <span>Remaining: <strong style="color:var(--accent-green-bright);">${rem >= 0 ? formatMoney(rem) : "-" + formatMoney(Math.abs(rem))}</strong></span>
          </div>
        </div>
        <div style="display:flex; flex-direction:column; gap:6px;">
          <button class="cat-edit-btn" data-cat="${cat}">${hasLimit ? "Edit Limit" : "Set Limit"}</button>
          ${hasLimit ? `<button class="cat-del-btn" data-cat="${cat}">Remove</button>` : ""}
        </div>
      </div>
      ${isExceeded ? `<div style="font-size: 0.82rem; color: #ef4444; font-style: italic; margin-top: 6px;">⚠️ Budget limit exceeded!</div>` : ""}
    `;
    categoryBudgetContainer.appendChild(card);
  });

  categoryBudgetContainer.querySelectorAll(".cat-edit-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      activeCategoryForLimit = btn.dataset.cat;
      categoryLimitModalTitle.textContent = categoryBudgets[activeCategoryForLimit] ? "Edit Category Limit" : "Set Category Limit";
      categoryLimitModalSubtitle.textContent = `Category: ${activeCategoryForLimit}`;
      categoryLimitInput.value = categoryBudgets[activeCategoryForLimit] || "";
      categoryLimitModal.classList.add("show");
      categoryLimitInput.focus();
    });
  });

  categoryBudgetContainer.querySelectorAll(".cat-del-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const cat = btn.dataset.cat;
      delete categoryBudgets[cat];
      saveCategoryBudgetsToDB();
      updateBudget();
    });
  });
}

if (saveCategoryLimitBtn) {
  saveCategoryLimitBtn.addEventListener("click", () => {
    const val = Number(categoryLimitInput.value);
    if (!activeCategoryForLimit) return;
    if (val > 0) {
      categoryBudgets[activeCategoryForLimit] = val;
    } else {
      delete categoryBudgets[activeCategoryForLimit];
    }
    saveCategoryBudgetsToDB();
    categoryLimitModal.classList.remove("show");
    activeCategoryForLimit = null;
    updateBudget();
  });
}

if (cancelCategoryLimitBtn) {
  cancelCategoryLimitBtn.addEventListener("click", () => {
    categoryLimitModal.classList.remove("show");
    activeCategoryForLimit = null;
  });
}

editBudgetBtn.addEventListener("click", () => {
  budgetModalTitle.textContent = "Set Total Monthly Budget";
  budgetModal.classList.add("show");
  budgetInput.value = monthlyBudget > 0 ? monthlyBudget : "";
  budgetInput.focus();
});

saveBudgetBtn.addEventListener("click", async () => {
  const val = Number(budgetInput.value);
  if (!val || val <= 0) return showToast("Enter valid budget.", "error");
  monthlyBudget = val;
  const user = auth.currentUser;
  if (user) {
    try {
      await setDoc(doc(db, "budgets", `${user.uid}_total`), { uid: user.uid, amount: monthlyBudget });
    } catch (e) { console.error(e); }
  }
  budgetModal.classList.remove("show");
  updateBudget();
});

cancelBudgetBtn.addEventListener("click", () => budgetModal.classList.remove("show"));

async function loadBudget(user) {
  if (!user) return;
  try {
    const snap = await getDoc(doc(db, "budgets", `${user.uid}_total`));
    if (snap.exists()) monthlyBudget = snap.data().amount || 0;
    updateBudget();
  } catch (e) { console.error(e); }
}

// Hand Swipe & Dot Sliding UI for Analytics Charts
if (analyticsMonthSelect) analyticsMonthSelect.addEventListener("change", updateCharts);

const chartDots = document.querySelectorAll(".chart-dot");
const chartSliderTrack = document.getElementById("chartSliderTrack");
const chartSliderWrapper = document.getElementById("chartSliderWrapper");

let currentSlideIndex = 0;
function goToSlide(index) {
  currentSlideIndex = index;
  chartDots.forEach((d, i) => {
    if (i === index) d.classList.add("active");
    else d.classList.remove("active");
  });
  if (chartSliderTrack) {
    chartSliderTrack.style.transform = `translateX(-${index * 50}%)`;
  }
}

chartDots.forEach(dot => {
  dot.addEventListener("click", () => {
    goToSlide(Number(dot.dataset.index));
  });
});

// Touch / Mouse Swipe Handlers
let touchStartX = 0;
let touchEndX = 0;

if (chartSliderWrapper) {
  chartSliderWrapper.addEventListener("touchstart", (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  chartSliderWrapper.addEventListener("touchend", (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipeGesture();
  }, { passive: true });

  chartSliderWrapper.addEventListener("mousedown", (e) => {
    touchStartX = e.clientX;
  });

  chartSliderWrapper.addEventListener("mouseup", (e) => {
    touchEndX = e.clientX;
    handleSwipeGesture();
  });
}

function handleSwipeGesture() {
  const threshold = 40;
  if (touchStartX - touchEndX > threshold) {
    // Swipe Left -> Go to slide 1 (Bar Chart)
    goToSlide(1);
  } else if (touchEndX - touchStartX > threshold) {
    // Swipe Right -> Go to slide 0 (Doughnut Chart)
    goToSlide(0);
  }
}

function updateCharts() {
  updateDoughnutChart();
  updateBarChart();
}

function updateDoughnutChart() {
  const canvas = document.getElementById("expenseChart");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  const now = new Date();
  let targetMonth = now.toLocaleString("en-US", { month: "short" });
  let targetYear = now.getFullYear().toString();

  if (analyticsMonthSelect && analyticsMonthSelect.value === "previous") {
    now.setMonth(now.getMonth() - 1);
    targetMonth = now.toLocaleString("en-US", { month: "short" });
    targetYear = now.getFullYear().toString();
  }

  const expenseData = transactions.filter(t => {
    if (t.type !== "expense") return false;
    const parts = t.date.split(" / ");
    return parts.length === 3 && parts[1] === targetMonth && parts[2] === targetYear;
  });

  const categoryTotals = {};
  expenseData.forEach(t => { categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount; });

  const labels = Object.keys(categoryTotals);
  const dataValues = Object.values(categoryTotals);

  if (chartInstance) chartInstance.destroy();

  const neonPalette = ["#22c55e", "#3b82f6", "#f59e0b", "#ec4899", "#8b5cf6", "#14b8a6", "#ef4444"];

  chartInstance = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: labels.length > 0 ? labels : ["No Expenses"],
      datasets: [{
        data: dataValues.length > 0 ? dataValues : [1],
        backgroundColor: labels.length > 0 ? neonPalette.slice(0, labels.length) : ["#233120"],
        borderColor: "transparent",
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: { legend: { position: "bottom", labels: { color: getThemeTextColor(), font: { family: "Inter", size: 11 } } } }
    }
  });

  updateCategoryBreakdown(expenseData);
}

function updateBarChart() {
  const canvas = document.getElementById("expenseBarChart");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  const now = new Date();
  let targetMonth = now.toLocaleString("en-US", { month: "short" });
  let targetYear = now.getFullYear().toString();

  if (analyticsMonthSelect && analyticsMonthSelect.value === "previous") {
    now.setMonth(now.getMonth() - 1);
    targetMonth = now.toLocaleString("en-US", { month: "short" });
    targetYear = now.getFullYear().toString();
  }

  const expenseData = transactions.filter(t => {
    if (t.type !== "expense") return false;
    const parts = t.date.split(" / ");
    return parts.length === 3 && parts[1] === targetMonth && parts[2] === targetYear;
  });

  const categoryTotals = {};
  expenseData.forEach(t => { categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount; });

  const labels = Object.keys(categoryTotals);
  const dataValues = Object.values(categoryTotals);

  if (barChartInstance) barChartInstance.destroy();

  barChartInstance = new Chart(ctx, {
    type: "bar",
    data: {
      labels: labels.length > 0 ? labels : ["No Expenses"],
      datasets: [{
        label: "Spent",
        data: dataValues.length > 0 ? dataValues : [0],
        backgroundColor: "#22c55e",
        borderRadius: 8
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: { legend: { display: false } },
      scales: {
        x: { ticks: { color: getThemeTextColor(), font: { family: "Inter", size: 10 } }, grid: { display: false } },
        y: { ticks: { color: getThemeTextColor(), font: { family: "Inter", size: 10 } }, grid: { color: "rgba(255,255,255,0.08)" } }
      }
    }
  });
}


function getThemeTextColor() {
  return getComputedStyle(document.body).getPropertyValue("--text-main").trim() || "#f3f4f6";
}

function updateCategoryBreakdown(expenses) {
  const breakdown = document.getElementById("categoryBreakdown");
  const totalLabel = document.getElementById("totalExpenseLabel");
  if (!breakdown) return;

  const totalExpense = expenses.reduce((sum, t) => sum + Number(t.amount), 0);
  totalLabel.textContent = formatMoney(totalExpense);

  if (expenses.length === 0) {
    breakdown.innerHTML = `<div class="category-empty" style="text-align:center; color:var(--text-muted); padding:15px;">No expenses for selected period</div>`;
    return;
  }

  const categoryTotals = {};
  expenses.forEach(t => { categoryTotals[t.category] = (categoryTotals[t.category] || 0) + Number(t.amount); });

  const sorted = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1]);
  breakdown.innerHTML = sorted.map(([cat, amt]) => {
    const pct = totalExpense === 0 ? 0 : (amt / totalExpense) * 100;
    return `
      <div class="category-item" style="margin-bottom: 14px;">
        <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
          <span style="font-weight:600; font-size:0.9rem;">${cat} (${pct.toFixed(0)}%)</span>
          <span style="font-weight:700; font-size:0.9rem;">${formatMoney(amt)}</span>
        </div>
        <div style="width:100%; height:6px; background:rgba(255,255,255,0.07); border-radius:10px; overflow:hidden;">
          <div style="width:${pct}%; height:100%; background:linear-gradient(90deg, #22c55e, #4ade80);"></div>
        </div>
      </div>
    `;
  }).join("");
}

function populateMonthFilter() {
  monthFilter.innerHTML = `<option value="all">All Transactions</option>`;
  const months = new Set();
  transactions.forEach(t => {
    const parts = t.date.split(" / ");
    if (parts.length === 3) months.add(`${parts[1]} / ${parts[2]}`);
  });
  months.forEach(m => {
    const opt = document.createElement("option");
    opt.value = m;
    opt.textContent = m;
    monthFilter.appendChild(opt);
  });
}

monthFilter.addEventListener("change", () => {
  const val = monthFilter.value;
  if (val === "all") showExpense(transactions);
  else showExpense(transactions.filter(t => t.date.includes(val)));
});

menuBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  headerMenu.classList.toggle("show");
});

document.addEventListener("click", (e) => {
  if (!headerMenu.contains(e.target) && !menuBtn.contains(e.target)) {
    headerMenu.classList.remove("show");
  }
});

let currentThemeMode = localStorage.getItem("themeMode") || "dark";
function applyThemeMode(mode) {
  document.body.classList.remove("light-mode", "theme-navy", "theme-pink", "theme-sunny", "theme-cowboy", "theme-lavender");
  if (mode === "light") {
    document.body.classList.add("light-mode");
    profileThemeText.textContent = "Light Mode";
    themeText.textContent = "Light Mode";
  } else if (mode === "navy") {
    document.body.classList.add("theme-navy");
    profileThemeText.textContent = "Midnight Sea";
    themeText.textContent = "Midnight Sea";
  } else if (mode === "pink") {
    document.body.classList.add("theme-pink");
    profileThemeText.textContent = "Love";
    themeText.textContent = "Love";
  } else if (mode === "sunny") {
    document.body.classList.add("theme-sunny");
    profileThemeText.textContent = "Sunny";
    themeText.textContent = "Sunny";
  } else if (mode === "cowboy") {
    document.body.classList.add("theme-cowboy");
    profileThemeText.textContent = "Cowboy";
    themeText.textContent = "Cowboy";
  } else if (mode === "lavender") {
    document.body.classList.add("theme-lavender");
    profileThemeText.textContent = "Lavender";
    themeText.textContent = "Lavender";
  } else {
    profileThemeText.textContent = "Dark Mode";
    themeText.textContent = "Dark Mode";
  }
  localStorage.setItem("themeMode", mode);
  // Trigger fade for every theme including Sunny
  document.body.classList.remove("theme-fade");
  void document.body.offsetWidth; // restart animation
  document.body.classList.add("theme-fade");
  setTimeout(() => document.body.classList.remove("theme-fade"), 400);
  // Refresh charts so legend/axis colors match the new theme
  if (typeof updateCharts === "function" && (chartInstance || barChartInstance)) {
    setTimeout(updateCharts, 50);
  }
}
applyThemeMode(currentThemeMode);

profileThemeBtn.addEventListener("click", () => {
  if (currentThemeMode === "dark") currentThemeMode = "light";
  else if (currentThemeMode === "light") currentThemeMode = "navy";
  else if (currentThemeMode === "navy") currentThemeMode = "pink";
  else if (currentThemeMode === "pink") currentThemeMode = "sunny";
  else if (currentThemeMode === "sunny") currentThemeMode = "cowboy";
  else if (currentThemeMode === "cowboy") currentThemeMode = "lavender";
  else currentThemeMode = "dark";
  applyThemeMode(currentThemeMode);
});

if (themeBtn) {
  themeBtn.addEventListener("click", () => {
    if (currentThemeMode === "dark") currentThemeMode = "light";
    else if (currentThemeMode === "light") currentThemeMode = "navy";
    else if (currentThemeMode === "navy") currentThemeMode = "pink";
    else if (currentThemeMode === "pink") currentThemeMode = "sunny";
    else if (currentThemeMode === "sunny") currentThemeMode = "cowboy";
    else if (currentThemeMode === "cowboy") currentThemeMode = "lavender";
    else currentThemeMode = "dark";
    applyThemeMode(currentThemeMode);
  });
}

function updateProfile() {
  const user = auth.currentUser;
  if (!user) return;
  profileEmail.textContent = user.email;
  profileEmailRow.textContent = user.email;
  profileTransactions.textContent = transactions.length;
  profileIncome.textContent = formatMoney(transactions.filter(t => t.type === "income").reduce((s, t) => s + t.amount, 0));
  profileExpenses.textContent = formatMoney(transactions.filter(t => t.type === "expense").reduce((s, t) => s + t.amount, 0));
}

profileBtn.addEventListener("click", () => {
  headerMenu.classList.remove("show");
  homeSection.classList.remove("active-section");
  analyticsSection.classList.remove("active-section");
  budgetSection.classList.remove("active-section");
  aiSection.classList.remove("active-section");
  savingsSection.classList.remove("active-section");
  profileSection.classList.add("active-section");
  // Hide FAB on Profile
  const fab = document.getElementById("openTransactionModal");
  if (fab) fab.classList.add("hidden");
  updateProfile();
});

profileBackBtn.addEventListener("click", () => navHome.click());
profileLogoutBtn.addEventListener("click", () => logoutBtn.click());

changePasswordBtn.addEventListener("click", async () => {
  const user = auth.currentUser;
  if (!user || !user.email) return;
  try {
    await sendPasswordResetEmail(auth, user.email);
    showToast("Password reset email sent to " + user.email);
  } catch (error) { showToast(error.message, "error"); }
});

// CSV Export working across web & APK wrapper environments
exportDataBtn.addEventListener("click", () => {
  if (transactions.length === 0) return showToast("No transactions to export.", "error");
  const headers = ["Title", "Amount", "Note", "Type", "Category", "Date"];
  const rows = transactions.map(t => [t.title, t.amount, t.note || "", t.type, t.category, t.date]);
  const escapeCSV = value => `"${String(value ?? "").replaceAll('"', '""')}"`;
  const csv = [headers, ...rows].map(row => row.map(escapeCSV).join(",")).join("\n");
  
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  
  if (navigator.share && navigator.canShare && navigator.canShare({ files: [new File([blob], "spendwise-transactions.csv", { type: "text/csv" })] })) {
    navigator.share({
      files: [new File([blob], "spendwise-transactions.csv", { type: "text/csv" })],
      title: "SpendWISE Transactions CSV",
      text: "Your exported transaction history"
    }).catch(() => {});
  } else {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "spendwise-transactions.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
});

currencyBtn.addEventListener("click", () => currencyModal.classList.add("show"));
closeCurrencyModal.addEventListener("click", () => currencyModal.classList.remove("show"));

[
  [navHome, homeSection],
  [navAnalytics, analyticsSection, updateCharts],
  [navBudget, budgetSection, updateBudget],
  [navAi, aiSection],
  [navSavings, savingsSection, loadSavingsGoals]
].forEach(([btn, sec, cb]) => {
  btn.addEventListener("click", () => {
    [navHome, navAnalytics, navBudget, navAi, navSavings].forEach(b => b.classList.remove("active"));
    [homeSection, analyticsSection, budgetSection, profileSection, aiSection, savingsSection].forEach(s => s.classList.remove("active-section"));
    btn.classList.add("active");
    sec.classList.add("active-section");
    // Show FAB only on Home
    const fab = document.getElementById("openTransactionModal");
    if (fab) {
      if (sec === homeSection) fab.classList.remove("hidden");
      else fab.classList.add("hidden");
    }
    if (cb) cb();
  });
});

if (aiSendBtn && aiInput) {
  aiSendBtn.onclick = sendToAI;
  aiInput.onkeypress = (e) => { if (e.key === "Enter") sendToAI(); };
}

async function sendToAI() {
  const userQuery = aiInput.value.trim();
  if (!userQuery) return;

  if (!auth.currentUser) {
    appendMessage("Please log in to use SpendWISE AI. 🔒", "ai");
    return;
  }

  appendMessage(userQuery, "user");
  aiInput.value = "";
  aiInput.disabled = true;
  aiSendBtn.disabled = true;

  const loadingId = appendMessage("Thinking...", "ai");

  try {
    const totalIncome = transactions.filter(t => t.type === "income").reduce((sum, t) => sum + Number(t.amount || 0), 0);
    const totalExpense = transactions.filter(t => t.type === "expense").reduce((sum, t) => sum + Number(t.amount || 0), 0);
    const userBalance = totalIncome - totalExpense;

    const categorySummary = {};
    transactions.filter(t => t.type === "expense").forEach(t => {
      const cat = t.category || "Other";
      categorySummary[cat] = (categorySummary[cat] || 0) + Number(t.amount || 0);
    });

    const budgetPercentage = monthlyBudget > 0 ? ((totalExpense / monthlyBudget) * 100).toFixed(1) : "0";

    const systemPrompt = `
You are SpendWISE AI, a friendly and concise personal finance assistant.

The user's complete financial snapshot:
- Currency: ${getCurrency().name} (${getCurrency().symbol})
- Total income: ${formatMoney(totalIncome)}
- Total expenses: ${formatMoney(totalExpense)}
- Current balance: ${formatMoney(userBalance)}
- Monthly budget limit: ${monthlyBudget > 0 ? formatMoney(monthlyBudget) : "Not set"}
- Budget percentage used: ${budgetPercentage}%
- Category budget limits set: ${JSON.stringify(categoryBudgets)}
- Expense categories breakdown: ${JSON.stringify(categorySummary)}
- Savings goals active count: ${savingsGoals.length}
- Savings goals details: ${JSON.stringify(savingsGoals.map(g => ({ title: g.title, target: g.targetAmount, saved: g.savedAmount })))}

Provide realistic, practical budgeting suggestions based on this exact data, taking into account their total budget and specific category budget limits. Format your response cleanly using short paragraphs, bullet points, and relevant emojis. Avoid raw markdown symbols if possible.
`;

    const prompt = `${systemPrompt}\n\nUser's question:\n${userQuery}`;
    
    let result = null;
    let attempts = 0;
    while (attempts < 2) {
      try {
        result = await aiModel.generateContent(prompt);
        break;
      } catch (err) {
        attempts++;
        if (attempts >= 2) throw err;
        await new Promise(res => setTimeout(res, 1000));
      }
    }

    const aiReply = result.response.text();

    document.getElementById(loadingId)?.remove();
    appendMessage(aiReply || "I couldn't generate a response. Please try again. 🤖", "ai");
  } catch (error) {
    console.error("SpendWISE AI error:", error);
    document.getElementById(loadingId)?.remove();
    appendMessage("SpendWISE AI servers are temporarily busy right now. Please tap send to try again! 🔄", "ai");
  } finally {
    aiInput.disabled = false;
    aiSendBtn.disabled = false;
    aiInput.focus();
  }
}

function formatAIMessage(text) {
  if (!text) return "";
  let formatted = text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/^#+\s+(.*)$/gm, '<h4>$1</h4>')
    .replace(/^- (.*)$/gm, '<li>$1</li>')
    .replace(/\n/g, '<br>');

  if (formatted.includes('<li>')) {
    formatted = formatted.replace(/(<li>[\s\S]*?<\/li>)+/g, '<ul>$&</ul>');
  }
  return formatted;
}

function appendMessage(text, sender) {
  const wrapper = document.createElement("div");
  const msgId = "msg_" + Math.random();
  wrapper.id = msgId;
  wrapper.className = `message-wrapper ${sender === "user" ? "user-wrapper" : "ai-wrapper"}`;
  
  if (text === "Thinking...") {
    wrapper.innerHTML = `
      <div class="chat-avatar ${sender === "user" ? "user-avatar" : "ai-avatar"}">
        <i class="fa-solid ${sender === "user" ? "fa-user-tie" : "fa-robot"}"></i>
      </div>
      <div class="message ai-msg loading"><span></span><span></span><span></span></div>
    `;
  } else {
    const content = sender === "ai" ? formatAIMessage(text) : text;
    wrapper.innerHTML = `
      <div class="chat-avatar ${sender === "user" ? "user-avatar" : "ai-avatar"}">
        <i class="fa-solid ${sender === "user" ? "fa-user-tie" : "fa-robot"}"></i>
      </div>
      <div class="message ${sender === "user" ? "user-msg" : "ai-msg"}">${content}</div>
    `;
  }
  chatMessages.appendChild(wrapper);
  chatMessages.scrollTop = chatMessages.scrollHeight;
  return msgId;
}

let savingsGoals = [];
let activeCheckinGoalId = null;

async function loadSavingsGoals() {
  const user = auth.currentUser;
  if (!user) return;
  try {
    savingsGoals = [];
    const q = query(collection(db, "savingsGoals"), where("uid", "==", user.uid));
    const snap = await getDocs(q);
    snap.forEach(d => savingsGoals.push({ firestoreId: d.id, ...d.data() }));
    renderGoals();
  } catch (e) { console.error(e); }
}

const openGoalModalBtn = document.getElementById("openGoalModalBtn");
const goalModal = document.getElementById("goalModal");
const saveGoalBtn = document.getElementById("saveGoalBtn");
const cancelGoalBtn = document.getElementById("cancelGoalBtn");
const goalTitle = document.getElementById("goalTitle");
const goalTargetAmount = document.getElementById("goalTargetAmount");
const goalDailyTarget = document.getElementById("goalDailyTarget");
const goalsContainer = document.getElementById("goalsContainer");
const dailyPresetToggle = document.getElementById("dailyPresetToggle");

if (dailyPresetToggle) {
  dailyPresetToggle.addEventListener("click", (e) => {
    const btn = e.target.closest(".preset-pill");
    if (!btn) return;
    dailyPresetToggle.querySelectorAll(".preset-pill").forEach(p => p.classList.remove("active-pill", "on"));
    btn.classList.add("active-pill", "on");
    goalDailyTarget.value = btn.dataset.value;
  });
}

const checkinModal = document.getElementById("checkinModal");
const checkinGoalName = document.getElementById("checkinGoalName");
const checkinYesBtn = document.getElementById("checkinYesBtn");
const checkinNoBtn = document.getElementById("checkinNoBtn");
const checkinAmountWrapper = document.getElementById("checkinAmountWrapper");
const checkinAmount = document.getElementById("checkinAmount");
const checkinInitialBtns = document.getElementById("checkinInitialBtns");
const checkinSubmitBtns = document.getElementById("checkinSubmitBtns");
const submitCheckinBtn = document.getElementById("submitCheckinBtn");
const cancelCheckinBtn = document.getElementById("cancelCheckinBtn");

if (openGoalModalBtn) openGoalModalBtn.addEventListener("click", () => {
  goalModal.classList.add("show");
  if (goalDailyTarget && !goalDailyTarget.value) goalDailyTarget.value = "300";
});
if (cancelGoalBtn) cancelGoalBtn.addEventListener("click", () => goalModal.classList.remove("show"));

if (saveGoalBtn) {
  saveGoalBtn.addEventListener("click", async () => {
    const user = auth.currentUser;
    if (!user) return showToast("Please login first.", "error");
    const title = goalTitle.value.trim();
    const target = Number(goalTargetAmount.value);
    const daily = Number(goalDailyTarget.value) || 300;
    if (!title || !target || target <= 0) return showToast("Enter valid goal name and target.", "error");

    const newGoal = {
      uid: user.uid,
      title,
      targetAmount: target,
      dailyTarget: daily,
      savedAmount: 0,
      streak: 0,
      createdAt: new Date().toISOString()
    };

    try {
      const ref = await addDoc(collection(db, "savingsGoals"), newGoal);
      newGoal.firestoreId = ref.id;
      savingsGoals.push(newGoal);
      goalModal.classList.remove("show");
      goalTitle.value = ""; goalTargetAmount.value = ""; goalDailyTarget.value = "";
      renderGoals();
    } catch (e) { showToast(e.message, "error"); }
  });
}

function renderGoals() {
  if (!goalsContainer) return;
  if (savingsGoals.length === 0) {
    goalsContainer.innerHTML = `<p style="color: var(--text-muted); text-align:center; padding: 30px;">No savings goals yet.</p>`;
    return;
  }
  goalsContainer.innerHTML = "";
  savingsGoals.forEach(goal => {
    const isCompleted = goal.savedAmount >= goal.targetAmount;
    const percentage = Math.min(100, (goal.savedAmount / goal.targetAmount) * 100).toFixed(1);
    
    const remainingAmount = Math.max(0, goal.targetAmount - goal.savedAmount);
    const dailyRate = Number(goal.dailyTarget) || 300;
    const estimatedDays = Math.ceil(remainingAmount / dailyRate);

    const card = document.createElement("div");
    card.className = isCompleted ? "goal-card completed profile-card" : "goal-card profile-card";
    card.style.padding = "20px";

    if (isCompleted) {
      card.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:14px;">
          <div>
            <h3 style="font-size:1.15rem; font-weight:700; margin:0;">${goal.title}</h3>
            <span style="color:var(--text-muted); font-size:0.88rem;">Achieved: <strong>${formatMoney(goal.savedAmount)}</strong></span>
          </div>
          <button class="goal-delete-btn delBtn" data-delete-id="${goal.firestoreId}" style="padding:8px 12px; font-size:0.8rem; border-radius:12px; border:none; cursor:pointer;"><i class="fa-solid fa-trash-can"></i></button>
        </div>
        <h4 style="color:var(--accent-green-bright); margin-bottom:6px;"><i class="fa-solid fa-circle-check"></i> Goal completed!!</h4>
        <p style="color:var(--text-muted); font-size:0.88rem;">Now you can treat yourself to your reward!</p>
      `;
    } else {
      card.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:14px;">
          <div>
            <h3 style="font-size:1.15rem; font-weight:700; margin:0;">${goal.title}</h3>
            <span style="color:var(--text-muted); font-size:0.88rem;">Saved: <strong>${formatMoney(goal.savedAmount)}</strong> / ${formatMoney(goal.targetAmount)}</span>
          </div>
          <div style="display:flex; align-items:center; gap:8px;">
            <span style="background: rgba(34,197,94,0.12); color: var(--accent-green-bright); padding: 4px 10px; border-radius: 12px; font-size: 0.78rem; font-weight: 700;">${percentage}%</span>
            <button class="goal-delete-btn delBtn" data-delete-id="${goal.firestoreId}" style="padding:8px 12px; font-size:0.8rem; border-radius:12px; border:none; cursor:pointer;"><i class="fa-solid fa-trash-can"></i></button>
          </div>
        </div>
        
        <div style="background: var(--input-bg); border: 1px solid var(--card-border); border-radius: 16px; padding: 12px 14px; margin-bottom: 14px; display: flex; align-items: center; gap: 10px;">
          <i class="fa-solid fa-wand-magic-sparkles" style="color: var(--accent-green-bright); font-size: 1.1rem;"></i>
          <span style="font-size: 0.82rem; color: var(--text-main); line-height: 1.4;">
            At your <strong style="color: var(--accent-green-bright);">${formatMoney(dailyRate)}/day</strong> pace, you need about <strong style="color: var(--accent-green-bright);">${estimatedDays} days</strong> to reach this goal.
          </span>
        </div>

        <div style="width:100%; height:8px; background:var(--input-bg); border-radius:6px; overflow:hidden; margin:14px 0;">
          <div style="width:${percentage}%; height:100%; background:linear-gradient(90deg, #059669, #34D399);"></div>
        </div>

        <div style="display:flex; justify-content:space-between; align-items:center; margin-top:14px;">
          <span style="color:var(--text-muted); font-size:0.85rem;">🔥 Streak: <strong>${goal.streak || 0} days</strong></span>
          <button class="checkin-trigger-btn secondary-btn" data-id="${goal.firestoreId}" style="height:auto; padding:8px 14px; font-size:0.82rem; width:auto;">Did you save today?</button>
        </div>
      `;
    }
    goalsContainer.appendChild(card);
  });
}

if (goalsContainer) {
  goalsContainer.addEventListener("click", (e) => {
    const trigger = e.target.closest(".checkin-trigger-btn");
    if (trigger) {
      activeCheckinGoalId = trigger.dataset.id;
      const goal = savingsGoals.find(g => g.firestoreId === activeCheckinGoalId);
      if (!goal) return;
      checkinGoalName.textContent = `Goal: ${goal.title}`;
      checkinAmount.value = goal.dailyTarget;
      checkinAmountWrapper.style.display = "none";
      checkinInitialBtns.style.display = "flex";
      checkinSubmitBtns.style.display = "none";
      checkinModal.classList.add("show");
      return;
    }

    const del = e.target.closest(".goal-delete-btn");
    if (del) {
      const id = del.dataset.deleteId;
      if (confirm("Delete this savings goal?")) {
        deleteDoc(doc(db, "savingsGoals", id)).then(() => {
          savingsGoals = savingsGoals.filter(g => g.firestoreId !== id);
          renderGoals();
        });
      }
    }
  });
}

if (checkinNoBtn) checkinNoBtn.addEventListener("click", () => checkinModal.classList.remove("show"));
if (checkinYesBtn) checkinYesBtn.addEventListener("click", () => {
  checkinInitialBtns.style.display = "none";
  checkinAmountWrapper.style.display = "block";
  checkinSubmitBtns.style.display = "flex";
});
if (cancelCheckinBtn) cancelCheckinBtn.addEventListener("click", () => checkinModal.classList.remove("show"));

if (submitCheckinBtn) {
  submitCheckinBtn.addEventListener("click", async () => {
    const amt = Number(checkinAmount.value);
    const goal = savingsGoals.find(g => g.firestoreId === activeCheckinGoalId);
    if (!goal || isNaN(amt) || amt <= 0) return;
    goal.savedAmount += amt;
    goal.streak = (goal.streak || 0) + 1;
    await updateDoc(doc(db, "savingsGoals", goal.firestoreId), {
      savedAmount: goal.savedAmount,
      streak: goal.streak
    });
    checkinModal.classList.remove("show");
    renderGoals();
  });
}
