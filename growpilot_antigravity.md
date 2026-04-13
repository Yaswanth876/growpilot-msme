# GrowPilot AI — Antigravity Build Specification
**Model:** `claude-sonnet-4-6` | **Target:** Antigravity Agentic Build System  
**Hackathon:** Hack Fest 2026 | **Submission Deadline:** April 13, 2026 – 6PM  
**Event:** April 15, 2026 | IT Department Labs

---

## 1. Project Overview

**GrowPilot AI** is a full-stack AI-powered business management platform for MSMEs (Micro, Small & Medium Enterprises). It solves:
- Manual inventory tracking → **AI-powered inventory alerts**
- Missed customer messages → **AI chatbot + WhatsApp integration**
- No marketing tools → **AI content generator**
- No business insights → **Analytics dashboard**

**Core Stack:**
- Frontend: React (JSX) + Tailwind CSS + shadcn/ui
- Charts: Recharts
- AI: Anthropic API (`claude-sonnet-4-6` via `/v1/messages`)
- State: React useState/useReducer (no localStorage, no sessionStorage)
- Icons: lucide-react

---

## 2. Architecture

```
GrowPilot AI
├── /landing          → Landing Page (public-facing)
├── /dashboard        → Owner Dashboard (main hub)
├── /chatbot          → AI Customer Support Module
├── /inventory        → Inventory Management
├── /marketing        → AI Marketing Generator
├── /expenses         → Expense & Profit Tracker
└── /reports          → Business Reports & Forecasts
```

All state is managed in-memory using React hooks. No backend required for MVP. The AI chatbot calls the Anthropic API directly from the frontend artifact.

---

## 3. Screen-by-Screen Build Specification

### 3.1 Landing Page (`/landing`)

**Purpose:** Convert visitors to trial users. Must be visually impressive for judges.

**Sections (top to bottom):**

```jsx
// Hero Section
<HeroSection>
  <Headline>"Grow Your Small Business with AI"</Headline>
  <Subtext>"Automate operations, delight customers, and boost revenue — all from one AI platform."</Subtext>
  <CTAButtons>
    <Button variant="primary">Start Free Trial</Button>
    <Button variant="outline">Watch Demo</Button>
  </CTAButtons>
</HeroSection>

// Benefits Strip (3 cards horizontal)
<BenefitsStrip>
  <BenefitCard icon="Clock" title="Save Time" desc="Automate repetitive tasks" />
  <BenefitCard icon="TrendingUp" title="Increase Sales" desc="AI-driven insights" />
  <BenefitCard icon="ShieldCheck" title="Reduce Errors" desc="Smart inventory & billing" />
</BenefitsStrip>

// Features Grid (2x2 or 2x3)
<FeaturesGrid>
  <FeatureCard icon="Bot" title="AI Chatbot" />
  <FeatureCard icon="Package" title="Smart Inventory" />
  <FeatureCard icon="BarChart2" title="Business Insights" />
  <FeatureCard icon="Megaphone" title="Marketing AI" />
</FeaturesGrid>

// Footer
<Footer links={["Contact", "About", "Terms"]} />
```

**UI Spec:**
- Background: `#FFFFFF`
- Primary: `#2563EB` (blue-600)
- Success: `#16A34A` (green-600)
- Hero gradient: `from-blue-50 to-white`
- All cards: `rounded-2xl shadow-md`
- Font: System sans-serif, heading bold

---

### 3.2 Owner Dashboard (`/dashboard`)

**Purpose:** Central command hub. First screen judges see. Must show data richness.

**Top KPI Cards (4 in a row):**

```jsx
const kpiData = [
  { label: "Revenue Today", value: "₹15,000", icon: "IndianRupee", color: "blue" },
  { label: "Orders", value: "23", icon: "ShoppingBag", color: "green" },
  { label: "Low Stock Items", value: "4", icon: "AlertTriangle", color: "orange" },
  { label: "Customer Queries", value: "8", icon: "MessageSquare", color: "purple" },
];
```

**Sales Chart (Recharts BarChart):**
```jsx
const weeklyData = [
  { day: "Mon", sales: 8000 },
  { day: "Tue", sales: 12000 },
  { day: "Wed", sales: 9500 },
  { day: "Thu", sales: 15000 },
  { day: "Fri", sales: 11000 },
  { day: "Sat", sales: 18000 },
  { day: "Sun", sales: 7000 },
];

<BarChart data={weeklyData}>
  <XAxis dataKey="day" />
  <YAxis />
  <Bar dataKey="sales" fill="#2563EB" radius={[4,4,0,0]} />
</BarChart>
```

