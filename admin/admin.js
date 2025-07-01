// ----- LOGIN PAGE -----
function loginAdmin() {
  const input = document.getElementById("password").value;
  if (input === "admin123") {
    localStorage.setItem("admin_logged_in", "true");
    window.location.href = "dashboard.html";
  } else {
    alert("Wrong password!");
  }
}

// ----- DASHBOARD PAGE -----
if (window.location.pathname.includes("dashboard.html")) {
  const isLoggedIn = localStorage.getItem("admin_logged_in");
  if (isLoggedIn !== "true") {
    window.location.href = "login.html";
  }

  const orders = JSON.parse(localStorage.getItem("salesRecords")) || [];
  const expenses = JSON.parse(localStorage.getItem("expenses")) || [];

  const today = new Date();
  const todayStr = today.toDateString();
  const yesterdayStr = new Date(Date.now() - 86400000).toDateString();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  let salesToday = 0, salesYesterday = 0, salesMonth = 0;

  orders.forEach(order => {
    const date = new Date(order.timestamp);
    const dateStr = date.toDateString();
    const month = date.getMonth();
    const year = date.getFullYear();

    if (dateStr === todayStr) salesToday += order.amount;
    if (dateStr === yesterdayStr) salesYesterday += order.amount;
    if (month === currentMonth && year === currentYear) salesMonth += order.amount;
  });

  const totalExpense = expenses.reduce((sum, e) => sum + e.amount, 0);
  const totalProfit = salesMonth - totalExpense;

  const setText = (id, value) => {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  };

  setText("sales-today", `₱${salesToday.toFixed(2)}`);
  setText("sales-yesterday", `₱${salesYesterday.toFixed(2)}`);
  setText("sales-month", `₱${salesMonth.toFixed(2)}`);
  setText("expenses-total", `₱${totalExpense.toFixed(2)}`);
  setText("profit-total", `₱${totalProfit.toFixed(2)}`);

  const expensesList = document.getElementById("expenses-list");
  if (expensesList) {
    expenses.forEach(exp => {
      const li = document.createElement("li");
      li.textContent = `${exp.date} - ${exp.item}: ₱${exp.amount}`;
      expensesList.appendChild(li);
    });
  }

  const stockList = document.getElementById("stock-list");
  const stocks = JSON.parse(localStorage.getItem("menuStocks")) || [];
  if (stockList) {
    stocks.forEach(item => {
      const li = document.createElement("li");
      li.innerHTML = `${item.name}: <span class="${item.stock <= 10 ? 'low-stock' : ''}">${item.stock}</span>`;
      stockList.appendChild(li);
    });
  }

  const downloadCSV = (filename, content) => {
    const blob = new Blob([content], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const salesBtn = document.getElementById("export-sales");
  if (salesBtn) {
    salesBtn.addEventListener("click", () => {
      let csv = "Date,Amount\n";
      orders.forEach(order => {
        csv += `${new Date(order.timestamp).toLocaleString()},${order.amount}\n`;
      });
      downloadCSV("sales.csv", csv);
    });
  }

  const expenseBtn = document.getElementById("export-expenses");
  if (expenseBtn) {
    expenseBtn.addEventListener("click", () => {
      let csv = "Date,Item,Amount\n";
      expenses.forEach(exp => {
        csv += `${exp.date},${exp.item},${exp.amount}\n`;
      });
      downloadCSV("expenses.csv", csv);
    });
  }

  const filterInput = document.getElementById("filter-date");
  if (filterInput) {
    filterInput.addEventListener("change", e => {
      const selected = new Date(e.target.value).toDateString();
      const filtered = orders.filter(o => new Date(o.timestamp).toDateString() === selected);
      const total = filtered.reduce((sum, o) => sum + o.amount, 0);
      alert(`Total sales on ${selected}: ₱${total.toFixed(2)}`);
    });
  }

  // Add Expense Form Handler
  const expenseForm = document.getElementById("add-expense-form");
  if (expenseForm) {
    expenseForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const itemInput = document.getElementById("expense-item");
      const amountInput = document.getElementById("expense-amount");

      const newItem = itemInput.value.trim();
      const newAmount = parseFloat(amountInput.value);

      if (!newItem || isNaN(newAmount) || newAmount <= 0) {
        alert("Please enter valid item and amount.");
        return;
      }

      const newEntry = {
        item: newItem,
        amount: newAmount,
        date: new Date().toLocaleDateString()
      };

      expenses.push(newEntry);
      localStorage.setItem("expenses", JSON.stringify(expenses));

      const li = document.createElement("li");
      li.textContent = `${newEntry.date} - ${newEntry.item}: ₱${newEntry.amount}`;
      expensesList.appendChild(li);

      const updatedExpense = expenses.reduce((sum, e) => sum + e.amount, 0);
      setText("expenses-total", `₱${updatedExpense.toFixed(2)}`);
      setText("profit-total", `₱${(salesMonth - updatedExpense).toFixed(2)}`);

      itemInput.value = "";
      amountInput.value = "";
    });
  }

 // ----- MENU DATA SETUP -----
let menuData = JSON.parse(localStorage.getItem("menuData"));
if (!menuData) {
  menuData = {
    sizzlings: [
      { name: "Sizzling Pork Sisig", image: "designs/sisig.jpg", prices: [{ label: "Solo", value: 109 }, { label: "Platter", value: 190 }] },
      { name: "Sizzling Pork Chop", image: "designs/porkchop.jpg", prices: [{ label: "Solo", value: 119 }, { label: "Platter", value: 190 }] },
      { name: "Sizzling Liempo", image: "designs/liempo.jpg", prices: [{ label: "Solo", value: 119 }, { label: "Platter", value: 190 }] },
      { name: "Sizzling Bangus Sisig", image: "designs/bangus.webp", prices: [{ label: "Solo", value: 139 }, { label: "Platter", value: 220 }] },
      { name: "Sizzling Chicken Katsu", image: "designs/katsu.jpg", prices: [{ label: "Solo", value: 139 }, { label: "Platter", value: 220 }] },
      { name: "Sizzling Spicy Chicken", image: "designs/chick.jpg", prices: [{ label: "Solo", value: 139 }, { label: "Platter", value: 220 }] },
      { name: "Sizzling Garlic Pepper Beef", image: "designs/garlic.webp", prices: [{ label: "Solo", value: 139 }, { label: "Platter", value: 220 }] },
      { name: "UNLI RICE SIZZLING", image: "designs/rice.jpg", prices: [{ label: "Unli Rice", value: 35 }] }
    ],
    silog: [
      { name: "TapSilog", image: "designs/tapsilog.jpg" },
      { name: "ChickSilog", image: "designs/chicksilog.jpg" },
      { name: "LiempoSilog", image: "designs/liemposilog.jpg" },
      { name: "PorkSilog", image: "designs/porksilog.jpg" },
      { name: "BangSilog", image: "designs/bangsilog.jpg" },
      { name: "HotSilog", image: "designs/hotsilog.jpg" },
      { name: "SpamSilog", image: "designs/spamsilog.jpg" }
    ],
    chao: [
      { name: "Chao Fan Pork Siomai", image: "designs/chaopork.jpg" },
      { name: "Chao Fan Beef Siomai", image: "designs/chaobeef.jpg" },
      { name: "Chao Fan Dumplings", image: "designs/chaodumplings.jpg" },
      { name: "Chao Fan Shanghai", image: "designs/chaoshanghai.jpg" },
      { name: "5 pcs Beef Siomai", image: "designs/beefsiomai.jpg" },
      { name: "5 pcs Pork Siomai", image: "designs/porksiomai.jpg" },
      { name: "5 pcs Japanese Siomai", image: "designs/japsiomai.jpg" },
      { name: "5 pcs Dumplings", image: "designs/dumplings.jpg" },
      { name: "5 pcs Gyoza", image: "designs/gyoza.jpg" },
      { name: "5 pcs Shanghai", image: "designs/shanghai.jpg" }
    ],
    other: [
      { name: "Lomi Batangas", image: "designs/lomi.jpg", prices: [{ label: "Regular", value: 99 }, { label: "Special", value: 105 }, { label: "Overload", value: 399 }] },
      { name: "Bulalo", image: "designs/bulalo.jpg", prices: [{ label: "Solo", value: 145 }, { label: "For Sharing", value: 380 }] },
      { name: "Braised Beef", image: "designs/braisedbeef.jpg", prices: [{ label: "Solo", value: 169 }, { label: "w/ Drinks", value: 189 }] },
      { name: "Extra Rice", image: "designs/rice.jpg" },
      { name: "Bento Boxes (20+ Orders)", image: "designs/bento.jpg", prices: [{ label: "Depends on Menu", value: 150 }, { label: "Depends on Menu", value: 250 }] },
      { name: "Catering Foods", image: "designs/catering.jpg" }
    ],
    drinks: [
      { name: "1 Pitcher of Iced Tea", image: "designs/icedtea.jpg" },
      { name: "1 Pitcher of Lemonade", image: "designs/lemonade.jpg" },
      { name: "Fruit Soda Strawberry", image: "designs/soda_strawberry.jpg" },
      { name: "Fruit Soda Green Apple", image: "designs/soda_apple.jpg" },
      { name: "Fruit Soda Lychee", image: "designs/soda_lychee.jpg" },
      { name: "Fruit Soda Blueberry", image: "designs/soda_blueberry.jpg" }
    ]
  };
  localStorage.setItem("menuData", JSON.stringify(menuData));
}

// ----- PRODUCT CATALOG MANAGEMENT -----
if (window.location.pathname.includes("dashboard.html")) {
  const productList = document.getElementById("product-list");
  if (productList && typeof menuData !== "undefined") {
    productList.innerHTML = "";

    Object.keys(menuData).forEach(category => {
      menuData[category].forEach((item, itemIndex) => {
        if (item.prices && Array.isArray(item.prices)) {
          item.prices.forEach((variant, priceIndex) => {
            const li = document.createElement("li");
            li.innerHTML = `
              <img src="${item.image}" alt="${item.name}" style="width:40px;height:40px;object-fit:cover;border-radius:4px;margin-right:8px;">
              <span contenteditable="true" class="editable-name">${item.name} - ${variant.label}</span>: 
              ₱<span contenteditable="true" class="editable-price">${variant.value}</span>
              <button class="btn-edit">Save</button>
              <button class="btn-delete">Delete</button>
            `;

            li.querySelector(".btn-edit").addEventListener("click", () => {
              const nameText = li.querySelector(".editable-name").textContent.trim();
              const priceText = parseFloat(li.querySelector(".editable-price").textContent);
              const [namePart, labelPart] = nameText.split(" - ");

              if (!namePart || isNaN(priceText)) {
                alert("❌ Invalid name or price.");
                return;
              }

              item.name = namePart;
              variant.label = labelPart || variant.label;
              variant.value = priceText;
              localStorage.setItem("menuData", JSON.stringify(menuData)); // 🔒 Save change
              alert("✅ Product updated and saved.");
            });

            li.querySelector(".btn-delete").addEventListener("click", () => {
              menuData[category][itemIndex].prices.splice(priceIndex, 1);
              if (menuData[category][itemIndex].prices.length === 0) {
                menuData[category].splice(itemIndex, 1);
              }
              localStorage.setItem("menuData", JSON.stringify(menuData)); // 🔒 Save delete
              li.remove();
              alert("🗑️ Variant deleted and saved.");
            });

            productList.appendChild(li);
          });
        } else {
          const li = document.createElement("li");
          li.innerHTML = `
            <img src="${item.image}" alt="${item.name}" style="width:40px;height:40px;object-fit:cover;border-radius:4px;margin-right:8px;">
            <span contenteditable="true" class="editable-name">${item.name}</span>
            <button class="btn-edit">Save</button>
            <button class="btn-delete">Delete</button>
          `;

          li.querySelector(".btn-edit").addEventListener("click", () => {
            const newName = li.querySelector(".editable-name").textContent.trim();
            if (!newName) return alert("❌ Invalid name.");
            item.name = newName;
            localStorage.setItem("menuData", JSON.stringify(menuData)); // 🔒 Save name
            alert("✅ Name updated and saved.");
          });

          li.querySelector(".btn-delete").addEventListener("click", () => {
            menuData[category].splice(itemIndex, 1);
            localStorage.setItem("menuData", JSON.stringify(menuData)); // 🔒 Save remove
            li.remove();
            alert("🗑️ Product removed and saved.");
          });

          productList.appendChild(li);
           }
         });
      });
     }
  }
}

