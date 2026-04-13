# ⚡ GrowPilot AI

> AI-powered business management platform for Indian MSMEs — automate inventory, chat with customers, and generate marketing content from one dashboard.

Built for **Hack Fest 2026** | IT Department Labs | April 15, 2026

---

## 🚀 Live Demo Flow

```
Landing Page → Dashboard → AI Chatbot → Inventory → Marketing AI → Expenses → Reports
```

---

## ✨ Features

| Module | What It Does |
|---|---|
| **Owner Dashboard** | KPI cards (revenue, orders, stock alerts), weekly sales chart, AI recommendations |
| **AI Customer Assistant** | Live chat powered by Claude — answers product queries, takes orders, supports Hindi/English |
| **Inventory Management** | Real-time stock tracking with critical/low/good status, search, filters, full CRUD |
| **AI Marketing Generator** | One-click Instagram, WhatsApp & Facebook promo content using Claude |
| **Expense Tracker** | Pie chart breakdown, revenue vs expenses area chart, AI cost insight |
| **Business Reports** | Best sellers, customer tiers, category analysis, AI sales forecast |

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend Framework | React 18 + Vite |
| Routing | React Router DOM v6 |
| Charts | Recharts |
| Icons | Lucide React |
| AI | Anthropic Claude (`claude-sonnet-4-5`) |
| Styling | Vanilla CSS (custom design system) |
| State | React `useState` (no backend required) |

---

## 📦 Project Structure

```
growpilot/
├── src/
│   ├── components/
│   │   ├── layout/       # Sidebar, Topbar
│   │   └── ui/           # ToastContainer
│   ├── pages/            # One file per route
│   ├── data/
│   │   └── mockData.js   # All realistic MSME sample data
│   ├── hooks/
│   │   └── useAI.js      # Anthropic API calls + graceful fallbacks
│   └── utils/
│       └── helpers.js    # Toast hook, formatters
├── index.html
└── .env                  # Add your API key here (git-ignored)
```

---

## ⚙️ Getting Started

### 1. Install Dependencies

```bash
cd growpilot
npm install
```

### 2. Add Your Anthropic API Key (Optional)

Create a `.env` file in the `growpilot/` directory:

```env
VITE_ANTHROPIC_API_KEY=your-claude-api-key-here
```

> **Without a key:** The app runs fully with realistic pre-built fallback responses — perfect for demos with no internet.

### 3. Start the Dev Server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---

## 🎯 Demo Script (3 Minutes)

1. **Landing Page** — Explain the MSME problem and GrowPilot's solution *(30 sec)*
2. **Dashboard** — Show KPI cards, weekly sales chart, AI recommendation panel *(30 sec)*
3. **AI Chatbot** — Type *"Is rice available?"* → show live AI response in context *(45 sec)*
4. **Inventory** — Highlight the critical stock alert banner and color-coded status badges *(20 sec)*
5. **Marketing AI** — Generate an "Eid Sale on Rice" Instagram post, copy it *(30 sec)*
6. **Close** — Mention WhatsApp integration, expense tracker, AI sales forecast *(15 sec)*

---

## 🗂️ Pages & Routes

| Route | Page |
|---|---|
| `/` | Landing Page |
| `/dashboard` | Owner Dashboard |
| `/chatbot` | AI Customer Assistant |
| `/inventory` | Inventory Management |
| `/marketing` | AI Marketing Generator |
| `/expenses` | Expense & Profit Tracker |
| `/reports` | Business Reports |

---

## 🎨 Design System

- **Primary:** `#2563EB` (Blue 600)
- **Success:** `#16A34A` (Green 600)
- **Warning:** `#D97706` (Amber 600)
- **Danger:** `#DC2626` (Red 600)
- **Purple:** `#7C3AED`
- **Font:** Inter (Google Fonts)
- **Sidebar:** `#0F172A` (Slate 900 dark navy)
- **Background:** `#F0F4FF`

---

## 📊 Mock Data Context

All data uses a realistic Indian MSME scenario:

- **Store:** Sharma General Store, Bangalore
- **Owner:** Rajesh Sharma
- **Products:** Rice 5kg, Sugar 1kg, Cooking Oil 1L, Wheat Flour 5kg, Tea Powder 500g, and more
- **Daily Revenue:** ₹15,240 | **Orders:** 23 | **Forecast:** ₹1,12,000/week

---

*Made with ❤️ for Indian small businesses. 🇮🇳*
