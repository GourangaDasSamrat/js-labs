// Initialize variables
let price = 19.5;
let cid = [
  ["PENNY", 1.01],
  ["NICKEL", 2.05],
  ["DIME", 3.1],
  ["QUARTER", 4.25],
  ["ONE", 90],
  ["FIVE", 55],
  ["TEN", 20],
  ["TWENTY", 60],
  ["ONE HUNDRED", 100],
];

// Currency unit values in dollars
const currencyUnit = {
  PENNY: 0.01,
  NICKEL: 0.05,
  DIME: 0.1,
  QUARTER: 0.25,
  ONE: 1,
  FIVE: 5,
  TEN: 10,
  TWENTY: 20,
  "ONE HUNDRED": 100,
};

// Display initial price
document.getElementById("price-display").textContent = price.toFixed(2);

// Display cash in drawer
function displayDrawer() {
  const drawerDisplay = document.getElementById("drawer-display");
  drawerDisplay.innerHTML = "";

  cid.forEach(([denomination, amount]) => {
    const div = document.createElement("div");
    div.className = "denomination";
    div.textContent = `${denomination}: $${amount.toFixed(2)}`;
    drawerDisplay.appendChild(div);
  });
}

// Calculate change
function checkCashRegister(price, cash, cid) {
  let change = cash - price;
  const originalChange = change;
  let totalCid = 0;
  const changeArray = [];

  // Calculate total cash in drawer
  cid.forEach(([_, amount]) => {
    totalCid += amount;
  });
  totalCid = Math.round(totalCid * 100) / 100;

  // Handle exact change
  if (change === 0) {
    return {
      status: "No change due - customer paid with exact cash",
      change: [],
    };
  }

  // Check if we have enough money
  if (totalCid < change) {
    return { status: "INSUFFICIENT_FUNDS", change: [] };
  }

  // Try to give change
  for (let i = cid.length - 1; i >= 0; i--) {
    const [denomination, amount] = cid[i];
    const unit = currencyUnit[denomination];
    let denominationAmount = 0;

    while (change >= unit && amount > 0 && denominationAmount < amount) {
      change = Math.round((change - unit) * 100) / 100;
      denominationAmount = Math.round((denominationAmount + unit) * 100) / 100;
    }

    if (denominationAmount > 0) {
      changeArray.push([denomination, denominationAmount]);
    }
  }

  // Check if we could make exact change
  const sumChange = changeArray.reduce((sum, [_, amount]) => sum + amount, 0);
  if (
    Math.round(sumChange * 100) / 100 !==
    Math.round(originalChange * 100) / 100
  ) {
    return { status: "INSUFFICIENT_FUNDS", change: [] };
  }

  // Check if drawer will be empty after giving change
  if (
    Math.round(totalCid * 100) / 100 ===
    Math.round(originalChange * 100) / 100
  ) {
    // Use the actual change given, filter out zero amounts, and sort from highest to lowest
    const closedChange = [...changeArray]
      .filter(([_, amount]) => amount > 0)
      .sort((a, b) => currencyUnit[b[0]] - currencyUnit[a[0]]);
    return { status: "CLOSED", change: closedChange };
  }

  return { status: "OPEN", change: changeArray };
}

// Format change for display
function formatChange(status, changeArray) {
  if (status === "No change due - customer paid with exact cash") {
    return status;
  }

  if (status === "INSUFFICIENT_FUNDS") {
    return "Status: INSUFFICIENT_FUNDS";
  }

  // For CLOSED and OPEN, sort and format
  const sortedChange = [...changeArray].sort(
    (a, b) => currencyUnit[b[0]] - currencyUnit[a[0]]
  );
  const changeString = sortedChange
    .map(([denom, amount]) => `${denom}: $${amount.toFixed(2)}`)
    .join(" ");

  return `Status: ${status} ${changeString}`;
}

// Handle purchase button click
document.getElementById("purchase-btn").addEventListener("click", () => {
  const cashInput = document.getElementById("cash");
  const changeDueElement = document.getElementById("change-due");
  const cash = parseFloat(cashInput.value);

  if (isNaN(cash)) {
    alert("Please enter a valid cash amount");
    return;
  }

  if (cash < price) {
    alert("Customer does not have enough money to purchase the item");
    return;
  }

  const result = checkCashRegister(price, cash, cid);
  changeDueElement.textContent = formatChange(result.status, result.change);

  // Update cid if change was given successfully
  if (result.status === "OPEN" || result.status === "CLOSED") {
    result.change.forEach(([denomination, changeAmount]) => {
      const cidIndex = cid.findIndex(([denom]) => denom === denomination);
      if (cidIndex !== -1) {
        cid[cidIndex][1] =
          Math.round((cid[cidIndex][1] - changeAmount) * 100) / 100;
      }
    });
    displayDrawer();
  }
});

// Initialize drawer display
displayDrawer();
