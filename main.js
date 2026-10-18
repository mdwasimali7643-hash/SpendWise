// ===============================
// FIREBASE IMPORTS
// ===============================

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";

import {
  getAI,
  getGenerativeModel,
  GoogleAIBackend
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-ai.js";

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

import {
  initializeAppCheck,
  ReCaptchaEnterpriseProvider
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app-check.js";


const app = initializeApp(firebaseConfig);

const appCheck = initializeAppCheck(app, {
  provider: new ReCaptchaEnterpriseProvider(
    "6LfHsfMtAAAAAJhojJuANlREGArAKDMLG-a7d__9"
  ),
  isTokenAutoRefreshEnabled: true
});

const auth = getAuth(app);
const db = getFirestore(app);



// ===============================
// FIREBASE AI LOGIC
// ===============================

const ai = getAI(app, {
  backend: new GoogleAIBackend()
});

const aiModel = getGenerativeModel(ai, {
  model: "gemini-3.8-flash"
});

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
const navAi = document.getElementById("navAi");
const aiSection = document.getElementById("aiSection");
const aiInput = document.getElementById("aiInput");
const aiSendBtn = document.getElementById("aiSendBtn");
const chatMessages = document.getElementById("chatMessages");


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
const budgetAlert = document.getElementById('budgetAlerts')
const budgetAlertH3 = document.getElementById('budgetAlertH3')
const budgetAlertP = document.getElementById('budgetAlertP')

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
    aiSection.classList.remove("active-section");
    savingsSection.classList.remove("active-section");

    footerNav.style.display = "flex";

    navHome.classList.add("active");
    navAnalytics.classList.remove("active");
    navBudget.classList.remove("active");
    navAi.classList.remove("active")
    navSavings.classList.remove("active")

    await loadTransactions();
    await loadBudget(user);
  } else {
    authSection.style.display = "flex";

    homeSection.classList.remove("active-section");
    analyticsSection.classList.remove("active-section");
    budgetSection.classList.remove("active-section");
    profileSection.classList.remove("active-section");
    aiSection.classList.remove("active-section");
    savingsSection.classList.remove("active")


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
  navAi.classList.remove("active");
  navSavings.classList.remove("active"); // Added

  homeSection.classList.add("active-section");
  analyticsSection.classList.remove("active-section");
  budgetSection.classList.remove("active-section");
  profileSection.classList.remove("active-section");
  aiSection.classList.remove("active-section");
  savingsSection.classList.remove("active-section"); // Added
});

navAnalytics.addEventListener("click", () => {
  navAnalytics.classList.add("active");
  navHome.classList.remove("active");
  navBudget.classList.remove("active");
  navAi.classList.remove("active");
  navSavings.classList.remove("active"); // Added

  analyticsSection.classList.add("active-section");
  homeSection.classList.remove("active-section");
  budgetSection.classList.remove("active-section");
  profileSection.classList.remove("active-section");
  aiSection.classList.remove("active-section");
  savingsSection.classList.remove("active-section"); // Added

  updateChart();
});

navBudget.addEventListener("click", () => {
  navBudget.classList.add("active");
  navHome.classList.remove("active");
  navAnalytics.classList.remove("active");
  navAi.classList.remove("active");
  navSavings.classList.remove("active"); // Added

  budgetSection.classList.add("active-section");
  homeSection.classList.remove("active-section");
  analyticsSection.classList.remove("active-section");
  profileSection.classList.remove("active-section");
  aiSection.classList.remove("active-section");
  savingsSection.classList.remove("active-section"); // Added

  updateBudget();
});