**AI Recommendations Panel:**
```jsx
const aiInsights = [
  { type: "warning", text: "Sales dropped because Product A stock ended. Restock today." },
  { type: "info", text: "Peak sales on Saturday. Prepare extra stock for next weekend." },
  { type: "success", text: "Customer retention improved by 12% this week." },
];
```

**Sidebar Navigation:**
```jsx
const navItems = [
  { label: "Dashboard", icon: "LayoutDashboard", path: "/dashboard" },
  { label: "Customers", icon: "Users", path: "/chatbot" },
  { label: "Inventory", icon: "Package", path: "/inventory" },
  { label: "Marketing AI", icon: "Megaphone", path: "/marketing" },
  { label: "Reports", icon: "BarChart2", path: "/reports" },
  { label: "Settings", icon: "Settings", path: "/settings" },
];
```

---

### 3.3 AI Customer Support Module (`/chatbot`)

**Purpose:** Live AI chat using Anthropic API. This is the WOW demo feature.

**Anthropic API Integration:**

```javascript
const systemPrompt = `You are GrowPilot AI, a smart business assistant for a small Indian retail shop. 
You help customers check product availability, place orders, and answer FAQs.
Current inventory:
- Rice 5kg: ₹320 (5 units available)
- Sugar 1kg: ₹48 (2 units — LOW STOCK)
- Cooking Oil 1L: ₹180 (20 units)
- Wheat Flour 5kg: ₹280 (8 units)

Rules:
- Always respond in the same language the customer uses (Hindi or English)
- For orders, ask for name and address
- For low stock items, warn customer about limited availability
- Be friendly, concise, and helpful
- Format prices with ₹ symbol`;

async function sendMessage(userMessage, conversationHistory) {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: 1000,
      system: systemPrompt,
      messages: conversationHistory,
    }),
  });
  const data = await response.json();
  return data.content[0].text;
}
```

**Chat UI Components:**
```jsx
<ChatInterface>
  <ChatHeader title="GrowPilot AI Assistant" subtitle="Online • Typically replies instantly" />
  <MessageList>
    {messages.map(msg => (
      <MessageBubble 
        key={msg.id}
        role={msg.role}        // "user" or "assistant"
        content={msg.content}
        timestamp={msg.time}
        // user: right-aligned, blue bg
        // assistant: left-aligned, gray bg with bot avatar
      />
    ))}
    {isTyping && <TypingIndicator />}  // 3-dot animation
  </MessageList>
  <ChatInput 
    onSend={handleSend}
    placeholder="Type your message..."
  />
  <WhatsAppBadge text="WhatsApp Integration Ready" />
</ChatInterface>
```

**State Management:**
```javascript
const [messages, setMessages] = useState([
  { 
    id: 1, role: "assistant", 
    content: "Namaste! I'm GrowPilot AI. How can I help you today? 🙏",
    time: "now"
  }
]);
const [conversationHistory, setConversationHistory] = useState([]);
const [isTyping, setIsTyping] = useState(false);

async function handleSend(inputText) {
  const userMsg = { role: "user", content: inputText };
  const newHistory = [...conversationHistory, userMsg];
  
  setMessages(prev => [...prev, { id: Date.now(), role: "user", content: inputText, time: "now" }]);
  setConversationHistory(newHistory);
  setIsTyping(true);
  
  const reply = await sendMessage(inputText, newHistory);
  setIsTyping(false);
  
  setConversationHistory(prev => [...prev, { role: "assistant", content: reply }]);
  setMessages(prev => [...prev, { id: Date.now() + 1, role: "assistant", content: reply, time: "now" }]);
}
```

---

### 3.4 Inventory Management Module (`/inventory`)

**Purpose:** Show real-time stock status with AI-powered alerts.

**Data Model:**
```javascript
const [inventory, setInventory] = useState([
  { id: 1, product: "Rice 5kg", stock: 5, unit: "bags", status: "low", threshold: 10 },
  { id: 2, product: "Sugar 1kg", stock: 2, unit: "pkts", status: "critical", threshold: 5 },
  { id: 3, product: "Cooking Oil 1L", stock: 20, unit: "btls", status: "good", threshold: 8 },
  { id: 4, product: "Wheat Flour 5kg", stock: 8, unit: "bags", status: "low", threshold: 10 },
  { id: 5, product: "Tea Powder 500g", stock: 15, unit: "pkts", status: "good", threshold: 6 },
]);
```

**Status Color Logic:**
```javascript
const statusConfig = {
  critical: { color: "red", bg: "bg-red-100", text: "text-red-700", label: "Critical" },
  low: { color: "orange", bg: "bg-orange-100", text: "text-orange-700", label: "Low Stock" },
  good: { color: "green", bg: "bg-green-100", text: "text-green-700", label: "Good" },
};
```

