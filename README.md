# TastyTracks — Premium Food Delivery Dashboard

TastyTracks is a modern, responsive food delivery dashboard built with vanilla HTML5, CSS3, and JavaScript. It recreates the visual design, typography, warm-cream aesthetic, dark navy/slate accents, and vibrant orange highlights of the reference dashboard.

---

## 🚀 Live Demo & Local Setup

### 🌐 Live Demo
The application is hosted live on GitHub Pages:
👉 **[https://astrionix.github.io/TastyTracks/](https://astrionix.github.io/TastyTracks/)**

---

### Option 1: Direct Browser Open
Simply double-click or open `index.html` in any modern web browser (Chrome, Safari, Firefox, Edge).

```bash
# On macOS
open index.html
```

### Option 2: Local HTTP Server (Recommended)
You can run a lightweight local static server using Python or Node:

```bash
# Using Python 3
python3 -m http.server 8000

# Or using npx serve
npx serve .
```
Then navigate to `http://localhost:8000` in your browser.

---

## 📁 Project Structure

```text
TastyTracks/
├── index.html                   # Semantic HTML5 dashboard layout
├── css/
│   └── styles.css               # Design system, CSS variables & responsive layout
├── js/
│   └── app.js                   # Form validation, tracker, membership & interactivity
├── assets/
│   └── images/
│       ├── pepperoni-pizza.jpg  # Product 1: Pepperoni Pizza ($12.99)
│       ├── cheese-burger.jpg    # Product 2: Cheese Burger ($9.50)
│       ├── veggie-wrap.jpg      # Product 3: Veggie Wrap ($7.25)
│       ├── chef-special.jpg     # Chef's Special: Spicy Ramen + Iced Tea Combo
│       └── avatar.png           # User Alex PRO profile avatar
├── reference_screenshot.png     # Visual reference mockup
└── README.md                    # Project documentation & guide
```

---

## 🎨 Features & Implementation Details

1. **Dashboard Header & Brand**:
   - Centered `TastyTracks` brand heading with subtitle.
   - User profile with circular avatar, thin orange border, and overlapping orange `PRO` badge.

2. **Explore Today's Specials**:
   - 3 product cards: Pepperoni Pizza (with `BEST SELLER` badge), Cheese Burger, and Veggie Wrap.
   - Click card or button to select item for the Quick Order form.
   - Hover card elevation and subtle shadow transitions.

3. **Quick Order Form**:
   - **Recipient Name** validation.
   - **Contact Number** with Indian 10-digit mobile number validation (starts with 6-9).
   - **Delivery Address** multiline textarea.
   - Inline **Payment Method** radio group (`Cash`, `Card`, `UPI`).
   - Accessible error states and clear validation messages.

4. **Chef's Special Card**:
   - Dark slate card with bright orange border.
   - `50% OFF` circular promotional badge.
   - Golden-yellow header, ramen + iced tea combo details, and live 20-minute ticker.
   - "Claim Combo" action that populates the quick order form directly.

5. **Membership Plans Table**:
   - Exact recreation of the reference table (Gold: $19.99, Silver: $9.99, Free: $0.00).
   - Dark slate rounded header, clean borders, and subtle alternating rows.
   - Interactive row selection with keyboard support and live summary indicator.

6. **Live Delivery Tracker**:
   - Pill-shaped progress track with orange indicator (initial reference state: 70%, *"Status: Your pizza is on the way!"*).
   - `CONFIRM ORDER` button that triggers form validation and produces order receipt confirmation.
   - Interactive stage controls (`Next Stage →`, `Reset Demo`) to simulate order fulfillment.

7. **Bottom Promotional Banner**:
   - Dark slate strip with coupon code `TASTY5` (click to copy to clipboard).

8. **Fully Responsive & Accessible**:
   - Optimized for Desktop (1440px), Tablet (768px-1024px), and Mobile (<768px).
   - WCAG compliant color contrast, ARIA attributes, semantic HTML5, and keyboard navigation.
