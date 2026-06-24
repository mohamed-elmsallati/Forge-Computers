document.addEventListener("DOMContentLoaded", () => {
  const cartCountEl = document.querySelector(".cart-count");
  let cartItems = loadCartItems();

  const formatPrice = (value) => `$${value.toFixed(2)}`;
  const parsePrice = (text) => Number(text.replace(/[^0-9.-]+/g, "")) || 0;

  const saveCartItems = (items) => {
    localStorage.setItem("forgeCartItems", JSON.stringify(items));
  };

  function loadCartItems() {
    try {
      return JSON.parse(localStorage.getItem("forgeCartItems") || "[]");
    } catch (error) {
      localStorage.removeItem("forgeCartItems");
      return [];
    }
  }

  const updateCartCount = () => {
    const totalQuantity = cartItems.reduce(
      (sum, item) => sum + item.quantity,
      0,
    );
    if (cartCountEl) {
      cartCountEl.textContent = totalQuantity;
    }
  };

  const renderCart = () => {
    const cartItemsEl = document.querySelector(".cart-items");
    const cartMessageEl = document.querySelector(".cart-message");
    const cartItemsListEl = document.querySelector(".cart-items-list");
    const cartTotalAmountEl = document.querySelector(".cart-total-amount");

    const totalQuantity = cartItems.reduce(
      (sum, item) => sum + item.quantity,
      0,
    );
    const totalCost = cartItems.reduce(
      (sum, item) => sum + item.quantity * item.unitPrice,
      0,
    );

    if (cartItemsEl && cartMessageEl) {
      if (totalQuantity > 0) {
        cartItemsEl.textContent = `You have ${totalQuantity} item${totalQuantity === 1 ? "" : "s"} in your cart.`;
        cartMessageEl.textContent = "Ready to checkout.";
      } else {
        cartItemsEl.textContent = "Your cart is empty.";
        cartMessageEl.textContent =
          "Browse components and add something to your cart.";
      }
    }

    if (cartItemsListEl) {
      if (cartItems.length > 0) {
        cartItemsListEl.innerHTML = cartItems
          .map(
            (item) => `
          <li class="cart-item-row">
            <span class="cart-item-name">${item.name}</span>
            <span class="cart-item-qty">x${item.quantity}</span>
            <span class="cart-item-price">${formatPrice(item.unitPrice)}</span>
            <span class="cart-item-line">${formatPrice(item.unitPrice * item.quantity)}</span>
          </li>
        `,
          )
          .join("");
      } else {
        cartItemsListEl.innerHTML = "";
      }
    }

    if (cartTotalAmountEl) {
      cartTotalAmountEl.textContent = formatPrice(totalCost);
    }

    saveCartItems(cartItems);
    updateCartCount();
  };

  const productGrid = document.querySelector(".product-grid");
  console.log("productGrid found:", !!productGrid);
  if (!productGrid) {
    console.warn(
      "product-grid element not found. Add-to-cart handlers will not be attached.",
    );
  }
  if (productGrid) {
    productGrid.addEventListener("click", (event) => {
      const button = event.target.closest(".add-btn");
      if (!button) return;
      event.preventDefault();

      const productCard = button.closest(".product-card");
      const productName =
        productCard?.querySelector(".product-name")?.textContent?.trim() ||
        "Item";
      const productPriceText =
        productCard?.querySelector(".product-price")?.textContent?.trim() ||
        "$0";
      const productPrice = parsePrice(productPriceText);

      console.log("Add-to-cart clicked:", productName, productPrice);

      const existingItem = cartItems.find(
        (item) => item.name === productName && item.unitPrice === productPrice,
      );
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        cartItems.push({
          name: productName,
          unitPrice: productPrice,
          quantity: 1,
        });
      }

      renderCart();
    });
  }

  const clearCartBtn = document.querySelector(".clear-cart-btn");
  const checkoutBtn = document.querySelector(".checkout-btn");

  const clearCart = () => {
    cartItems = [];
    saveCartItems(cartItems);
    renderCart();
  };

  if (clearCartBtn) {
    clearCartBtn.addEventListener("click", clearCart);
  }

  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", (event) => {
      event.preventDefault();
      const totalQuantity = cartItems.reduce(
        (sum, item) => sum + item.quantity,
        0,
      );
      const totalCost = cartItems.reduce(
        (sum, item) => sum + item.quantity * item.unitPrice,
        0,
      );
      const paymentMethod =
        document.querySelector('input[name="paymentMethod"]:checked')?.value ||
        "payment method";

      if (totalQuantity === 0) {
        alert("Your cart is empty. Add items first.");
        return;
      }

      alert(
        `Checkout ${totalQuantity} item${totalQuantity === 1 ? "" : "s"} for ${formatPrice(totalCost)} using ${paymentMethod}.`,
      );
    });
  }

  renderCart();
});

document.querySelector("form").addEventListener("submit", function (e) {
  const email = document.getElementById("email").value;

  localStorage.setItem("forge_username", email);
});

document
  .getElementById("signin-form")
  .addEventListener("submit", function (event) {
    // Get the value from the username input
    const emailValue = document.getElementById("username").value;

    // Save it to localStorage
    localStorage.setItem("forge_username", emailValue);

    // The form will now naturally redirect to user.html
    // because of the action="user.html" attribute in your HTML
  });
