// ===============================
// FIREBASE IMPORTS
// ===============================

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";

import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  getDoc,
  deleteDoc,
  updateDoc,
  doc,
  query,
  where,
  setDoc
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";

// ===============================
// FIREBASE CONFIG
// ===============================

const firebaseConfig = {
  apiKey: "AIzaSyDbjHCHaRhcwBNFCyphhW7fPkGqPXxoZPM",
  authDomain: "spendwise-a662a.firebaseapp.com",
  projectId: "spendwise-a662a",
  storageBucket: "spendwise-a662a.firebasestorage.app",
  messagingSenderId: "310761626417",
  appId: "1:310761626417:web:6f7d664eec15a289112e10",
  measurementId: "G-YQRVKCBTR5"
};

// ===============================
// INITIALIZE FIREBASE
// ===============================

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// ===============================
// DOM ELEMENTS
// ===============================

// Auth
const email = document.getElementById("email");
const password = document.getElementById("password");

const signupBtn = document.getElementById("signupBtn");
const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");

const authSection = document.getElementById("authSection");

// App sections
const homeSection = document.getElementById("homeSection");
const analyticsSection = document.getElementById("analyticsSection");
const budgetSection = document.getElementById("budgetSection");
const profileSection = document.getElementById("profileSection");

const footerNav = document.querySelector(".footer-nav");

// Navigation
const navHome = document.getElementById("navHome");
const navAnalytics = document.getElementById("navAnalytics");
const navBudget = document.getElementById("navBudget");

// Transaction form
const expenseName = document.getElementById("expenseName");
const amount = document.getElementById("expenseAmount");
const addBtn = document.getElementById("addBtn");

const expenseList = document.getElementById("expenseList");

const type = document.getElementById("type");
const category = document.getElementById("category");

// Balance
const incomeDisplay = document.getElementById("income");
const expenseDisplay = document.getElementById("expense");
const total = document.getElementById("balance");

// Search
const monthFilter = document.getElementById("monthFilter");
const searchBar = document.getElementById("searchBar");

const editModal = document.getElementById("editModal");
const editTitle = document.getElementById("editTitle");
const editAmount = document.getElementById("editAmount");
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

// Profile DOM
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
const currencyOptions = document.querySelectorAll(".currency-option");

// =====================================
// CURRENCY
// =====================================

const currencies = {
  INR: { name: "Indian Rupee", symbol: "₹", code: "INR" },
  USD: { name: "US Dollar", symbol: "$", code: "USD" },
  GBP: { name: "British Pound", symbol: "£", code: "GBP" },
  EUR: { name: "Euro", symbol: "€", code: "EUR" }
};

let selectedCurrency = localStorage.getItem("currency") || "INR";

function getCurrency() {
  return currencies[selectedCurrency] || currencies.INR;
}

function formatMoney(amount) {
  const currency = getCurrency();
  return `${currency.symbol}${formatINR(amount)}`;
}

function updateCurrencyUI() {
  const currency = getCurrency();
  currencyText.textContent = `${currency.name} (${currency.symbol} ${currency.code})`;
  
  currencyOptions.forEach(option => {
    option.classList.toggle(
      "selected",
      option.dataset.currency === selectedCurrency
    );
  });
}

// Open currency modal
currencyBtn.addEventListener("click", () => {
  updateCurrencyUI();
  currencyModal.classList.add("show");
});

// Close currency modal
closeCurrencyModal.addEventListener("click", () => {
  currencyModal.classList.remove("show");
});

// Close when clicking outside
currencyModal.addEventListener("click", (e) => {
  if (e.target === currencyModal) {
    currencyModal.classList.remove("show");
  }
});

// Select currency
currencyOptions.forEach(option => {
  option.addEventListener("click", () => {
    selectedCurrency = option.dataset.currency;
    localStorage.setItem("currency", selectedCurrency);
    updateCurrencyUI();
    
    // Refresh displayed values
    updateBalance();
    updateBudget();
    if (chartInstance) {
      updateChart();
    }
    updateProfile();
    showExpense();
    
    currencyModal.classList.remove("show");
  });
});

// Load saved currency
updateCurrencyUI(); 

let editingTransactionId = null;
let chartInstance = null;

