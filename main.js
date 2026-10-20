import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";
import { getAI, getGenerativeModel, GoogleAIBackend } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-ai.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";
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

// Category Limit Custom Modal Elements
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
      if (chartInstance) updateChart();
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
let customCategories = JSON.parse(localStorage.getItem("customCategories") || '["🍕 Food", "🛒 Shopping", "🚗 Transport", "🧾 Bills", "🎬 Entertainment", "💰 Salary", "💼 Business", "📱 Internet", "💻 Wifi", "🏷 Subscription", "✈ Travel", "🛍 Beauty", "🎁 Gift", "🐶 Pet", "💸 Investments", "🏠 Home"]');

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
    if (!name) return alert("Enter a category name.");
    if (!customCategories.includes(name)) {
      customCategories.push(name);
      localStorage.setItem("customCategories", JSON.stringify(customCategories));
      populateCategorySelects();
      renderCategoryBudgetsUI();
    }
    
    // --- ADD YOUR MESSAGE HERE ---
    const successMsg = document.createElement("div");
    successMsg.classList.add("successMsg")
    successMsg.textContent = "Category added! 🎉";
    successMsg.style.cssText = "position:fixed; bottom:150px; left:50%; transform:translateX(-50%); background:#22c55e; color:#061008; padding:10px 20px; border-radius:12px; font-weight:700; z-index:3000; box-shadow:0 5px 20px rgba(34,197,94,0.4); opacity:0.7";
    document.body.appendChild(successMsg);
    setTimeout(() => successMsg.remove(), 2000);
    // -----------------------------

    newCategoryName.value = "";
    categoryModal.classList.remove("show");
  });
}

let editingTransactionId = null;
let selectedTransactionForDetail = null;
let chartInstance = null;
const transactions = [];

// Auth
signupBtn.addEventListener("click", async () => {
  if (!email.value.trim() || !password.value) return alert("Enter email and password.");
  try {
    await createUserWithEmailAndPassword(auth, email.value, password.value);
    alert("Account created successfully!");
    email.value = ""; password.value = "";
  } catch (error) { alert(error.message); }
});

loginBtn.addEventListener("click", async () => {
  if (!email.value.trim() || !password.value) return alert("Enter email and password.");
  try {
    await signInWithEmailAndPassword(auth, email.value, password.value);
    email.value = ""; password.value = "";
  } catch (error) { alert(error.message); }
});

logoutBtn.addEventListener("click", async () => {
  try { await signOut(auth); transactions.length = 0; } catch (error) { alert(error.message); }
});

onAuthStateChanged(auth, async (user) => {
  if (user) {
    authSection.style.display = "none";
    homeSection.classList.add("active-section");
    analyticsSection.classList.remove("active-section");
    budgetSection.classList.remove("active-section");
    profileSection.classList.remove("active-section");
    aiSection.classList.remove("active-section");
    savingsSection.classList.remove("active-section");
    
    // Show footer nav cleanly
    footerNav.style.display = "flex";
    footerNav.classList.add("show-nav");

    navHome.classList.add("active");
    navAnalytics.classList.remove("active");
    navBudget.classList.remove("active");
    navAi.classList.remove("active");
    navSavings.classList.remove("active");

    await loadTransactions();
    await loadBudget(user);
    await loadCategoryBudgets(user);
  } else {
    authSection.style.display = "flex";
    homeSection.classList.remove("active-section");
    analyticsSection.classList.remove("active-section");
    budgetSection.classList.remove("active-section");
    profileSection.classList.remove("active-section");
    aiSection.classList.remove("active-section");
    savingsSection.classList.remove("active-section");
    
    footerNav.style.display = "none";
    footerNav.classList.remove("show-nav");
  }
});


// Transactions Modal Binding
if (openTransactionModal) openTransactionModal.addEventListener("click", () => transactionModal.classList.add("show"));
if (closeTransactionModal) closeTransactionModal.addEventListener("click", () => transactionModal.classList.remove("show"));
transactionModal.addEventListener("click", (e) => { if (e.target === transactionModal) transactionModal.classList.remove("show"); });

addBtn.addEventListener("click", async () => {
  if (!expenseName.value.trim() || !amount.value) return alert("Please enter a title and amount.");
  const user = auth.currentUser;
  if (!user) return alert("Please login first.");

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

    populateMonthFilter();
    updateBalance();
    updateBudget();
    showExpense();
    updateProfile();

    expenseName.value = "";
    amount.value = "";
    if (expenseNote) expenseNote.value = "";
    if (chartInstance) updateChart();
  } catch (error) { alert(error.message); }
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
    expenseList.innerHTML = `<img src="coins.png" style="width:64px; margin: 20px auto; display:block;"> <h5 style="text-align:center; color:var(--text-muted);">Add Transaction To Get Started</h5>`;
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
    if (chartInstance) updateChart();
  } catch (error) { alert(error.message); }
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
    if (chartInstance) updateChart();
  } catch (error) { alert(error.message); }
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
}

searchBar.addEventListener("input", () => {
  const q = searchBar.value.toLowerCase().trim();
  const res = transactions.filter(t => t.title.toLowerCase().includes(q) || t.category.toLowerCase().includes(q) || (t.note && t.note.toLowerCase().includes(q)));
  showExpense(res);
});