navAi.addEventListener("click", () => {
  navAi.classList.add("active");
  navHome.classList.remove("active");
  navAnalytics.classList.remove("active");
  navBudget.classList.remove("active");
  navSavings.classList.remove("active"); // Added

  aiSection.classList.add("active-section");
  homeSection.classList.remove("active-section");
  analyticsSection.classList.remove("active-section");
  budgetSection.classList.remove("active-section");
  profileSection.classList.remove("active-section");
  savingsSection.classList.remove("active-section"); // Added
});
navSavings.addEventListener("click", () => {
  navSavings.classList.add("active");
  navHome.classList.remove("active");
  navAnalytics.classList.remove("active");
  navBudget.classList.remove("active");
  navAi.classList.remove("active");

  savingsSection.classList.add("active-section");
  homeSection.classList.remove("active-section");
  analyticsSection.classList.remove("active-section");
  budgetSection.classList.remove("active-section");
  profileSection.classList.remove("active-section");
  aiSection.classList.remove("active-section");

  loadSavingsGoals();
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
  
  // Set status text and gradient based on usage threshold
  if (percentage >= 100) {
    budgetStatus.textContent = "Budget exceeded!";
    budgetProgress.style.background = "linear-gradient(90deg, #B91C1C, #EF4444)";
    budgetAlertH3.textContent = "Oops!"
    budgetAlertP.textContent = "You've used 100% of your budget!"
    budgetAlert.style.background = "#ef4444"
  } else if (percentage >= 80) {
    budgetStatus.textContent = "You're close to your budget";
    budgetProgress.style.background = "linear-gradient(90deg, #D97706, #FBBF24)";
    budgetAlertH3.textContent = "Be careful!"
    budgetAlertP.textContent = "Looks like you've almost reached your limit..."
    budgetAlert.style.background = "#fbbf24"
  } else {
    budgetStatus.textContent = `${percentage.toFixed(0)}% of budget used`;
    budgetProgress.style.background = "linear-gradient(90deg, #059669, #34D399)";
    budgetAlertH3.textContent = "Very good!"
    budgetAlertP.textContent = "You're on the right track!"
    budgetAlert.style.background = "#34d399"
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
// ===============================
// BUDGET BUTTON EVENTS
// ===============================

editBudgetBtn.addEventListener("click", () => {
  budgetModal.style.display = "flex";
  budgetInput.value = monthlyBudget > 0 ? monthlyBudget : "";
  budgetInput.focus();
});

saveBudgetBtn.addEventListener("click", saveBudget);

cancelBudgetBtn.addEventListener("click", () => {
  budgetModal.style.display = "none";
  budgetInput.value = "";
});
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

// Ensure this is only written once in your entire JS file
if (aiSendBtn && aiInput) {
  aiSendBtn.onclick = sendToAI; // Using .onclick avoids duplicate listener stacking if script runs twice
  aiInput.onkeypress = (e) => {
    if (e.key === "Enter") sendToAI();
  };
}


async function sendToAI() {
  const userQuery = aiInput.value.trim();

  if (!userQuery) return;

  if (!auth.currentUser) {
    appendMessage("Please log in to use SpendWISE AI.", "ai");
    return;
  }

  // Prevent accidental empty requests
  appendMessage(userQuery, "user");
  aiInput.value = "";
  aiInput.disabled = true;
  aiSendBtn.disabled = true;

  const loadingId = appendMessage("Thinking...", "ai");

  try {
    // Prepare financial summary from existing app data
    const totalIncome = transactions
      .filter(t => t.type === "income")
      .reduce((sum, t) => sum + Number(t.amount || 0), 0);

    const totalExpense = transactions
      .filter(t => t.type === "expense")
      .reduce((sum, t) => sum + Number(t.amount || 0), 0);

    const userBalance = totalIncome - totalExpense;

    const categorySummary = {};

    transactions
      .filter(t => t.type === "expense")
      .forEach(t => {
        const category = t.category || "Other";

        categorySummary[category] =
          (categorySummary[category] || 0) +
          Number(t.amount || 0);
      });

    const systemPrompt = `
You are SpendWISE AI, a friendly and concise personal finance assistant.

The user's current financial snapshot:
- Currency: ${getCurrency().name} (${getCurrency().symbol})
- Total income: ${formatMoney(totalIncome)}
- Total expenses: ${formatMoney(totalExpense)}
- Current balance: ${formatMoney(userBalance)}
- Monthly budget: ${
      monthlyBudget > 0
        ? formatMoney(monthlyBudget)
        : "Not set"
    }
- Expense categories: ${JSON.stringify(categorySummary)}

YOUR TASKS:

1. Explain the user's spending, budget and savings using
   the financial information provided.
2. Offer realistic, practical budgeting suggestions.
3. Help compare products and suggest purchases within the
   user's stated budget.
4. When recommending products, provide useful search links
   for shopping websites when appropriate.
5. Do not claim to have checked live stock, current prices,
   reviews or availability unless that information was
   actually retrieved from a reliable live source.
6. Respect the user's budget and explain financial trade-offs.
7. Keep responses clear, friendly and concise.
8. If information is missing, ask a brief follow-up question.
9. Never ask for passwords, bank login details, card numbers
   or other sensitive account credentials.

Use the financial snapshot as context, but do not assume
it contains every detail of the user's finances.
`;

    const prompt = `${systemPrompt}

User's question:
${userQuery}`;

    // Use Firebase AI Logic; no Gemini API key in this file
    const result = await aiModel.generateContent(prompt);
    const aiReply = result.response.text();

    document.getElementById(loadingId)?.remove();

    appendMessage(
      aiReply || "I couldn't generate a response. Please try again.",
      "ai"
    );

  } catch (error) {
    console.error("SpendWISE AI error:", error);

    document.getElementById(loadingId)?.remove();

    let message =
      "SpendWISE AI couldn't respond right now. Please try again.";

    if (error?.message) {
      console.error("AI error details:", error.message);
    }

    appendMessage(message, "ai");

  } finally {
    aiInput.disabled = false;
    aiSendBtn.disabled = false;
    aiInput.focus();
  }
}

function appendMessage(text, sender) {
  const wrapper = document.createElement("div");
  wrapper.className = `message-wrapper ${sender === "user" ? "user-wrapper" : "ai-wrapper"}`;
  
  // Give the wrapper the unique ID so we can remove the entire row easily
  const msgId = "msg_" + Date.now() + "_" + Math.random().toString(36).substr(2, 5);
  wrapper.id = msgId;

  const avatar = document.createElement("div");
  avatar.className = `chat-avatar ${sender === "user" ? "user-avatar" : "ai-avatar"}`;
  
  if (sender === "user") {
    avatar.innerHTML = `<i class="fa-solid fa-user-tie"></i>`;
  } else {
    avatar.innerHTML = `<i class="fa-solid fa-robot"></i>`;
  }

  const msgDiv = document.createElement("div");
  msgDiv.className = `message ${sender === "user" ? "user-msg" : "ai-msg"}`;

  if (text === "Thinking...") {
    msgDiv.classList.add("loading");
    msgDiv.innerHTML = `<span></span><span></span><span></span>`;
  } else {
    msgDiv.innerHTML = textToHTML(text);
  }

  wrapper.appendChild(avatar);
  wrapper.appendChild(msgDiv);
  chatMessages.appendChild(wrapper);
  chatMessages.scrollTop = chatMessages.scrollHeight;

  // Returns the ID of the outer wrapper row
  return msgId;
}
function textToHTML(text) {
  if (!text) return "";

  let formatted = text
    // Convert Markdown Headings (# Product Name) to HTML headers
    .replace(/^#\s+(.*)$/gm, '<h1>$1</h1>')
    // Convert Markdown Bold (**Label:**) to strong tags
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    // Convert Markdown Italics (*Price*) to em tags
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    // Convert newlines to breaks
    .replace(/\n/g, '<br>');

  return formatted;
}

// ===============================
// SAVINGS GOALS DOM ELEMENTS
// ===============================

let savingsGoals = [];
let activeCheckinGoalId = null;

// Preset Daily Target Toggle Buttons
const dailyPresetToggle = document.getElementById("dailyPresetToggle");
if (dailyPresetToggle) {
  dailyPresetToggle.addEventListener("click", (e) => {
    const btn = e.target.closest("button");
    if (!btn) return;
    dailyPresetToggle.querySelectorAll("button").forEach(b => b.classList.remove("on"));
    btn.classList.add("on");
    goalDailyTarget.value = btn.dataset.value;
  });
}

// Modal Toggle Listeners
if (openGoalModalBtn) {
  openGoalModalBtn.addEventListener("click", () => {
    goalModal.style.display = "flex";
  });
}
if (cancelGoalBtn) {
  cancelGoalBtn.addEventListener("click", () => {
    goalModal.style.display = "none";
  });
}

// ===============================
// LOAD & SAVE GOALS FROM FIRESTORE
// ===============================
async function loadSavingsGoals() {
  const user = auth.currentUser;
  if (!user) return;

  try {
    savingsGoals = [];
    const q = query(collection(db, "savingsGoals"), where("uid", "==", user.uid));
    const snapshot = await getDocs(q);

    snapshot.forEach((document) => {
      savingsGoals.push({
        firestoreId: document.id,
        ...document.data()
      });
    });

    renderGoals();
  } catch (error) {
    console.error("Error loading savings goals:", error);
  }
}

// Create New Goal
if (saveGoalBtn) {
  saveGoalBtn.addEventListener("click", async () => {
    const user = auth.currentUser;
    if (!user) {
      alert("Please login first.");
      return;
    }

    const title = goalTitle.value.trim();
    const target = Number(goalTargetAmount.value);
    const daily = Number(goalDailyTarget.value) || 100;

    if (!title || !target || target <= 0) {
      alert("Please enter a valid goal name and target amount.");
      return;
    }

    const newGoal = {
      uid: user.uid,
      title: title,
      targetAmount: target,
      dailyTarget: daily,
      savedAmount: 0,
      streak: 0,
      lastCheckinDate: null,
      createdAt: new Date().toISOString()
    };

    try {
      const docRef = await addDoc(collection(db, "savingsGoals"), newGoal);
      newGoal.firestoreId = docRef.id;
      savingsGoals.push(newGoal);

      goalModal.style.display = "none";
      goalTitle.value = "";
      goalTargetAmount.value = "";
      goalDailyTarget.value = "";
      renderGoals();
    } catch (error) {
      alert(error.message);
    }
  });
}

// ===============================
// RENDER GOALS UI
// ===============================
function renderGoals() {
  if (!goalsContainer) return;

  if (savingsGoals.length === 0) {
    goalsContainer.innerHTML = `<p style="color: var(--text-muted); text-align:center; padding: 30px; font-size: 0.9rem;">No savings goals yet. Create one to start building your future!</p>`;
    return;
  }

  goalsContainer.innerHTML = "";

  savingsGoals.forEach((goal) => {
    const isCompleted = goal.savedAmount >= goal.targetAmount;
    const percentage = Math.min(100, (goal.savedAmount / goal.targetAmount) * 100).toFixed(1);
    
    // Calculate total days taken from creation date to completion/current date
    const createdDate = new Date(goal.createdAt || Date.now());
    const currentDate = new Date();
    const diffTime = Math.abs(currentDate - createdDate);
    const totalDaysTaken = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

    const card = document.createElement("div");
    card.className = isCompleted ? "goal-card completed" : "goal-card";

    if (isCompleted) {
      // --- COMPLETED GOAL LAYOUT ---
      card.innerHTML = `
        <div class="goal-top">
          <div class="goal-title-wrapper">
            <h3 class="goal-title">${goal.title}</h3>
            <span class="goal-amounts">Achieved: <strong>${formatMoney(goal.savedAmount)}</strong></span>
          </div>
          <div class="goal-top-right">
            <div class="goal-percentage">100%</div>
            <button class="goal-delete-btn" data-delete-id="${goal.firestoreId}" title="Delete Goal">
              <i class="fa-solid fa-trash-can"></i>
            </button>
          </div>
        </div>

        <h4 class="goal-completed-heading">
          <i class="fa-solid fa-circle-check"></i> Goal completed!!
        </h4>
        <p class="goal-completed-text">
          Now you can finally buy this or treat yourself to the reward you've worked hard for!
        </p>

        <div class="goal-progress-container">
          <div class="goal-progress-bg">
            <div class="goal-progress-fill" style="width: 100%"></div>
          </div>
        </div>

        <div class="goal-completed-footer">
          <span>It took you <strong>${totalDaysTaken} days</strong> to reach! 🔥</span>
        </div>
      `;
    } else {
      // --- ACTIVE GOAL LAYOUT ---
      const remainingAmount = Math.max(0, goal.targetAmount - goal.savedAmount);
      const dailyPace = goal.dailyTarget || 100;
      const estimatedDays = remainingAmount > 0 ? Math.ceil(remainingAmount / dailyPace) : 0;

      card.innerHTML = `
        <div class="goal-top">
          <div class="goal-title-wrapper">
            <h3 class="goal-title">${goal.title}</h3>
            <span class="goal-amounts">Saved: <strong>${formatMoney(goal.savedAmount)}</strong> / ${formatMoney(goal.targetAmount)}</span>
          </div>
          <div class="goal-top-right">
            <div class="goal-percentage">${percentage}%</div>
            <button class="goal-delete-btn" data-delete-id="${goal.firestoreId}" title="Delete Goal">
              <i class="fa-solid fa-trash-can"></i>
            </button>
          </div>
        </div>

        <div class="goal-insight-pill">
          <i class="fa-solid fa-wand-magic-sparkles"></i>
          <span>At your <strong>${formatMoney(dailyPace)}/day</strong> pace, you need about <strong>${estimatedDays} days</strong> to reach this goal.</span>
        </div>

        <div class="goal-progress-container">
          <div class="goal-progress-bg">
            <div class="goal-progress-fill" style="width: ${percentage}%"></div>
          </div>
        </div>

        <div class="goal-footer">
          <div class="streak-badge">
            🔥 Streak: <strong>${goal.streak || 0} days</strong>
          </div>
          <button class="checkin-trigger-btn" data-id="${goal.firestoreId}">
            Did you save today?
          </button>
        </div>
      `;
    }

    goalsContainer.appendChild(card);
  });
}

// ===============================
// CHECK-IN FLOW (YES / NO)
// ===============================
if (goalsContainer) {
  goalsContainer.addEventListener("click", (e) => {
    if (e.target.classList.contains("checkin-trigger-btn")) {
      activeCheckinGoalId = e.target.dataset.id;
      const goal = savingsGoals.find(g => g.firestoreId === activeCheckinGoalId);
      if (!goal) return;

      checkinGoalName.textContent = `Goal: ${goal.title} (Suggested: ${formatMoney(goal.dailyTarget)})`;
      checkinAmount.value = goal.dailyTarget;
      
      // Reset modal view
      checkinAmountWrapper.style.display = "none";
      checkinInitialBtns.style.display = "flex";
      checkinSubmitBtns.style.display = "none";

      checkinModal.style.display = "flex";
    }
  });
}

if (checkinNoBtn) {
  checkinNoBtn.addEventListener("click", () => {
    // User answered No -> Percentage stays same, close modal
    checkinModal.style.display = "none";
    activeCheckinGoalId = null;
  });
}

if (checkinYesBtn) {
  checkinYesBtn.addEventListener("click", () => {
    // User answered Yes -> Prompt for how much
    checkinInitialBtns.style.display = "none";
    checkinAmountWrapper.style.display = "block";
    checkinSubmitBtns.style.display = "flex";
  });
}

if (cancelCheckinBtn) {
  cancelCheckinBtn.addEventListener("click", () => {
    checkinModal.style.display = "none";
  });
}

if (submitCheckinBtn) {
  submitCheckinBtn.addEventListener("click", async () => {
    const addedAmount = Number(checkinAmount.value);
    if (!activeCheckinGoalId || isNaN(addedAmount) || addedAmount <= 0) {
      alert("Please enter a valid amount.");
      return;
    }

    const goal = savingsGoals.find(g => g.firestoreId === activeCheckinGoalId);
    if (!goal) return;

    goal.savedAmount += addedAmount;
    goal.streak = (goal.streak || 0) + 1;

    try {
      await updateDoc(doc(db, "savingsGoals", goal.firestoreId), {
        savedAmount: goal.savedAmount,
        streak: goal.streak
      });

      checkinModal.style.display = "none";
      renderGoals();
      activeCheckinGoalId = null;
    } catch (error) {
      alert("Error updating goal: " + error.message);
    }
  });
}

if (goalsContainer) {
  goalsContainer.addEventListener("click", async (e) => {
    // Handle Check-in Trigger
    if (e.target.closest(".checkin-trigger-btn")) {
      const btn = e.target.closest(".checkin-trigger-btn");
      activeCheckinGoalId = btn.dataset.id;
      const goal = savingsGoals.find(g => g.firestoreId === activeCheckinGoalId);
      if (!goal) return;

      checkinGoalName.textContent = `Goal: ${goal.title} (Suggested: ${formatMoney(goal.dailyTarget)})`;
      checkinAmount.value = goal.dailyTarget;
      
      checkinAmountWrapper.style.display = "none";
      checkinInitialBtns.style.display = "flex";
      checkinSubmitBtns.style.display = "none";

      checkinModal.style.display = "flex";
      return;
    }

    // Handle Delete Goal Trigger
    const deleteBtn = e.target.closest(".goal-delete-btn");
    if (deleteBtn) {
      const deleteId = deleteBtn.dataset.deleteId;
      const goal = savingsGoals.find(g => g.firestoreId === deleteId);
      if (!goal) return;

      if (confirm(`Are you sure you want to delete your savings goal for "${goal.title}"?`)) {
        try {
          await deleteDoc(doc(db, "savingsGoals", deleteId));
          savingsGoals = savingsGoals.filter(g => g.firestoreId !== deleteId);
          renderGoals();
        } catch (error) {
          alert("Error deleting goal: " + error.message);
        }
      }
    }
  });
}