// ===============================
// TRANSACTIONS ARRAY
// ===============================

const transactions = [];
let result;

// ===============================
// SIGN UP
// ===============================

signupBtn.addEventListener("click", async () => {
  if (email.value.trim() === "" || password.value === "") {
    alert("Please enter your email and password.");
    return;
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email.value,
      password.value
    );
    alert("Account created successfully!");
    email.value = "";
    password.value = "";
  } catch (error) {
    alert(error.message);
  }
});

// ===============================
// LOGIN
// ===============================

loginBtn.addEventListener("click", async () => {
  if (email.value.trim() === "" || password.value === "") {
    alert("Please enter your email and password.");
    return;
  }

  try {
    await signInWithEmailAndPassword(
      auth,
      email.value,
      password.value
    );
    email.value = "";
    password.value = "";
  } catch (error) {
    alert(error.message);
  }
});

// ===============================
// LOGOUT
// ===============================

logoutBtn.addEventListener("click", async () => {
  try {
    await signOut(auth);
    transactions.length = 0;
  } catch (error) {
    alert(error.message);
  }
});

// ===============================
// AUTH STATE
// ===============================

onAuthStateChanged(auth, async (user) => {
  if (user) {
    authSection.style.display = "none";

    // Show Home & hide others
    homeSection.classList.add("active-section");
    analyticsSection.classList.remove("active-section");
    budgetSection.classList.remove("active-section");
    profileSection.classList.remove("active-section");

    footerNav.style.display = "flex";

    navHome.classList.add("active");
    navAnalytics.classList.remove("active");
    navBudget.classList.remove("active");

    await loadTransactions();
    await loadBudget(user);
  } else {
    authSection.style.display = "flex";

    homeSection.classList.remove("active-section");
    analyticsSection.classList.remove("active-section");
    budgetSection.classList.remove("active-section");
    profileSection.classList.remove("active-section");

    footerNav.style.display = "none";
  }
});

// ===============================
// ADD TRANSACTION
// ===============================

addBtn.addEventListener("click", async () => {
  if (expenseName.value.trim() === "" || amount.value === "") {
    return;
  }

  const user = auth.currentUser;
  if (!user) {
    alert("Please login first.");
    return;
  }

  const now = new Date();
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const transaction = {
    uid: user.uid,
    id: Date.now(),
    title: expenseName.value.trim(),
    amount: Number(amount.value),
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

    if (chartInstance) {
      updateChart();
    }
  } catch (error) {
    alert(error.message);
    console.error(error);
  }
});

const typeSelect = document.getElementById("type");
const typeToggle = document.getElementById("typeToggle");

typeToggle.addEventListener("click", (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;
  
  typeToggle.querySelectorAll("button").forEach((b) => b.classList.remove("on"));
  btn.classList.add("on");
  typeSelect.value = btn.dataset.value;
});

// ===============================
// LOAD USER TRANSACTIONS
// ===============================

async function loadTransactions() {
  const user = auth.currentUser;
  if (!user) return;

  try {
    transactions.length = 0;
    incomeDisplay.textContent = "Loading..."
    expenseDisplay.textContent = "Loading..."
    total.textContent = "Loading..."
    const q = query(collection(db, "transactions"), where("uid", "==", user.uid));
    const snapshot = await getDocs(q);

    snapshot.forEach((document) => {
      transactions.push({
        firestoreId: document.id,
        ...document.data()
      });
    });

    populateMonthFilter();
    showExpense();
    updateBalance();
    updateProfile();
  } catch (error) {
    console.error("Error loading transactions:", error);
    alert(error.message);
  }
}

// ===============================
// SHOW TRANSACTIONS
// ===============================

