# Convex Backend Guide

## 🚀 How Convex Works

### 1. **Running the Backend (`npx convex dev`)**

When you run `npx convex dev`:
- ✅ Watches all files in `convex/` folder
- ✅ Auto-compiles TypeScript on every save
- ✅ Auto-deploys to cloud instantly (no manual deploy needed)
- ✅ Updates `_generated/` folder with types
- ✅ Provides real-time updates to connected clients

**Unlike Node.js:** No need to restart server - changes are live instantly!

---

## 📝 Writing Backend Functions

### **3 Types of Convex Functions:**

#### 1. **Query** (Read Data - like GET)
```typescript
// convex/modules/menu/menu.ts
import { query } from "../../_generated/server";

export const getAll = query({
  handler: async (ctx) => {
    return await ctx.db.query("menuItems").collect();
  },
});
```

#### 2. **Mutation** (Write Data - like POST/PUT/DELETE)
```typescript
// convex/modules/menu/menu.ts
import { mutation } from "../../_generated/server";
import { v } from "convex/values";

export const addItem = mutation({
  args: {
    name: v.string(),
    price: v.number(),
    category: v.string(),
  },
  handler: async (ctx, args) => {
    const itemId = await ctx.db.insert("menuItems", {
      name: args.name,
      price: args.price,
      category: args.category,
      createdAt: Date.now(),
    });
    return itemId;
  },
});
```

#### 3. **Action** (External API calls, like calling third-party services)
```typescript
// convex/modules/orders/orders.ts
import { action } from "../../_generated/server";

export const sendNotification = action({
  handler: async (ctx, args) => {
    // Call external API
    const response = await fetch("https://api.example.com/notify");
    return response.json();
  },
});
```

---

## 🔌 Connecting Frontend to Backend

### **Step 1: Install Convex in Client**
```bash
cd client
npm install convex
```

### **Step 2: Setup Convex Provider**
```jsx
// client/src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { ConvexProvider, ConvexReactClient } from 'convex/react';
import App from './App.jsx';
import './styles.css';

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ConvexProvider client={convex}>
      <App />
    </ConvexProvider>
  </React.StrictMode>
);
```

### **Step 3: Create `.env.local` in client folder**
```env
VITE_CONVEX_URL=https://giddy-lyrebird-252.convex.cloud
```

### **Step 4: Use Convex in Components**

#### **Reading Data (Query):**
```jsx
// client/src/user/pages/Home.jsx
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';

function Home() {
  const menuItems = useQuery(api.modules.menu.menu.getAll);
  
  if (!menuItems) return <div>Loading...</div>;
  
  return (
    <div>
      {menuItems.map(item => (
        <div key={item._id}>
          <h3>{item.name}</h3>
          <p>${item.price}</p>
        </div>
      ))}
    </div>
  );
}
```

#### **Writing Data (Mutation):**
```jsx
// client/src/user/pages/Cart.jsx
import { useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';

function Cart() {
  const createOrder = useMutation(api.modules.orders.orders.create);
  
  const handleCheckout = async () => {
    const orderId = await createOrder({
      items: cartItems,
      total: totalAmount,
      userId: currentUser._id
    });
    console.log('Order created:', orderId);
  };
  
  return <button onClick={handleCheckout}>Place Order</button>;
}
```

---

## 🧪 Testing Backend (Instead of Postman)

### **Option 1: Convex Dashboard (Best for Testing)**
1. Go to: https://dashboard.convex.dev/d/giddy-lyrebird-252
2. Click on "Functions" tab
3. Select your function (e.g., `modules/menu/menu:getAll`)
4. Enter arguments in JSON format
5. Click "Run" - See results instantly!

**Example:**
```json
{
  "name": "Pizza",
  "price": 12.99,
  "category": "Main"
}
```

### **Option 2: Using `npx convex run`**
```bash
# Query function (no args)
npx convex run modules/menu/menu:getAll

# Mutation with arguments
npx convex run modules/menu/menu:addItem --name "Burger" --price 8.99 --category "Main"
```

### **Option 3: Test in React Component**
Just use the function in your frontend - changes are instant!

---

## 📊 Database Schema Setup

First, define your schema:

```typescript
// convex/schema/schema.ts
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  menuItems: defineTable({
    name: v.string(),
    price: v.number(),
    category: v.string(),
    image: v.optional(v.string()),
    available: v.boolean(),
    createdAt: v.number(),
  })
    .index("by_category", ["category"])
    .index("by_availability", ["available"]),
    
  orders: defineTable({
    userId: v.id("users"),
    items: v.array(v.object({
      menuItemId: v.id("menuItems"),
      quantity: v.number(),
    })),
    total: v.number(),
    status: v.string(), // "pending", "confirmed", "delivered"
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_status", ["status"]),
    
  users: defineTable({
    email: v.string(),
    name: v.string(),
    role: v.string(), // "user", "admin", "delivery"
    phone: v.optional(v.string()),
    address: v.optional(v.string()),
  })
    .index("by_email", ["email"])
    .index("by_role", ["role"]),
});
```

---

## 🔄 Real-time Updates (Magic of Convex!)

Unlike Node.js REST API, Convex gives you **real-time updates automatically**:

```jsx
// When data changes in database, UI updates instantly - NO manual refresh!
const orders = useQuery(api.modules.orders.orders.getByUser, { userId: "123" });

// If another user/admin updates an order, this component re-renders automatically!
```

---

## 🎯 Key Differences from Node.js + Postman

| Node.js + Express | Convex |
|-------------------|---------|
| Write routes manually | Functions auto-exposed as API |
| Test with Postman | Test in Dashboard |
| Restart server on changes | Auto-deploys on save |
| Setup database separately | Built-in database |
| Manual real-time (WebSockets) | Auto real-time |
| CORS configuration needed | CORS handled automatically |

---

## 📁 Folder Structure Recap

```
convex/
├── schema/schema.ts          → Database models
├── modules/
│   ├── auth/auth.ts         → Login, signup functions
│   ├── menu/menu.ts         → CRUD for menu items
│   └── orders/orders.ts     → Order management
└── lib/
    ├── auth.ts              → Auth helpers
    └── role.ts              → Role checking
```

Each function you export becomes an API endpoint automatically!

---

## ✅ Next Steps

1. Define your schema in `convex/schema/schema.ts`
2. Write functions in `convex/modules/`
3. Test in Dashboard
4. Connect frontend with `useQuery` and `useMutation`
5. Enjoy real-time updates! 🎉