**Table UI:**
```jsx
<InventoryTable>
  <TableHeader cols={["Product", "Stock", "Unit", "Status", "Actions"]} />
  <TableBody>
    {inventory.map(item => (
      <TableRow key={item.id}>
        <td>{item.product}</td>
        <td>{item.stock}</td>
        <td>{item.unit}</td>
        <td><StatusBadge status={item.status} /></td>
        <td><EditButton /><DeleteButton /></td>
      </TableRow>
    ))}
  </TableBody>
</InventoryTable>

// Action Buttons
<Button onClick={openAddModal}>+ Add Product</Button>
<Button variant="outline" onClick={generatePO}>Generate Purchase Order</Button>
```

**AI Alert Panel:**
```jsx
const aiAlerts = inventory
  .filter(item => item.status === "critical" || item.status === "low")
  .map(item => ({
    message: item.status === "critical" 
      ? `⚠️ ${item.product} will run out tomorrow! Only ${item.stock} left.`
      : `📦 ${item.product} is running low. Consider restocking soon.`
  }));
```

---

### 3.5 AI Marketing Generator (`/marketing`)

**Purpose:** Generate promotional content using Anthropic API. Judges love live AI generation.

**Input Form State:**
```javascript
const [formData, setFormData] = useState({
  productName: "",
  offerPercent: "",
  occasion: "",
  platform: "instagram", // "instagram" | "whatsapp" | "facebook"
});
const [generatedContent, setGeneratedContent] = useState(null);
const [isGenerating, setIsGenerating] = useState(false);
```

**Anthropic API Call:**
```javascript
async function generateMarketing() {
  setIsGenerating(true);
  const prompt = `Generate promotional marketing content for a small Indian business.
  
Product: ${formData.productName}
Offer: ${formData.offerPercent}% discount
Occasion: ${formData.occasion}
Platform: ${formData.platform}

Return JSON only (no markdown):
{
  "instagram": "Instagram post text with emojis (max 150 chars)",
  "whatsapp": "WhatsApp message text (friendly, max 200 chars)", 
  "hashtags": ["tag1", "tag2", "tag3"],
  "callToAction": "Short CTA phrase"
}`;

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: 1000,
      messages: [{ role: "user", content: prompt }],
    }),
  });
  
  const data = await response.json();
  try {
    const text = data.content[0].text.replace(/```json|```/g, "").trim();
    setGeneratedContent(JSON.parse(text));
  } catch {
    setGeneratedContent({ error: "Generation failed. Try again." });
  }
  setIsGenerating(false);
}
```

**Output UI:**
```jsx
{generatedContent && (
  <ContentOutputPanel>
    <ContentCard 
      platform="Instagram"
      icon="Instagram"
      content={generatedContent.instagram}
      onCopy={() => navigator.clipboard.writeText(generatedContent.instagram)}
    />
    <ContentCard 
      platform="WhatsApp"
      icon="MessageCircle"
      content={generatedContent.whatsapp}
      onCopy={() => navigator.clipboard.writeText(generatedContent.whatsapp)}
    />
    <HashtagsDisplay tags={generatedContent.hashtags} />
    <CTADisplay cta={generatedContent.callToAction} />
  </ContentOutputPanel>
)}
```

---

### 3.6 Expense & Profit Screen (`/expenses`)

**Purpose:** Financial overview with AI insight.

**Data:**
```javascript
const expenseData = {
  totalExpenses: 45000,
  profit: 22000,
  revenue: 67000,
  breakdown: [
    { category: "Rent", amount: 10000, icon: "Home" },
    { category: "Staff", amount: 15000, icon: "Users" },
    { category: "Electricity", amount: 8000, icon: "Zap", alert: true },
    { category: "Inventory", amount: 12000, icon: "Package" },
  ],
  aiInsight: "Electricity bill increased by 18% vs last month. Consider switching to LED lighting."
};
```

**Chart:**
```jsx
<PieChart>
  <Pie data={expenseData.breakdown} dataKey="amount" nameKey="category">
    {expenseData.breakdown.map((entry, i) => (
      <Cell key={i} fill={COLORS[i]} />
    ))}
  </Pie>
  <Tooltip formatter={(val) => `₹${val.toLocaleString('en-IN')}`} />
  <Legend />
</PieChart>
```

---

### 3.7 Reports Screen (`/reports`)

**Purpose:** Business intelligence and forecasting.

**Report Cards:**
```javascript
const reportData = {
  bestSelling: { product: "Rice 5kg", units: 142, revenue: "₹45,440" },
  returningCustomers: { count: 34, percentage: "68%", trend: "+12%" },
  peakOrderTime: { time: "6:00 PM – 8:00 PM", dayOfWeek: "Saturday" },
  salesForecast: { nextWeek: "₹1,12,000", confidence: "87%", trend: "up" }
};
```