// ----- STOCKS PAGE -----
if (window.location.pathname.includes("stocks.html")) {
  const container = document.getElementById("stock-container");
  const saveButton = document.createElement("button");
  saveButton.textContent = "💾 Save All Changes";
  saveButton.className = "save-btn";
  container?.parentElement.insertBefore(saveButton, container);

  // ✅ Load latest menuData
  const menuData = JSON.parse(localStorage.getItem("menuData")) || {};

  const savedStocks = JSON.parse(localStorage.getItem("menuStocks")) || [];
  const stockMap = {};
  savedStocks.forEach(s => (stockMap[s.name] = s.stock));

  const allItems = [];

  Object.keys(menuData).forEach(category => {
    menuData[category].forEach(item => {
      if (item.prices) {
        item.prices.forEach(variant => {
          const name = `${item.name} - ${variant.label}`;
          const stock = stockMap[name] ?? 0;
          allItems.push({ name, image: item.image, stock });
        });
      } else {
        const name = item.name;
        const stock = stockMap[name] ?? 0;
        allItems.push({ name, image: item.image, stock });
      }
    });
  });

  function renderStockItems() {
    container.innerHTML = "";
    allItems.forEach((item, index) => {
      const box = document.createElement("div");
      box.className = "item-box";
      box.innerHTML = `
        <img src="${item.image || 'designs/default.jpg'}" alt="${item.name}" />
        <strong>${item.name}</strong>
        <input type="number" min="0" value="${item.stock}" id="stock-${index}" />
        <span class="${item.stock <= 10 ? 'low' : ''}">
          ${item.stock <= 10 ? 'LOW STOCK' : ''}
        </span>
      `;
      container.appendChild(box);
    });
  }

  saveButton.addEventListener("click", () => {
    const updated = allItems.map((item, index) => {
      const newStock = parseInt(document.getElementById(`stock-${index}`).value) || 0;
      return { name: item.name, stock: newStock };
    });
    localStorage.setItem("menuStocks", JSON.stringify(updated));
    alert("✅ All stocks updated!");
    renderStockItems();
  });

  renderStockItems();
}

