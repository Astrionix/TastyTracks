/**
 * TastyTracks — Premium Food Delivery Dashboard
 * JavaScript Application Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  // -------------------------------------------------------------------------
  // 1. Application State
  // -------------------------------------------------------------------------
  const state = {
    selectedItem: {
      id: 'pizza',
      name: 'Pepperoni Pizza',
      price: '$12.99',
      numericPrice: 12.99
    },
    membership: {
      plan: 'Free',
      fee: '$0.00',
      perk: 'Standard Delivery'
    },
    // Stages: 1 = Confirmed (25%), 2 = Preparing (50%), 3 = Out for Delivery (70-75%), 4 = Delivered (100%)
    deliveryStage: 3, 
    stages: [
      { id: 1, percent: 25, title: 'Confirmed', status: 'Status: Order confirmed! The kitchen is preparing fresh ingredients.' },
      { id: 2, percent: 50, title: 'Preparing', status: 'Status: Master chef is crafting your hot, delicious meal!' },
      { id: 3, percent: 70, title: 'On the way', status: 'Status: Your pizza is on the way!' },
      { id: 4, percent: 100, title: 'Delivered', status: 'Status: Delivered! Bon appétit, enjoy your meal!' }
    ],
    lastOrder: null
  };

  // -------------------------------------------------------------------------
  // 2. DOM Elements Cache
  // -------------------------------------------------------------------------
  const orderForm = document.getElementById('quickOrderForm');
  const recipientNameInput = document.getElementById('recipientName');
  const contactNumberInput = document.getElementById('contactNumber');
  const deliveryAddressInput = document.getElementById('deliveryAddress');
  const orderItemTitle = document.getElementById('orderItemTitle');
  const orderItemPriceTag = document.getElementById('orderItemPriceTag');

  const nameError = document.getElementById('recipientNameError');
  const contactError = document.getElementById('contactNumberError');
  const addressError = document.getElementById('deliveryAddressError');
  const paymentError = document.getElementById('paymentMethodError');

  const groupRecipientName = document.getElementById('groupRecipientName');
  const groupContactNumber = document.getElementById('groupContactNumber');
  const groupDeliveryAddress = document.getElementById('groupDeliveryAddress');
  const groupPaymentMethod = document.getElementById('groupPaymentMethod');

  // Product Cards
  const foodCards = document.querySelectorAll('.food-card');
  const btnClaimSpecial = document.getElementById('btnClaimSpecial');

  // Membership Elements
  const membershipRows = document.querySelectorAll('.membership-row');
  const selectedPlanName = document.getElementById('selectedPlanName');
  const selectedPlanFee = document.getElementById('selectedPlanFee');

  // Tracker Elements
  const deliveryStatusText = document.getElementById('deliveryStatusText');
  const progressFill = document.getElementById('progressFill');
  const progressTrack = document.getElementById('progressTrack');
  const trackerMilestones = document.querySelectorAll('.milestone');
  const btnConfirmOrder = document.getElementById('btnConfirmOrder');
  const btnSimulateStep = document.getElementById('btnSimulateStep');
  const btnResetOrder = document.getElementById('btnResetOrder');

  // Modal & Toast Elements
  const orderModal = document.getElementById('orderModal');
  const btnModalClose = document.getElementById('btnModalClose');
  const btnModalTrack = document.getElementById('btnModalTrack');
  const btnModalNewOrder = document.getElementById('btnModalNewOrder');
  const toastNotification = document.getElementById('toastNotification');
  const couponCode = document.getElementById('couponCode');
  const countdownElement = document.getElementById('offerCountdown');

  // -------------------------------------------------------------------------
  // 3. Toast Helper
  // -------------------------------------------------------------------------
  let toastTimer = null;
  function showToast(message, duration = 3200) {
    if (!toastNotification) return;
    
    toastNotification.textContent = message;
    toastNotification.classList.add('is-visible');

    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toastNotification.classList.remove('is-visible');
    }, duration);
  }

  // -------------------------------------------------------------------------
  // 4. Product Card Selection Logic
  // -------------------------------------------------------------------------
  function setOrderItem(id, name, price, numericPrice) {
    state.selectedItem = { id, name, price, numericPrice };
    
    if (orderItemTitle) orderItemTitle.textContent = name;
    if (orderItemPriceTag) orderItemPriceTag.textContent = price;

    // Update active state in cards
    foodCards.forEach(card => {
      const isCurrent = card.dataset.itemName === name;
      card.classList.toggle('is-active-item', isCurrent);
      
      const selectBtn = card.querySelector('.btn-select-item');
      if (selectBtn) {
        selectBtn.classList.toggle('active', isCurrent);
        const span = selectBtn.querySelector('span');
        if (span) {
          span.textContent = isCurrent ? 'Selected' : 'Select Item';
        }
      }
    });

    showToast(`Selected "${name}" (${price}) for your order`);
  }

  foodCards.forEach(card => {
    card.addEventListener('click', (e) => {
      const name = card.dataset.itemName;
      const price = `$${parseFloat(card.dataset.itemPrice).toFixed(2)}`;
      const numPrice = parseFloat(card.dataset.itemPrice);
      const id = card.dataset.itemId;
      setOrderItem(id, name, price, numPrice);
    });

    // Keyboard support for accessibility
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        card.click();
      }
    });
  });

  // Claim Chef Special
  if (btnClaimSpecial) {
    btnClaimSpecial.addEventListener('click', () => {
      setOrderItem('ramen-combo', "Spicy Ramen + Iced Tea Combo", '$12.00', 12.00);
      showToast("Chef's Special combo claimed! 50% discount applied.");
      // Scroll smoothly to quick order form
      const orderFormHeading = document.getElementById('orderFormHeading');
      if (orderFormHeading) {
        orderFormHeading.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
  }

  // -------------------------------------------------------------------------
  // 5. Membership Tier Selection
  // -------------------------------------------------------------------------
  membershipRows.forEach(row => {
    function selectPlan() {
      const plan = row.dataset.plan;
      const fee = row.dataset.fee;

      // Unselect all
      membershipRows.forEach(r => {
        r.classList.remove('is-selected');
        r.setAttribute('aria-pressed', 'false');
      });

      // Select clicked
      row.classList.add('is-selected');
      row.setAttribute('aria-pressed', 'true');

      let perk = 'Standard Delivery';
      if (plan === 'Gold') perk = 'Unlimited Free Delivery + 20% Cashback';
      else if (plan === 'Silver') perk = '10 Free Deliveries + 5% Cashback';

      state.membership = { plan, fee, perk };

      if (selectedPlanName) selectedPlanName.textContent = plan;
      if (selectedPlanFee) selectedPlanFee.textContent = `${fee} / month`;

      showToast(`Selected ${plan} Plan (${fee}/mo)`);
    }

    row.addEventListener('click', selectPlan);
    row.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        selectPlan();
      }
    });
  });

  // -------------------------------------------------------------------------
  // 6. Form Validation Helpers
  // -------------------------------------------------------------------------
  function validateName() {
    const val = recipientNameInput.value.trim();
    if (!val) {
      setError(groupRecipientName, nameError, 'Please enter the recipient name.');
      return false;
    }
    if (val.length < 2) {
      setError(groupRecipientName, nameError, 'Name must be at least 2 characters.');
      return false;
    }
    clearError(groupRecipientName, nameError);
    return true;
  }

  function validateContact() {
    let val = contactNumberInput.value.trim();
    // Strip spaces, dashes, +91
    let clean = val.replace(/^(\+91)/, '').replace(/[\s\-]/g, '');

    if (!clean) {
      setError(groupContactNumber, contactError, 'Please enter a contact number.');
      return false;
    }

    // Indian mobile number: 10 digits starting with 6, 7, 8, or 9
    const regexIndianMobile = /^[6-9]\d{9}$/;
    if (!regexIndianMobile.test(clean)) {
      setError(groupContactNumber, contactError, 'Enter a valid 10-digit Indian mobile number (starts with 6-9).');
      return false;
    }

    clearError(groupContactNumber, contactError);
    return true;
  }

  function validateAddress() {
    const val = deliveryAddressInput.value.trim();
    if (!val) {
      setError(groupDeliveryAddress, addressError, 'Please enter your complete delivery address.');
      return false;
    }
    if (val.length < 6) {
      setError(groupDeliveryAddress, addressError, 'Address is too short. Include street or flat details.');
      return false;
    }
    clearError(groupDeliveryAddress, addressError);
    return true;
  }

  function validatePayment() {
    const selectedRadio = document.querySelector('input[name="paymentMethod"]:checked');
    if (!selectedRadio) {
      setError(groupPaymentMethod, paymentError, 'Please select a payment method.');
      return false;
    }
    clearError(groupPaymentMethod, paymentError);
    return true;
  }

  function setError(groupEl, errorEl, message) {
    if (groupEl) groupEl.classList.add('has-error');
    if (errorEl) {
      errorEl.textContent = message;
      errorEl.style.display = 'block';
    }
  }

  function clearError(groupEl, errorEl) {
    if (groupEl) groupEl.classList.remove('has-error');
    if (errorEl) {
      errorEl.textContent = '';
      errorEl.style.display = 'none';
    }
  }

  // Real-time clear on input
  recipientNameInput?.addEventListener('input', () => {
    if (recipientNameInput.value.trim().length >= 2) {
      clearError(groupRecipientName, nameError);
    }
  });

  contactNumberInput?.addEventListener('input', () => {
    let clean = contactNumberInput.value.trim().replace(/^(\+91)/, '').replace(/[\s\-]/g, '');
    if (/^[6-9]\d{9}$/.test(clean)) {
      clearError(groupContactNumber, contactError);
    }
  });

  deliveryAddressInput?.addEventListener('input', () => {
    if (deliveryAddressInput.value.trim().length >= 6) {
      clearError(groupDeliveryAddress, addressError);
    }
  });

  document.querySelectorAll('input[name="paymentMethod"]').forEach(radio => {
    radio.addEventListener('change', () => {
      clearError(groupPaymentMethod, paymentError);
    });
  });

  // -------------------------------------------------------------------------
  // 7. Delivery Tracker & Progress Control
  // -------------------------------------------------------------------------
  function updateDeliveryTracker(stageIndex) {
    // Stage is 1-indexed (1 to 4)
    const stage = state.stages.find(s => s.id === stageIndex) || state.stages[0];
    state.deliveryStage = stage.id;

    // Update progress bar
    if (progressFill) {
      progressFill.style.width = `${stage.percent}%`;
    }
    if (progressTrack) {
      progressTrack.setAttribute('aria-valuenow', stage.percent);
    }

    // Update status text
    if (deliveryStatusText) {
      // If we have custom food name:
      if (stage.id === 3 && state.selectedItem.name !== 'Pepperoni Pizza') {
        deliveryStatusText.textContent = `Status: Your ${state.selectedItem.name} is on the way!`;
      } else {
        deliveryStatusText.textContent = stage.status;
      }
    }

    // Update milestones
    trackerMilestones.forEach(m => {
      const mStage = parseInt(m.dataset.stage, 10);
      m.classList.remove('is-active', 'is-passed');
      if (mStage < stage.id) {
        m.classList.add('is-passed');
      } else if (mStage === stage.id) {
        m.classList.add('is-active');
      }
    });
  }

  // Next stage simulation button
  if (btnSimulateStep) {
    btnSimulateStep.addEventListener('click', () => {
      let next = state.deliveryStage + 1;
      if (next > 4) next = 1; // Cycle or wrap
      updateDeliveryTracker(next);
      showToast(`Delivery status updated: ${state.stages[next - 1].title}`);
    });
  }

  // Reset demo
  if (btnResetOrder) {
    btnResetOrder.addEventListener('click', () => {
      updateDeliveryTracker(3); // Reset back to screenshot default (Stage 3, 70%)
      if (orderForm) orderForm.reset();
      clearError(groupRecipientName, nameError);
      clearError(groupContactNumber, contactError);
      clearError(groupDeliveryAddress, addressError);
      clearError(groupPaymentMethod, paymentError);
      setOrderItem('pizza', 'Pepperoni Pizza', '$12.99', 12.99);
      showToast('Delivery tracker reset to default reference state.');
    });
  }

  // -------------------------------------------------------------------------
  // 8. Order Submission & Confirmation
  // -------------------------------------------------------------------------
  function handleOrderSubmission(e) {
    if (e) e.preventDefault();

    const isNameValid = validateName();
    const isContactValid = validateContact();
    const isAddressValid = validateAddress();
    const isPaymentValid = validatePayment();

    if (!isNameValid || !isContactValid || !isAddressValid || !isPaymentValid) {
      // Focus first invalid field
      if (!isNameValid) recipientNameInput.focus();
      else if (!isContactValid) contactNumberInput.focus();
      else if (!isAddressValid) deliveryAddressInput.focus();
      
      showToast('⚠️ Please correct the errors in the order form.');
      return;
    }

    // Capture valid order
    const selectedRadio = document.querySelector('input[name="paymentMethod"]:checked');
    const paymentMethod = selectedRadio ? selectedRadio.value : 'Cash';

    state.lastOrder = {
      customerName: recipientNameInput.value.trim(),
      contact: contactNumberInput.value.trim(),
      address: deliveryAddressInput.value.trim(),
      paymentMethod: paymentMethod,
      item: state.selectedItem,
      membership: state.membership,
      timestamp: new Date()
    };

    // Update delivery tracker to Stage 1: Confirmed
    updateDeliveryTracker(1);

    // Populate modal receipt
    const modalCustomerName = document.getElementById('modalCustomerName');
    const receiptItemName = document.getElementById('receiptItemName');
    const receiptItemPrice = document.getElementById('receiptItemPrice');
    const receiptAddress = document.getElementById('receiptAddress');
    const receiptPayment = document.getElementById('receiptPayment');
    const receiptMembership = document.getElementById('receiptMembership');

    if (modalCustomerName) modalCustomerName.textContent = state.lastOrder.customerName;
    if (receiptItemName) receiptItemName.textContent = state.lastOrder.item.name;
    if (receiptItemPrice) receiptItemPrice.textContent = state.lastOrder.item.price;
    if (receiptAddress) receiptAddress.textContent = state.lastOrder.address;
    if (receiptPayment) receiptPayment.textContent = state.lastOrder.paymentMethod;
    if (receiptMembership) receiptMembership.textContent = `${state.lastOrder.membership.plan} (${state.lastOrder.membership.perk})`;

    // Open Modal
    if (orderModal) {
      orderModal.hidden = false;
      // Trigger CSS transition
      requestAnimationFrame(() => {
        orderModal.classList.add('is-open');
      });
    }

    showToast(`Order confirmed for ${state.lastOrder.customerName}! 🍕`);
  }

  // Hook confirm button to order submission
  if (btnConfirmOrder) {
    btnConfirmOrder.addEventListener('click', handleOrderSubmission);
  }

  if (orderForm) {
    orderForm.addEventListener('submit', handleOrderSubmission);
  }

  // Modal interactions
  function closeModal() {
    if (!orderModal) return;
    orderModal.classList.remove('is-open');
    setTimeout(() => {
      orderModal.hidden = true;
    }, 300);
  }

  if (btnModalClose) btnModalClose.addEventListener('click', closeModal);
  
  if (btnModalTrack) {
    btnModalTrack.addEventListener('click', () => {
      closeModal();
      const trackerHeading = document.getElementById('trackerHeading');
      if (trackerHeading) {
        trackerHeading.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
  }

  if (btnModalNewOrder) {
    btnModalNewOrder.addEventListener('click', () => {
      closeModal();
      if (orderForm) orderForm.reset();
      recipientNameInput.focus();
    });
  }

  // Close modal on escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && orderModal && !orderModal.hidden) {
      closeModal();
    }
  });

  // -------------------------------------------------------------------------
  // 9. Coupon Code Copy Interaction
  // -------------------------------------------------------------------------
  if (couponCode) {
    couponCode.addEventListener('click', () => {
      const code = couponCode.textContent.trim();
      if (navigator.clipboard) {
        navigator.clipboard.writeText(code).then(() => {
          showToast(`Coupon code "${code}" copied to clipboard! 🎁`);
        }).catch(() => {
          showToast(`Use coupon code "${code}" for $5 off!`);
        });
      } else {
        showToast(`Use coupon code "${code}" for $5 off!`);
      }
    });
  }

  // -------------------------------------------------------------------------
  // 10. Chef's Special Countdown Timer (20 minutes ticker)
  // -------------------------------------------------------------------------
  if (countdownElement) {
    let remainingSeconds = 19 * 60 + 42; // 19m 42s initially
    setInterval(() => {
      if (remainingSeconds <= 0) {
        remainingSeconds = 20 * 60; // Refresh 20m window
      } else {
        remainingSeconds--;
      }
      const mins = Math.floor(remainingSeconds / 60);
      const secs = remainingSeconds % 60;
      const formatted = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
      countdownElement.innerHTML = `<span class="clock-icon">⏱️</span> ${formatted} left`;
    }, 1000);
  }

  // -------------------------------------------------------------------------
  // 11. Image Error Fallback Handler
  // -------------------------------------------------------------------------
  document.querySelectorAll('img').forEach(img => {
    img.addEventListener('error', () => {
      img.style.display = 'none';
      if (img.parentElement) {
        img.parentElement.style.background = 'linear-gradient(135deg, #FF713F 0%, #344957 100%)';
        img.parentElement.style.display = 'flex';
        img.parentElement.style.alignItems = 'center';
        img.parentElement.style.justifyContent = 'center';
        img.parentElement.style.color = '#FFFFFF';
        img.parentElement.style.fontWeight = 'bold';
        img.parentElement.innerHTML = '<span style="font-size:2rem;">🍕 TastyTracks</span>';
      }
    });
  });

  // Initialize tracker to reference screenshot state (Stage 3, 70%)
  updateDeliveryTracker(3);
});
