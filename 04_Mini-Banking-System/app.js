class Account {
  constructor(amount) {
    this.balance = amount;
  }

  getBalance() {
    return this.balance;
  }

  deposit(amount) {
    this.balance += amount * 1;
  }

  withdraw(amount) {
    if (amount > this.balance) {
      return false;
    }
    this.balance -= amount;
    return true;
  }
}

// Load data from localStorage
function loadData() {
  const savedBalance = localStorage.getItem("accountBalance");
  const savedTransactions = localStorage.getItem("transactions");

  return {
    balance: savedBalance ? parseFloat(savedBalance) : 0,
    transactions: savedTransactions ? JSON.parse(savedTransactions) : [],
  };
}

// Save data to localStorage
function saveData() {
  localStorage.setItem("accountBalance", myAccount.getBalance());
  localStorage.setItem("transactions", JSON.stringify(transactions));
}

const savedData = loadData();
const myAccount = new Account(savedData.balance);
const transactions = savedData.transactions;
const MAX_TRANSACTIONS = 5;

const balanceDisplay = document.getElementById("balanceDisplay");
const amountInput = document.getElementById("amountInput");
const depositBtn = document.getElementById("depositBtn");
const withdrawBtn = document.getElementById("withdrawBtn");
const notification = document.getElementById("notification");
const transactionSection = document.getElementById("transactionSection");
const transactionList = document.getElementById("transactionList");

function showNotification(type, message) {
  notification.textContent = message;
  notification.className = "notification show " + type;

  setTimeout(function () {
    notification.className = "notification";
  }, 3000);
}

function updateBalance() {
  const balance = myAccount.getBalance();
  balanceDisplay.textContent = "$" + balance.toFixed(2);
  saveData(); // Save after balance update
}

function addTransaction(type, amount) {
  const transaction = {
    id: Date.now(),
    type: type,
    amount: amount,
    timestamp: new Date().toLocaleTimeString(),
    balance: myAccount.getBalance(),
  };

  transactions.unshift(transaction);
  if (transactions.length > MAX_TRANSACTIONS) {
    transactions.pop();
  }

  renderTransactions();
  saveData(); // Save after adding transaction
}

function renderTransactions() {
  if (transactions.length === 0) {
    transactionSection.style.display = "none";
    return;
  }

  transactionSection.style.display = "block";

  transactionList.innerHTML = transactions
    .map(function (transaction) {
      const icon =
        transaction.type === "deposit"
          ? '<polyline points="12 5 12 19 5 12"/>'
          : '<polyline points="12 19 12 5 19 12"/>';
      const color = transaction.type === "deposit" ? "#00d4aa" : "#ff6b6b";
      const sign = transaction.type === "deposit" ? "+" : "-";
      const label = transaction.type === "deposit" ? "Deposit" : "Withdrawal";

      return (
        '<div class="transaction-item">' +
        '<div class="transaction-left">' +
        '<div class="transaction-icon ' +
        transaction.type +
        '">' +
        '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="' +
        color +
        '" stroke-width="2">' +
        icon +
        "</svg>" +
        "</div>" +
        '<div class="transaction-info">' +
        "<h4>" +
        label +
        "</h4>" +
        "<p>" +
        transaction.timestamp +
        "</p>" +
        "</div>" +
        "</div>" +
        '<div class="transaction-right">' +
        '<p class="transaction-amount ' +
        transaction.type +
        '">' +
        sign +
        "$" +
        transaction.amount.toFixed(2) +
        "</p>" +
        '<p class="transaction-balance">Bal: $' +
        transaction.balance.toFixed(2) +
        "</p>" +
        "</div>" +
        "</div>"
      );
    })
    .join("");
}

function handleDeposit() {
  const amount = parseFloat(amountInput.value);

  if (!amount || amount <= 0) {
    showNotification("error", "Please enter a valid amount");
    return;
  }

  myAccount.deposit(amount);
  updateBalance();
  addTransaction("deposit", amount);
  showNotification("success", "Successfully deposited $" + amount.toFixed(2));
  amountInput.value = "";
}

function handleWithdraw() {
  const amount = parseFloat(amountInput.value);

  if (!amount || amount <= 0) {
    showNotification("error", "Please enter a valid amount");
    return;
  }

  const result = myAccount.withdraw(amount);

  if (result) {
    updateBalance();
    addTransaction("withdraw", amount);
    showNotification("success", "Successfully withdrawn $" + amount.toFixed(2));
    amountInput.value = "";
  } else {
    showNotification("error", "Insufficient funds");
  }
}

depositBtn.addEventListener("click", handleDeposit);
withdrawBtn.addEventListener("click", handleWithdraw);

amountInput.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    handleDeposit();
  }
});

// Initialize display with saved data
updateBalance();
renderTransactions();
