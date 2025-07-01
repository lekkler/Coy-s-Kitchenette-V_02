document.addEventListener('DOMContentLoaded', function () {
  const cartItems = [];
  const cartCount = document.querySelector('.cart-count');
  const cartSidebar = document.querySelector('.cart-sidebar');
  const cartItemsContainer = document.querySelector('.cart-items');
  const cartTotalDisplay = document.querySelector('.cart-total span');
  const checkoutBtn = document.querySelector('.checkout-btn');
  const modal = document.querySelector('.checkout-modal');
  const closeModalBtn = document.querySelector('.close-modal');
  const orderSummary = document.getElementById('order-summary');
  const orderTotal = document.getElementById('order-total');
  const checkoutForm = document.getElementById('checkout-form');

  // Improved stock checking function
  function getLiveStock(name) {
    try {
      const stocks = JSON.parse(localStorage.getItem("menuStocks")) || [];
      const item = stocks.find(s => s.name === name);
      return item ? item.stock : 99; // Default to 99 if no stock data
    } catch (e) {
      console.error("Error reading stock data:", e);
      return 99; // Fallback value
    }
  }

  // Cart management functions
  function updateCartCount() {
    const count = cartItems.reduce((acc, item) => acc + item.quantity, 0);
    cartCount.textContent = count;
    cartCount.style.display = count > 0 ? 'block' : 'none';
  }

  function calculateTotal() {
    return cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  }

  function renderCart() {
    cartItemsContainer.innerHTML = '';
    if (cartItems.length === 0) {
      cartItemsContainer.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
      return;
    }

    cartItems.forEach((item, index) => {
      const div = document.createElement('div');
      div.className = 'cart-item';
      div.innerHTML = `
        <div class="cart-item-info">
          <h4>${item.name}</h4>
          <p class="cart-item-price">₱${item.price.toFixed(2)} x ${item.quantity}</p>
        </div>
        <div class="cart-item-controls">
          <button class="quantity-btn minus" data-index="${index}">−</button>
          <span class="quantity-display">${item.quantity}</span>
          <button class="quantity-btn plus" data-index="${index}">+</button>
          <button class="remove-btn" data-index="${index}">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      `;
      cartItemsContainer.appendChild(div);
    });

    cartTotalDisplay.textContent = calculateTotal().toFixed(2);
  }

function handleCartItemChange(index, change) {
  if (change === 0) {
    cartItems.splice(index, 1);
  } else {
    cartItems[index].quantity += change;
    if (cartItems[index].quantity < 1) {
      cartItems.splice(index, 1);
    }
  }

  updateCartCount();
  renderCart();

  // ✅ Ensure the cart total is also updated
  cartTotalDisplay.textContent = calculateTotal().toFixed(2);
}


  // Event delegation for cart controls
  cartItemsContainer.addEventListener('click', (e) => {
    const index = e.target.closest('button')?.dataset?.index;
    if (index === undefined) return;
    
    if (e.target.closest('.minus')) {
      handleCartItemChange(parseInt(index), -1);
    } else if (e.target.closest('.plus')) {
      handleCartItemChange(parseInt(index), 1);
    } else if (e.target.closest('.remove-btn')) {
      handleCartItemChange(parseInt(index), 0);
    }
  });

  // Cart sidebar controls
  document.querySelector('.cart-icon').addEventListener('click', () => {
    cartSidebar.classList.toggle('active');
  });

  document.querySelector('.close-cart').addEventListener('click', () => {
    cartSidebar.classList.remove('active');
  });

  // Checkout modal controls
checkoutBtn.addEventListener('click', () => {
  if (cartItems.length === 0) {
    alert('Your cart is empty!');

    // Ensure QR container is visible if GCash is selected
const gcashQR = document.querySelector(".gcash-qr-container");
if (gcashQR && selected?.value === "gcash") {
  gcashQR.style.display = "block";
}

    return;
  }

  // Show modal
  modal.style.display = 'block';

  // Re-check GCash visibility in case it's hidden
  const selected = document.querySelector('input[name="payment"]:checked');
  document.getElementById("gcash-details").style.display = selected?.value === "gcash" ? "block" : "none";

  // Re-run QR visibility logic (if verification method changed)
  const method = document.getElementById("verification-method")?.value;
  document.getElementById("reference-input").style.display = method === 'reference' ? 'block' : 'none';
  document.getElementById("screenshot-input").style.display = method === 'screenshot' ? 'block' : 'none';

  // Show total
  document.getElementById("gcash-amount").textContent = calculateTotal().toFixed(2);
  document.getElementById("order-total").textContent = `₱${calculateTotal().toFixed(2)}`;
  renderOrderSummary();
});


  closeModalBtn.addEventListener('click', () => {
    modal.style.display = 'none';
  });

document.addEventListener("DOMContentLoaded", function () {
  const verificationSelect = document.getElementById("verification-method");
  const referenceInput = document.getElementById("reference-input");
  const screenshotInput = document.getElementById("screenshot-input");
  const gcashDetails = document.getElementById("gcash-details");
  const paymentRadios = document.querySelectorAll('input[name="payment"]');

  if (verificationSelect && referenceInput && screenshotInput && gcashDetails && paymentRadios.length > 0) {

    // Initial display state on load
    const selected = Array.from(paymentRadios).find(r => r.checked);
    gcashDetails.style.display = selected?.value === "gcash" ? "block" : "none";

    // Toggle between reference input and screenshot input
    verificationSelect.addEventListener('change', function () {
      const method = this.value;
      referenceInput.style.display = method === 'reference' ? 'block' : 'none';
      screenshotInput.style.display = method === 'screenshot' ? 'block' : 'none';
    });

    // Update GCash visibility on radio change
    paymentRadios.forEach(radio => {
      radio.addEventListener('change', function () {
        gcashDetails.style.display = this.value === "gcash" ? "block" : "none";
      });
    });
  }
});

  // Improved order summary rendering
  function renderOrderSummary() {
    orderSummary.innerHTML = '';
    cartItems.forEach(item => {
      const itemTotal = (item.price * item.quantity).toFixed(2);
      const div = document.createElement('div');
      div.className = 'order-item';
      div.innerHTML = `
        <span class="order-item-name">${item.name}</span>
        <span class="order-item-quantity">x${item.quantity}</span>
        <span class="order-item-price">₱${itemTotal}</span>
      `;
      orderSummary.appendChild(div);
    });
    orderTotal.textContent = '₱' + calculateTotal().toFixed(2);
    document.getElementById('gcash-amount').textContent = calculateTotal().toFixed(2);
  }

function addToCart(item) {
  const existingItem = cartItems.find(cartItem =>
    cartItem.name === item.name && cartItem.price === item.price
  );

  const liveStock = getLiveStock(item.name);
  const totalDesiredQty = (existingItem?.quantity || 0) + item.quantity;

  if (totalDesiredQty > liveStock) {
    alert(`⚠️ Cannot add more than available stock (${liveStock}) for ${item.name}`);
    return;
  }

  if (existingItem) {
    existingItem.quantity += item.quantity;
  } else {
    cartItems.push({ ...item });
  }

  updateCartCount();
  renderCart();
  cartSidebar.classList.add('active');
}


  // Enhanced menu card creation
  function createMenuCard(item) {
    const card = document.createElement('div');
    card.className = 'menu-item';
    
    const imgContainer = document.createElement('div');
    imgContainer.className = 'menu-item-img-container';
    
    const img = new Image();
    img.src = item.image;
    img.alt = item.name;
    img.className = 'menu-item-img';
    img.onload = () => img.classList.add('loaded');
    img.onerror = () => {
      img.src = 'designs/default-food.jpg';
      img.alt = 'Default food image';
    };
    imgContainer.appendChild(img);
    
    const infoDiv = document.createElement('div');
    infoDiv.className = 'menu-item-info';
    
    const nameEl = document.createElement('h3');
    nameEl.textContent = item.name;
    
    const descEl = document.createElement('p');
    descEl.textContent = item.description;
    
    infoDiv.append(nameEl, descEl);
    
    // Price options handling
    if (item.prices) {
      item.prices.forEach(price => {
        const variantName = `${item.name} - ${price.label}`;
        const liveStock = getLiveStock(variantName);
        const isOutOfStock = liveStock <= 0;
        
        const priceDiv = document.createElement('div');
        priceDiv.className = `price-option ${isOutOfStock ? 'out-of-stock' : ''}`;
        
        priceDiv.innerHTML = `
          <div class="price-header">
            <span class="price-label">${price.label}</span>
            <span class="price-value">₱${price.value.toFixed(2)}</span>
            <span class="stock-info">${isOutOfStock ? 'Out of Stock' : `Available: ${liveStock}`}</span>
          </div>
          <div class="add-to-cart">
            <input type="number" min="1" max="${liveStock}" value="1" 
                   class="quantity" ${isOutOfStock ? 'disabled' : ''}>
            <button class="add-btn" ${isOutOfStock ? 'disabled' : ''}>
              <i class="fas fa-cart-plus"></i> Add
            </button>
          </div>
        `;
        
        const addBtn = priceDiv.querySelector('.add-btn');
        addBtn.addEventListener('click', () => {
          const quantity = parseInt(priceDiv.querySelector('.quantity').value) || 1;
          addToCart({
            name: variantName,
            price: price.value,
            quantity: quantity
          });
        });
        
        infoDiv.appendChild(priceDiv);
      });
    } else {
      const liveStock = getLiveStock(item.name);
      const isOutOfStock = liveStock <= 0;
      const priceValue = parseFloat(item.price.replace('₱', '')) || 0;
      
      const priceDiv = document.createElement('div');
      priceDiv.className = `price-single ${isOutOfStock ? 'out-of-stock' : ''}`;
      
      priceDiv.innerHTML = `
        <div class="price-header">
          <span class="price-value">₱${priceValue.toFixed(2)}</span>
          <span class="stock-info">${isOutOfStock ? 'Out of Stock' : `Available: ${liveStock}`}</span>
        </div>
        <div class="add-to-cart">
          <input type="number" min="1" max="${liveStock}" value="1" 
                 class="quantity" ${isOutOfStock ? 'disabled' : ''}>
          <button class="add-btn" ${isOutOfStock ? 'disabled' : ''}>
            <i class="fas fa-cart-plus"></i> Add
          </button>
        </div>
      `;
      
      const addBtn = priceDiv.querySelector('.add-btn');
      addBtn.addEventListener('click', () => {
        const quantity = parseInt(priceDiv.querySelector('.quantity').value) || 1;
        addToCart({
          name: item.name,
          price: priceValue,
          quantity: quantity
        });
      });
      
      infoDiv.appendChild(priceDiv);
    }
    
    card.append(imgContainer, infoDiv);
    return card;
  }

  // Menu population function
  function populateMenu(category, items) {
    const container = document.querySelector(`#${category} .menu-grid`);
    if (!container) return;
    
    container.innerHTML = ''; // Clear existing items
    
    items.forEach(item => {
      try {
        const card = createMenuCard(item);
        container.appendChild(card);
      } catch (e) {
        console.error(`Error creating card for ${item.name}:`, e);
      }
    });
  }

  // Initialize menu from window.menuData
  const menuData = window.menuData;
  Object.keys(menuData).forEach(category => {
    populateMenu(category, menuData[category]);
  });

// Tab switching functionality
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const tabId = btn.dataset.tab;

    // Update active tab button
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    // Show corresponding menu category
    document.querySelectorAll('.menu-category').forEach(cat => {
      cat.classList.remove('active');
    });
    document.getElementById(tabId).classList.add('active');
  });
});