function showExpense(listToDisplay = transactions) {
  expenseList.innerHTML = "";

  if (listToDisplay.length === 0) {
    expenseList.innerHTML = `<img src="coins.png"> <h5>Add Transaction To Get Started</h5>`;
    return;
  }

  listToDisplay.forEach((transaction) => {
    const card = document.createElement("div");
    card.classList.add("list");

    const delBtn = document.createElement("button");
    delBtn.classList.add("delBtn");
    delBtn.textContent = "Delete";
    delBtn.dataset.firestoreId = transaction.firestoreId;

    const editBtn = document.createElement("button");
    editBtn.classList.add("editBtn");
    editBtn.textContent = "Edit";
    editBtn.dataset.firestoreId = transaction.firestoreId;

    if (transaction.type === "income") {
      card.style.borderLeft = "5px solid limegreen";
    } else {
      card.style.borderLeft = "5px solid red";
    }

    card.innerHTML = `
      <div class="left">
        <h4>${transaction.title}</h4>
        <p>${transaction.category} • ${transaction.date}</p>
      </div>
      <div class="right">
        <h3 class="${transaction.type}">
          ${transaction.type === "income" ? "+" : "-"}${formatMoney(transaction.amount)}
        </h3>
      </div>
    `;

    expenseList.appendChild(card);
    card.appendChild(delBtn);
    card.appendChild(editBtn);
  });
}

// ===============================
// EDIT + DELETE TRANSACTION
// ===============================

expenseList.addEventListener("click", async (e) => {
  if (e.target.matches(".editBtn")) {
    const firestoreId = e.target.dataset.firestoreId;
    const transaction = transactions.find(t => t.firestoreId === firestoreId);
    if (!transaction) return;
    
    editingTransactionId = firestoreId;
    editTitle.value = transaction.title;
    editAmount.value = transaction.amount;
    editType.value = transaction.type;
    editCategory.value = transaction.category;
    editModal.style.display = "flex";
    return;
  }
  
  if (e.target.matches(".delBtn")) {
    const firestoreId = e.target.dataset.firestoreId;
    if (!firestoreId) return;
    
    try {
      await deleteDoc(doc(db, "transactions", firestoreId));
      const index = transactions.findIndex(t => t.firestoreId === firestoreId);
      if (index !== -1) {
        transactions.splice(index, 1);
      }
      populateMonthFilter();
      updateBalance();
      updateBudget();
      filteredList();
      updateProfile();
      if (chartInstance) {
        updateChart();
      }
    } catch (error) {
      alert(error.message);
      console.error(error);
    }
  }
});

saveEditBtn.addEventListener("click", async () => {
  if (!editingTransactionId) return;
  if (editTitle.value.trim() === "" || editAmount.value === "") return;
  
  const updatedData = {
    title: editTitle.value.trim(),
    amount: Number(editAmount.value),
    type: editType.value,
    category: editCategory.value
  };
  
  try {
    await updateDoc(doc(db, "transactions", editingTransactionId), updatedData);
    const transaction = transactions.find(t => t.firestoreId === editingTransactionId);
    if (transaction) {
      transaction.title = updatedData.title;
      transaction.amount = updatedData.amount;
      transaction.type = updatedData.type;
      transaction.category = updatedData.category;
    }
    populateMonthFilter();
    showExpense();
    updateBalance();
    updateBudget();
    updateProfile();
    
    if (chartInstance) {
      updateChart();
    }
    
    editModal.style.display = "none";
    editingTransactionId = null;
  } catch (error) {
    console.error(error);
    alert(error.message);
  }
});

cancelEditBtn.addEventListener("click", () => {
  editModal.style.display = "none";
  editingTransactionId = null;
});

// ===============================
// UPDATE BALANCE
// ===============================

function updateBalance() {
  const income = transactions.reduce((sum, t) => {
    return t.type === "income" ? sum + t.amount : sum;
  }, 0);

  incomeDisplay.textContent = `+ ${formatMoney(income)}`;

  const expense = transactions.reduce((sum, t) => {
    return t.type === "expense" ? sum + t.amount : sum;
  }, 0);

  expenseDisplay.textContent = `- ${formatMoney(expense)}`;

  const balance = income - expense;
  total.textContent = `${formatMoney(balance)}`;
}

function formatINR(n) {
  return Number(n).toLocaleString("en-IN");
}

// ===============================
// SEARCH
// ===============================

searchBar.addEventListener("input", filteredList);

function filteredList() {
  const search = searchBar.value.toLowerCase().trim();

  result = transactions.filter(
    (transaction) =>
      transaction.title.toLowerCase().includes(search) ||
      transaction.category.toLowerCase().includes(search) ||
      transaction.type.toLowerCase().includes(search)
  );

  if (result.length === 0) {
    expenseList.innerHTML = `<img src="coins.png"> <h5>No Transactions...</h5>`;
    return;
  }

  showExpense(result);
}

