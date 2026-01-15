## Painfrei Care & Wellness 
A production-ready D2C (Direct-to-Consumer) e-commerce application designed for wellness products. This repository contains a Monorepo setup featuring a Next.js frontend and a Node.js/Express backend, using MongoDB for data persistence.
The application handles the complete e-commerce lifecycle: authentication, product catalog, localized availability checks, shopping cart management, coupon logic, order processing (Razorpay), and transactional emails.
🛠 Tech Stack
Frontend
 * Framework: Next.js 14 (App Router)
 * Language: TypeScript / JavaScript
 * Styling: Tailwind CSS, PostCSS
 * State/Data: React Hooks, Axios
 * UI Components: Headless UI, Heroicons, Framer Motion
 * Payment Integration: Razorpay SDK
Backend
 * Runtime: Node.js
 * Framework: Express.js
 * Database: MongoDB (via Mongoose ODM)
 * Authentication: Passport.js (Google OAuth Strategy), JWT, BCrypt
 * Validation: Joi
 * File Handling: Multer (Local storage strategy)
 * Email: Nodemailer (SMTP)
🏗 Architecture & Design Decisions
1. Modular Backend Structure
Unlike the traditional MVC structure where controllers, routes, and models are grouped by file type, this backend utilizes a Feature-Based Module Architecture.
 * Location: Backend/src/modules/
 * Reasoning: Each feature (e.g., cart, product, auth) is self-contained. A module folder contains its own Controller, Routes, Validation Schemas, and Service logic. This makes the codebase significantly easier to scale and maintain—if you need to fix the Cart, you only look in the cart folder.
2. Global Error Handling
The backend implements a centralized error handling mechanism (Backend/src/middlewares/GlobalErrorHandling.js) and a custom AppError class.
 * Reasoning: Removes try-catch boilerplate from controllers (catchAsyncError wrapper) and ensures consistent JSON error responses across the API.
3. Hyper-Localized Logic
The application includes specific logic for product availability based on pincodes (Frontend/src/app/product/[id]/page.tsx).
 * Reasoning: The business logic separates "Deliverable" vs. "Pre-order" flows based on specific serviceability arrays (e.g., IIT Kanpur and surrounding areas).
4. Hybrid Authentication
 * Strategies: Supports both Local Strategy (Email/Password) and Google OAuth.
 * Session: Stateless JWT authentication. The token is generated upon login/signup and passed via headers for protected routes.
🚀 Getting Started
Prerequisites
 * Node.js (v18+)
 * MongoDB (Local or Atlas URI)
1. Backend Setup
cd Backend
npm install

Create a .env file in the Backend root:
PORT=5000
NODE_ENV=development
MONGO_URL=mongodb://localhost:27017/painfrei_db
BASE_URL=http://localhost:5000/

# Security
JWT_SECRET=your_super_secret_jwt_key

# Google Auth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/v1/auth/google/callback
FRONTEND_URL=http://localhost:3000

# Payments (Razorpay)
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# Email (SMTP)
EMAIL_USERNAME=contact@painfrei.com
EMAIL_PASSWORD=your_email_password

Start the server:
npm start

2. Frontend Setup
cd Frontend
npm install

Create a .env (or .env.local) file in the Frontend root:
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000/api/v1/
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key_id

Start the development server:
npm run dev

📂 Project Structure
Backend Map
Backend/
├── Database/models/       # Mongoose Schemas (User, Product, Order, etc.)
├── functions/             # Serverless function handlers (Netlify adapter)
├── src/
│   ├── config/            # Passport strategies
│   ├── handlers/          # Generic factory handlers (e.g., deleteOne)
│   ├── middlewares/       # Auth checks, Validation, Error Handling
│   ├── modules/           # FEATURE MODULES (Controller + Routes + Validation)
│   │   ├── auth/
│   │   ├── cart/
│   │   ├── order/
│   │   └── ...
│   └── utils/             # API Features (Pagination), Razorpay instance
└── uploads/               # Static asset storage for product images

Frontend Map
Frontend/
├── public/                # Static assets
├── src/
│   ├── app/               # Next.js App Router Pages
│   │   ├── dashboard/     # User account management pages
│   │   ├── product/       # Product listing and details
│   │   └── ...
│   ├── components/        # Reusable UI components
│   ├── hooks/             # Custom hooks (useAuth)
│   ├── types/             # TypeScript interfaces
│   └── styles/            # Global CSS and Tailwind config

🔌 API Overview
The backend exposes a RESTful API versioned at /api/v1.
| Module | Base Route | Description |
|---|---|---|
| Auth | /auth | Signup, Signin, Google OAuth, Check Auth |
| Products | /products | CRUD operations for inventory (Admin only for write ops) |
| Cart | /carts | Add to cart, apply coupons, update quantity |
| Orders | /orders | Place orders, verify payments, get history |
| Reviews | /review | Add/Edit/Delete product reviews |
| Address | /address | User shipping address management |
📦 Key Features Implementation Details
 * Coupon System: Located in Backend/src/modules/coupon. Supports max usage limits per customer and total usage limits.
 * Pre-orders: Separate logic (Newpreorder.model.js) handles orders when the pincode falls outside standard delivery zones but is eligible for future shipping.
 * Image Uploads: handled by Backend/multer/multer.js. Images are stored locally in Backend/uploads and served statically.
 * Validation: Inputs are validated using Joi schemas before reaching the controllers to prevent database pollution.