// Deduct stock after checkout
function deductStocksAfterCheckout() {
  const stocks = JSON.parse(localStorage.getItem("menuStocks")) || [];

  cartItems.forEach(cartItem => {
    const stockItem = stocks.find(s => s.name === cartItem.name);
    if (stockItem) {
      stockItem.stock = Math.max(0, stockItem.stock - cartItem.quantity);
    }
  });

  localStorage.setItem("menuStocks", JSON.stringify(stocks));
}

checkoutForm.addEventListener('submit', function (e) {
  e.preventDefault();

  const name = document.getElementById('customer-name').value;
  const address = document.getElementById('customer-address').value;
  const phone = document.getElementById('customer-phone').value;
  const serviceType = document.querySelector('input[name="service-type"]:checked').value;
  const paymentMethod = document.querySelector('input[name="payment"]:checked').value;
  const verificationMethod = document.getElementById('verification-method').value;

  let paymentProof = '';
  if (paymentMethod === 'gcash') {
    if (verificationMethod === 'reference') {
      paymentProof = `GCash Ref: ${document.getElementById('gcash-reference').value}`;
    } else {
      paymentProof = 'GCash Screenshot uploaded';
    }
  }

  const orderDetails = cartItems.map(item =>
    `• ${item.name} (x${item.quantity}) - ₱${(item.price * item.quantity).toFixed(2)}`
  ).join('\n');

  const totalAmount = cartTotalDisplay.textContent;
  const message = `NEW ORDER\n\nCustomer: ${name}\nAddress: ${address}\nContact: ${phone}\nService Type: ${serviceType}\n\nORDER DETAILS:\n${orderDetails}\n\nTOTAL: ₱${totalAmount}\nPAYMENT: ${paymentProof}\n\nPlease confirm this order.`;

  const encodedMessage = encodeURIComponent(message);
  const messengerLink = `https://m.me/109770141877066?text=${encodedMessage}`;

  if (confirm('Order complete! Click OK to send your order via Messenger.')) {
    window.open(messengerLink, '_blank');

    // ✅ 1. Deduct stocks
    const stocks = JSON.parse(localStorage.getItem("menuStocks")) || [];
    cartItems.forEach(cartItem => {
      const stockItem = stocks.find(s => s.name === cartItem.name);
      if (stockItem) {
        stockItem.stock = Math.max(0, stockItem.stock - cartItem.quantity);
      }
    });
    localStorage.setItem("menuStocks", JSON.stringify(stocks));

    // ✅ 2. Record sale
    const sales = JSON.parse(localStorage.getItem("salesRecords")) || [];
    sales.push({
      timestamp: new Date().toISOString(),
      amount: parseFloat(totalAmount),
      items: [...cartItems],
      name,
      phone,
      address,
      serviceType,
      paymentProof
    });
    localStorage.setItem("salesRecords", JSON.stringify(sales));
  }

  // ✅ 3. Clear cart
cartItems.length = 0;
updateCartCount();
renderCart();
cartTotalDisplay.textContent = "0.00"; // ✅ Add this line
checkoutForm.reset();
modal.style.display = 'none';
cartSidebar.classList.remove('active');
  });
});