---

## 4. Component Library Reference

### Reusable Components to Build Once

```jsx
// KPICard
const KPICard = ({ label, value, icon: Icon, color, trend }) => (
  <div className={`bg-white rounded-2xl shadow-md p-6 border-l-4 border-${color}-500`}>
    <div className="flex justify-between items-start">
      <div>
        <p className="text-gray-500 text-sm">{label}</p>
        <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
        {trend && <p className="text-green-600 text-xs mt-1">{trend}</p>}
      </div>
      <Icon className={`text-${color}-500`} size={32} />
    </div>
  </div>
);

// StatusBadge
const StatusBadge = ({ status }) => {
  const config = statusConfig[status];
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
      {config.label}
    </span>
  );
};

// SectionHeader
const SectionHeader = ({ title, subtitle, action }) => (
  <div className="flex justify-between items-center mb-6">
    <div>
      <h2 className="text-xl font-bold text-gray-900">{title}</h2>
      {subtitle && <p className="text-gray-500 text-sm mt-1">{subtitle}</p>}
    </div>
    {action}
  </div>
);
```

---

## 5. Design System

```css
/* Color Tokens */
--primary: #2563EB;       /* blue-600 */
--primary-light: #EFF6FF; /* blue-50 */
--success: #16A34A;       /* green-600 */
--warning: #D97706;       /* amber-600 */
--danger: #DC2626;        /* red-600 */
--text-primary: #111827;  /* gray-900 */
--text-secondary: #6B7280;/* gray-500 */
--bg: #F9FAFB;            /* gray-50 */
--card-bg: #FFFFFF;
--border: #E5E7EB;        /* gray-200 */
--radius: 16px;           /* rounded-2xl */
--shadow: 0 1px 3px rgba(0,0,0,0.1);
```

**Typography Scale:**
- Heading 1: `text-3xl font-bold`
- Heading 2: `text-xl font-bold`
- Body: `text-base text-gray-700`
- Caption: `text-sm text-gray-500`
- Metric: `text-2xl font-bold`

---

## 6. Anthropic API Usage Summary

| Module | API Purpose | System Prompt Focus |
|--------|-------------|---------------------|
| Chatbot | Multi-turn conversation | Shop assistant with inventory context |
| Marketing Generator | Single-turn JSON output | Content creation with JSON schema |
| Dashboard Insights | (Static mock for MVP) | Pre-loaded AI-style insights |

**Error Handling Pattern for all API calls:**
```javascript
try {
  const response = await fetch("https://api.anthropic.com/v1/messages", { ... });
  if (!response.ok) throw new Error(`API error: ${response.status}`);
  const data = await response.json();
  return data.content[0].text;
} catch (error) {
  console.error("Anthropic API error:", error);
  return "I'm having trouble connecting. Please try again.";
}
```

---

## 7. Build Priority Order (MVP for Round 1)

Build in this exact order to maximize hackathon score:

| Priority | Screen | Judges Score Impact | Time Estimate |
|----------|--------|---------------------|---------------|
| 1 | Landing Page | First impression | 30 min |
| 2 | Dashboard | Richness & data | 45 min |
| 3 | AI Chatbot | WOW live AI demo | 60 min |
| 4 | Inventory | Practical feature | 30 min |
| 5 | Marketing AI | Second AI demo | 30 min |
| 6 | Expenses | Financial depth | 20 min |
| 7 | Reports | Business insight | 20 min |

**Total estimated: ~3.5 hours for complete MVP**

---

## 8. Hackathon Evaluation Alignment

| Criterion (10 pts each) | GrowPilot Feature |
|------------------------|-------------------|
| Problem Understanding | MSME pain points addressed in all 7 modules |
| Innovation & Design | Live AI chatbot + AI content generator |
| Technical Implementation | Anthropic API integration, Recharts, React state |
| Prototype & Functionality | Fully functional UI with real AI responses |
| Teamwork & Presentation | Modular code, clear demo flow: Landing → Dashboard → Chatbot → Marketing |

---

## 9. Demo Script for Judges

```
1. Open Landing Page → explain the problem & solution (30 sec)
2. Navigate to Dashboard → show KPI cards and weekly sales chart (30 sec)
3. Open AI Chatbot → type "Is rice available?" → show live AI response (45 sec)
4. Open Inventory → show low stock alerts and AI warnings (20 sec)
5. Open Marketing AI → generate an "Eid discount on rice" campaign → copy Instagram post (30 sec)
6. Mention: WhatsApp integration, expense tracking, sales forecasting (15 sec)

Total: ~3 minutes demo → leaves 2 min for Q&A
```

---

*Generated for Antigravity build system | GrowPilot AI | Hack Fest 2026*