// ===============================
// NAVIGATION HANDLERS (WITH PROFILE HIDDEN)
// ===============================

navHome.addEventListener("click", () => {
  navHome.classList.add("active");
  navAnalytics.classList.remove("active");
  navBudget.classList.remove("active");

  homeSection.classList.add("active-section");
  analyticsSection.classList.remove("active-section");
  budgetSection.classList.remove("active-section");
  profileSection.classList.remove("active-section"); // FIX: hides profile
});

navAnalytics.addEventListener("click", () => {
  navAnalytics.classList.add("active");
  navHome.classList.remove("active");
  navBudget.classList.remove("active");

  analyticsSection.classList.add("active-section");
  homeSection.classList.remove("active-section");
  budgetSection.classList.remove("active-section");
  profileSection.classList.remove("active-section"); // FIX: hides profile

  updateChart();
});

navBudget.addEventListener("click", () => {
  navBudget.classList.add("active");
  navHome.classList.remove("active");
  navAnalytics.classList.remove("active");

  budgetSection.classList.add("active-section");
  homeSection.classList.remove("active-section");
  analyticsSection.classList.remove("active-section");
  profileSection.classList.remove("active-section"); // FIX: hides profile

  updateBudget();
});

// ===============================
// CHART & CATEGORY BREAKDOWN
// ===============================

function updateChart() {
  const canvas = document.getElementById("expenseChart");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  const expenseData = transactions.filter(t => t.type === "expense");

  const categoryTotals = {};
  expenseData.forEach((transaction) => {
    categoryTotals[transaction.category] =
      (categoryTotals[transaction.category] || 0) + transaction.amount;
  });

  const labels = Object.keys(categoryTotals);
  const dataValues = Object.values(categoryTotals);

  if (chartInstance) {
    chartInstance.destroy();
  }

  const neonPalette = [
    "#22c55e", "#3b82f6", "#f59e0b",
    "#ec4899", "#8b5cf6", "#14b8a6", "#ef4444"
  ];

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
      plugins: {
        legend: {
          position: "bottom",
          labels: {
            color: "limegreen",
            font: { family: "Inter", size: 12 }
          }
        }
      }
    }
  });

  updateCategoryBreakdown();
}

function updateCategoryBreakdown() {
  const breakdown = document.getElementById("categoryBreakdown");
  const totalLabel = document.getElementById("totalExpenseLabel");
  if (!breakdown) return;

  const expenses = transactions.filter(t => t.type === "expense");
  const totalExpense = expenses.reduce((sum, t) => sum + Number(t.amount), 0);

  totalLabel.textContent = formatMoney(totalExpense);

  if (expenses.length === 0) {
    breakdown.innerHTML = `<div class="category-empty">No expenses yet</div>`;
    return;
  }

  const categoryTotals = {};
  expenses.forEach((t) => {
    const category = t.category || "Other";
    categoryTotals[category] = (categoryTotals[category] || 0) + Number(t.amount);
  });

  const sortedCategories = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1]);

  breakdown.innerHTML = sortedCategories.map(([category, amount]) => {
    const percentage = totalExpense === 0 ? 0 : (amount / totalExpense) * 100;
    return `
      <div class="category-item">
        <div class="category-top">
          <div>
            <div class="category-name">${category}</div>
            <div class="category-percent">${percentage.toFixed(0)}%</div>
          </div>
          <div class="category-amount">${formatMoney(amount)}</div>
        </div>
        <div class="category-progress">
          <div class="category-progress-bar" style="width: ${percentage}%"></div>
        </div>
      </div>
    `;
  }).join("");
}

function populateMonthFilter() {
  monthFilter.innerHTML = `<option value="all">All Transactions</option>`;
  const months = new Set();

  transactions.forEach((transaction) => {
    const parts = transaction.date.split(" / ");
    if (parts.length === 3) {
      months.add(`${parts[1]} / ${parts[2]}`);
    }
  });

  months.forEach((monthYear) => {
    const option = document.createElement("option");
    option.value = monthYear;
    option.textContent = monthYear;
    monthFilter.appendChild(option);
  });
}