// Budgeting & Category Budgets
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

  // Sort categories: those with a set budget limit come first
  const sortedCategories = [...customCategories].sort((a, b) => {
    const limitA = categoryBudgets[a] || 0;
    const limitB = categoryBudgets[b] || 0;
    // If A has a limit and B doesn't, A comes first (-1)
    if (limitA > 0 && limitB === 0) return -1;
    // If B has a limit and A doesn't, B comes first (1)
    if (limitA === 0 && limitB > 0) return 1;
    return 0; // Keep original order otherwise
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

  // Re-attach event listeners for edit and delete buttons...
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

saveBudgetBtn.addEventListener("click", () => {
  const val = Number(budgetInput.value);
  if (!val || val <= 0) return alert("Enter valid budget.");
  monthlyBudget = val;
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

// Analytics & Charts
if (analyticsMonthSelect) analyticsMonthSelect.addEventListener("change", updateChart);

function updateChart() {
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
        borderColor: "#141a13",
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { position: "bottom", labels: { color: "limegreen", font: { family: "Inter", size: 12 } } } }
    }
  });

  updateCategoryBreakdown(expenseData);
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

// Menu Dropdown & Themes
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
  document.body.classList.remove("light-mode", "theme-navy", "theme-pink");
  if (mode === "light") {
    document.body.classList.add("light-mode");
    profileThemeText.textContent = "Light Mode";
    themeText.textContent = "Light Mode";
    themeIcon.className = "fa-solid fa-sun";
  } else if (mode === "navy") {
    document.body.classList.add("theme-navy");
    profileThemeText.textContent = "Navy Blue";
    themeText.textContent = "Navy Blue";
    themeIcon.className = "fa-solid fa-water";
  } else if (mode === "pink") {
    document.body.classList.add("theme-pink");
    profileThemeText.textContent = "Pink & White";
    themeText.textContent = "Pink & White";
    themeIcon.className = "fa-solid fa-heart";
  } else {
    profileThemeText.textContent = "Dark Mode";
    themeText.textContent = "Dark Mode";
    themeIcon.className = "fa-solid fa-moon";
  }
  localStorage.setItem("themeMode", mode);
}
applyThemeMode(currentThemeMode);

profileThemeBtn.addEventListener("click", () => {
  if (currentThemeMode === "dark") currentThemeMode = "light";
  else if (currentThemeMode === "light") currentThemeMode = "navy";
  else if (currentThemeMode === "navy") currentThemeMode = "pink";
  else currentThemeMode = "dark";
  applyThemeMode(currentThemeMode);
});

if (themeBtn) {
  themeBtn.addEventListener("click", () => {
    if (currentThemeMode === "dark") currentThemeMode = "light";
    else if (currentThemeMode === "light") currentThemeMode = "navy";
    else if (currentThemeMode === "navy") currentThemeMode = "pink";
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
  updateProfile();
});

profileBackBtn.addEventListener("click", () => navHome.click());
profileLogoutBtn.addEventListener("click", () => logoutBtn.click());

changePasswordBtn.addEventListener("click", async () => {
  const user = auth.currentUser;
  if (!user || !user.email) return;
  try {
    await sendPasswordResetEmail(auth, user.email);
    alert("Password reset email sent to " + user.email);
  } catch (error) { alert(error.message); }
});

exportDataBtn.addEventListener("click", () => {
  if (transactions.length === 0) return alert("No transactions to export.");
  const headers = ["Title", "Amount", "Note", "Type", "Category", "Date"];
  const rows = transactions.map(t => [t.title, t.amount, t.note || "", t.type, t.category, t.date]);
  const escapeCSV = value => `"${String(value ?? "").replaceAll('"', '""')}"`;
  const csv = [headers, ...rows].map(row => row.map(escapeCSV).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "spendwise-transactions.csv";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
});

currencyBtn.addEventListener("click", () => currencyModal.classList.add("show"));
closeCurrencyModal.addEventListener("click", () => currencyModal.classList.remove("show"));

// Navigation Tabs
[
  [navHome, homeSection],
  [navAnalytics, analyticsSection, updateChart],
  [navBudget, budgetSection, updateBudget],
  [navAi, aiSection],
  [navSavings, savingsSection, loadSavingsGoals]
].forEach(([btn, sec, cb]) => {
  btn.addEventListener("click", () => {
    [navHome, navAnalytics, navBudget, navAi, navSavings].forEach(b => b.classList.remove("active"));
    [homeSection, analyticsSection, budgetSection, profileSection, aiSection, savingsSection].forEach(s => s.classList.remove("active-section"));
    btn.classList.add("active");
    sec.classList.add("active-section");
    if (cb) cb();
  });
});

// AI Advisor Chat with Complete Financial Context, Markdown Parser & Auto-retry
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

    const systemPrompt = `
You are SpendWISE AI, a friendly and concise personal finance assistant.

The user's current complete financial snapshot:
- Currency: ${getCurrency().name} (${getCurrency().symbol})
- Total income: ${formatMoney(totalIncome)}
- Total expenses: ${formatMoney(totalExpense)}
- Current balance: ${formatMoney(userBalance)}
- Monthly budget: ${monthlyBudget > 0 ? formatMoney(monthlyBudget) : "Not set"}
- Expense categories breakdown: ${JSON.stringify(categorySummary)}
- Savings goals active count: ${savingsGoals.length}

Provide realistic, practical budgeting suggestions based on this exact data. Format your response cleanly using short paragraphs, bullet points, and relevant emojis. Avoid raw markdown symbols if possible.
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

// Savings Goals Logic with Preset Target Wiring & Badge Pace Indicator
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
    if (!user) return alert("Please login first.");
    const title = goalTitle.value.trim();
    const target = Number(goalTargetAmount.value);
    const daily = Number(goalDailyTarget.value) || 300;
    if (!title || !target || target <= 0) return alert("Enter valid goal name and target.");

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
    } catch (e) { alert(e.message); }
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
