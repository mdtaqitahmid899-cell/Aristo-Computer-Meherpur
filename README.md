# 🖥️ Aristo Computer — Modern Hardware Ecommerce & Admin Platform

A high-performance, responsive ecommerce web application built for **Aristo Computer** (Hospital Road, Meherpur, Bangladesh). Built with **Next.js App Router**, **TypeScript**, **Tailwind CSS**, and **Firebase** (Firestore, Cloud Storage, and Authentication).

---

## 🌟 Key Highlights & Features

### 🛍️ Customer Experience
- **Bangladeshi Taka (৳) Pricing:** Real-time pricing format (e.g. `৳25,000`).
- **Direct WhatsApp Ordering:** One-tap order button that opens WhatsApp with a prefilled message containing the exact product title, price in BDT, and current product page URL.
- **Direct Phone Dialing:** One-click instant call to the shop helpline (`tel:...`).
- **Complete Hardware Catalog:** 10 categories including Laptops, Desktop Computers, Processors, Motherboards, RAM, SSD/HDD, Graphics Cards, Monitors, Keyboards & Mice, and Accessories.
- **Fast Product Search & Filtering:** Filter by Category, Brand, Price Range, and In-Stock status, plus multi-criteria sorting (Newest, Price Low-High, Price High-Low, Name A-Z).
- **Interactive Multi-Image Gallery:** Up to 8 high-resolution photos per product with clickable thumbnails, previous/next controls, and zoom inspection.
- **Technical Specifications Table:** Structured hardware specifications (Cores, Clock speed, VRAM, RAM type, Bus width, Warranty, etc.).
- **Physical Shop & Location:** Google Map embed, opening hours, and location on Hospital Road, Meherpur Sadar, Meherpur - 7100.
- **No Customer Login Required:** Customers browse and place orders via WhatsApp or phone with zero friction.

### 🛡️ Admin Dashboard (`/admin`)
- **Secure Authentication:** Firebase Email & Password authentication strictly for administrators.
- **Inventory Metrics:** Live summary counts for Total Products, In-Stock, Out-of-Stock, and Featured Promotions.
- **Full Product CRUD:**
  - **Create:** Add new hardware products with name, brand, category, regular price, original price, stock, detailed description, and dynamic technical specifications.
  - **Multiple Image Upload (up to 8 images):** Real-time image previews, file format validation (JPG, JPEG, PNG, WebP) and size validation (≤ 5MB), upload progress bar, and storage in Firebase Cloud Storage.
  - **Update:** Pre-loads existing product info, allows editing fields, adding new images, or reordering/setting primary image.
  - **Delete:** Responsive confirmation dialog that deletes the document from Firestore and safely cleans up associated image files from Cloud Storage.
- **One-Click Demo Catalog Seeder:** Instantly populate your new Firestore database with 12+ realistic computer hardware products across all categories.

---

## 🛠️ Tech Stack

- **Framework:** Next.js 16 (App Router with Turbopack)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **Database:** Firebase Cloud Firestore
- **Image Storage:** Firebase Cloud Storage
- **Authentication:** Firebase Authentication (Admin only)
- **Icons:** Lucide React
- **Currency:** Bangladeshi Taka (`BDT ৳`)

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js:** v18.18 or higher (Node v20+ recommended)
- **npm** or **pnpm**

### 2. Installation

```bash
# Clone or navigate to the directory
cd "Aristo Computer Meherpur"

# Install dependencies
npm install
```

### 3. Environment Variables Setup

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your shop contact details and Firebase project credentials:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY="AIzaSyYourFirebaseApiKeyHere"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="aristo-computer.firebaseapp.com"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="aristo-computer"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="aristo-computer.appspot.com"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="123456789012"
NEXT_PUBLIC_FIREBASE_APP_ID="1:123456789012:web:abcdef123456"

# Shop Numbers (Include Bangladesh country code: +880)
NEXT_PUBLIC_SHOP_PHONE="+8801712345678"
NEXT_PUBLIC_SHOP_WHATSAPP="+8801712345678"
```

> **Note on Demo Mode:** If Firebase credentials are not yet configured in `.env.local`, the application automatically runs in fallback mode with realistic computer hardware demo data and allows demo admin login with `admin@aristocomputer.com` / `admin123456`.

---

## 🔥 Firebase Setup Guide

Follow these steps to connect your real Firebase project:

### Step 1: Create a Firebase Project
1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Click **Add project** and name it `aristo-computer` (or any preferred name).
3. Disable Google Analytics (optional) and click **Create project**.

### Step 2: Register Web App
1. In the project dashboard, click the **Web icon `</>`** to add an app.
2. Enter the app nickname (e.g. `Aristo Web`) and click **Register app**.
3. Copy the `firebaseConfig` keys into your `.env.local` file.

### Step 3: Enable Firestore Database
1. Go to **Build > Firestore Database** in the left sidebar.
2. Click **Create database**.
3. Choose a region close to Bangladesh (e.g. `asia-south1` Mumbai or `asia-southeast1` Singapore).
4. Start in **Production mode**.
5. In the **Rules** tab, paste the contents of `firestore.rules` and click **Publish**.

### Step 4: Enable Cloud Storage
1. Go to **Build > Storage** in the left sidebar.
2. Click **Get started** and accept defaults.
3. In the **Rules** tab, paste the contents of `storage.rules` and click **Publish**.

### Step 5: Enable Firebase Authentication
1. Go to **Build > Authentication**.
2. Click **Get started**.
3. Under the **Sign-in method** tab, enable **Email/Password**.
4. Go to the **Users** tab and click **Add user**.
5. Enter your admin email (e.g. `admin@aristocomputer.com`) and a strong password.

### Step 6: Seed Default Products
1. Start the app: `npm run dev`.
2. Visit `http://localhost:3000/admin/login`.
3. Sign in with your admin credentials.
4. Click **Seed Demo Products** at the top right of the dashboard. Your Firestore collection `products` is now populated with authentic hardware products!

---

## 🔒 Security Rules

### Firestore Security (`firestore.rules`)
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function isAuthenticatedAdmin() {
      return request.auth != null;
    }
    match /products/{productId} {
      allow read: if true;
      allow create, update, delete: if isAuthenticatedAdmin();
    }
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

### Storage Security (`storage.rules`)
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    function isAuthenticatedAdmin() {
      return request.auth != null;
    }
    function isValidImage() {
      return request.resource.size <= 5 * 1024 * 1024
        && request.resource.contentType.matches('image/(jpeg|jpg|png|webp)');
    }
    match /products/{productId}/{imageFile} {
      allow read: if true;
      allow create, update: if isAuthenticatedAdmin() && isValidImage();
      allow delete: if isAuthenticatedAdmin();
    }
    match /{allPaths=**} {
      allow read, write: if false;
    }
  }
}
```

---

## 🏃 Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Starts local Next.js development server on `http://localhost:3000` |
| `npm run build` | Builds the production bundle with TypeScript type-checking |
| `npm start` | Runs the compiled production server |
| `npm run lint` | Runs ESLint analysis |

---

## 📍 Store Information

- **Shop Name:** Aristo Computer
- **Address:** Hospital Road, Meherpur Sadar, Meherpur - 7100, Bangladesh
- **Business Hours:** Saturday – Thursday: 9:30 AM – 9:00 PM (Friday Closed)
- **Currency:** Bangladeshi Taka (৳)