function filterByMonth() {
  const selectedMonth = monthFilter.value;
  if (selectedMonth === "all") {
    showExpense(transactions);
    return;
  }

  const filtered = transactions.filter((transaction) => {
    const parts = transaction.date.split(" / ");
    if (parts.length !== 3) return false;
    return `${parts[1]} / ${parts[2]}` === selectedMonth;
  });

  showExpense(filtered);
}
monthFilter.addEventListener("change", filterByMonth);

// ===============================
// BUDGET
// ===============================

let monthlyBudget = 0;

function updateBudget() {
  if (monthlyBudget <= 0) {
    budgetAmount.textContent = formatMoney(0);
    budgetSpent.textContent = formatMoney(0);
    budgetRemaining.textContent = formatMoney(0);
    budgetProgress.style.width = "0%";
    budgetStatus.textContent = "Set your monthly budget";
    return;
  }
  
  const now = new Date();
  const currentMonth = now.toLocaleString("en-US", {
    month: "short"
  });
  const currentYear = now.getFullYear().toString();
  
  let spent = 0;
  
  transactions.forEach((transaction) => {
    if (transaction.type !== "expense") return;
    
    const parts = transaction.date.split(" / ");
    if (parts.length !== 3) return;
    
    if (
      parts[1] === currentMonth &&
      parts[2] === currentYear
    ) {
      spent += Number(transaction.amount);
    }
  });
  
  const remaining = monthlyBudget - spent;
  const percentage = (spent / monthlyBudget) * 100;
  
  budgetAmount.textContent = formatMoney(monthlyBudget);
  budgetSpent.textContent = formatMoney(spent);
  
  budgetRemaining.textContent =
    remaining >= 0 ?
    formatMoney(remaining) :
    `-${formatMoney(Math.abs(remaining))}`;
  
  const progress = Math.min(Math.max(percentage, 0), 100);
  budgetProgress.style.width = `${progress}%`;
  
  if (percentage >= 100) {
    budgetStatus.textContent = "Budget exceeded";
  } else if (percentage >= 80) {
    budgetStatus.textContent = "You're close to your budget";
  } else {
    budgetStatus.textContent =
      `${percentage.toFixed(0)}% of budget used`;
  }
}


async function saveBudget() {
  const user = auth.currentUser;
  
  if (!user) {
    alert("Please login first.");
    return;
  }
  
  const value = Number(budgetInput.value);
  
  if (!value || value <= 0) {
    alert("Enter a valid budget.");
    return;
  }
  
  const now = new Date();
  
  const month = now.toLocaleString("en-US", {
    month: "short"
  });
  
  const year = now.getFullYear();
  
  // Unique budget document for THIS user + month + year
  const budgetId = `${user.uid}_${month}_${year}`;
  
  try {
    await setDoc(
      doc(db, "budgets", budgetId),
      {
        uid: user.uid,
        month: month,
        year: year,
        amount: value
      }
    );
    
    monthlyBudget = value;
    
    updateBudget();
    
    budgetModal.style.display = "none";
    budgetInput.value = "";
    
  } catch (error) {
    console.error("Error saving budget:", error);
    alert("Unable to save budget.");
  }
}


async function loadBudget(user) {
  if (!user) {
    monthlyBudget = 0;
    updateBudget();
    return;
  }
  
  // IMPORTANT:
  // Reset the previous user's budget first.
  monthlyBudget = 0;
  updateBudget();
  
  const now = new Date();
  
  const month = now.toLocaleString("en-US", {
    month: "short"
  });
  
  const year = now.getFullYear();
  
  // Must be identical to saveBudget()
  const budgetId = `${user.uid}_${month}_${year}`;
  
  try {
    const budgetRef = doc(db, "budgets", budgetId);
    
    const snapshot = await getDoc(budgetRef);
    
    if (snapshot.exists()) {
      const data = snapshot.data();
      
      // Extra safety: make sure this document actually belongs
      // to the currently logged-in user.
      if (data.uid === user.uid) {
        monthlyBudget = Number(data.amount) || 0;
      } else {
        monthlyBudget = 0;
      }
    } else {
      monthlyBudget = 0;
    }
    
    updateBudget();
    
  } catch (error) {
    console.error("Error loading budget:", error);
    monthlyBudget = 0;
    updateBudget();
  }
}
// =====================================
// TRANSACTION MODAL
// =====================================

const transactionModal = document.getElementById("transactionModal");
const openTransactionModal = document.getElementById("openTransactionModal");
const closeTransactionModal = document.getElementById("closeTransactionModal");

if (openTransactionModal) {
  openTransactionModal.addEventListener("click", () => {
    transactionModal.classList.add("show");
  });
}

if (closeTransactionModal) {
  closeTransactionModal.addEventListener("click", () => {
    transactionModal.classList.remove("show");
  });
}

transactionModal.addEventListener("click", (e) => {
  if (e.target === transactionModal) {
    transactionModal.classList.remove("show");
  }
});

const menuBtn = document.getElementById("menuBtn");
const headerMenu = document.getElementById("headerMenu");

menuBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  headerMenu.classList.toggle("show");
});

document.addEventListener("click", (e) => {
  if (!headerMenu.contains(e.target) && !menuBtn.contains(e.target)) {
    headerMenu.classList.remove("show");
  }
});

const themeBtn = document.getElementById("themeBtn");
const themeIcon = document.getElementById("themeIcon");
const themeText = document.getElementById("themeText");

themeBtn.addEventListener("click", () => {
  document.body.classList.toggle("light-mode");
  const isLight = document.body.classList.contains("light-mode");

  if (isLight) {
    themeIcon.className = "fa-solid fa-sun";
    themeText.textContent = "Light Mode";
  } else {
    themeIcon.className = "fa-solid fa-moon";
    themeText.textContent = "Dark Mode";
  }

  localStorage.setItem("theme", isLight ? "light" : "dark");
  syncProfileTheme();
});

const savedTheme = localStorage.getItem("theme");
if (savedTheme === "light") {
  document.body.classList.add("light-mode");
  themeIcon.className = "fa-solid fa-sun";
  themeText.textContent = "Light Mode";
}

// =====================================
// PROFILE
// =====================================

function updateProfile() {
  const user = auth.currentUser;
  if (!user) return;

  profileEmail.textContent = user.email || "No email";
  profileEmailRow.textContent = user.email || "No email";
  profileTransactions.textContent = transactions.length;

  const income = transactions
    .filter(t => t.type === "income")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const expenses = transactions
    .filter(t => t.type === "expense")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  profileIncome.textContent = `${formatMoney(income)}`;
  profileExpenses.textContent = `${formatMoney(expenses)}`;
}

function syncProfileTheme() {
  const isLight = document.body.classList.contains("light-mode");

  if (isLight) {
    profileThemeIcon.className = "fa-solid fa-sun";
    profileThemeText.textContent = "Light Mode";
  } else {
    profileThemeIcon.className = "fa-solid fa-moon";
    profileThemeText.textContent = "Dark Mode";
  }
}

function showProfile() {
  homeSection.classList.remove("active-section");
  analyticsSection.classList.remove("active-section");
  budgetSection.classList.remove("active-section");
  profileSection.classList.add("active-section");

  navHome.classList.remove("active");
  navAnalytics.classList.remove("active");
  navBudget.classList.remove("active");

  updateProfile();
  syncProfileTheme();

  headerMenu.classList.remove("show");
}

profileBtn.addEventListener("click", showProfile);

profileBackBtn.addEventListener("click", () => {
  navHome.click();
});

profileLogoutBtn.addEventListener("click", () => {
  logoutBtn.click();
});

changePasswordBtn.addEventListener("click", async () => {
  const user = auth.currentUser;
  if (!user || !user.email) return;

  try {
    await sendPasswordResetEmail(auth, user.email);
    alert("Password reset email sent to " + user.email);
  } catch (error) {
    console.error(error);
    alert(error.message);
  }
});

exportDataBtn.addEventListener("click", () => {
  if (transactions.length === 0) {
    alert("There are no transactions to export yet.");
    return;
  }

  const headers = ["Title", "Amount", "Type", "Category", "Date"];
  const rows = transactions.map(t => [t.title, t.amount, t.type, t.category, t.date]);

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

profileThemeBtn.addEventListener("click", () => {
  themeBtn.click();
  syncProfileTheme();
});
