# 🧺 Autosplash

**Autosplash** is a platform designed to digitize and simplify laundry business operations. It allows you to register wash tickets, manage customers, track payment history, and generate PDF receipts — all from a modern and user-friendly interface.

---

## 🔐 Demo Account

You can test the app using the following credentials:

- **Email:** editor.autosplash@gmail.com  
- **Password:** admin123

---

## ✨ Key Features

- Create wash tickets with automatic PDF receipt generation.
- Customer management: create, edit, and view customers.
- Payment tracking with history and automatic balance calculation.
- Price calculator based on item categories.
- View orders by status and monitor delayed tickets.
- Dashboard with statistics and graphs.
- JWT authentication and user system.
- Optional image upload and QR code for ticket tracking.
- Internal notes per ticket.
- Responsive design optimized for mobile devices.

---

## 🛠️ Tech Stack

### 🖥️ Frontend
- Vite + React + TypeScript
- Tailwind CSS
- React Router
- Axios
- Sonner (notifications)
- date-fns (date formatting)
- Chart.js

### 🧠 Backend
- Node.js + Express
- MongoDB (Mongoose)
- JWT (authentication)
- Firebase Cloud Messaging (push notifications)
- PDFKit (receipt generation)
- Cloudinary (optional for images)
- Winston (logging)
- Express-validator (validations)
- Morgan (request logger)

---

## ⚙️ Installation

### Clone the repositories
```bash
# Frontend
git clone https://github.com/yourusername/autosplash-fe.git

# Backend
git clone https://github.com/frcampero/autosplash-be.git
```

### Backend setup
```bash
cd autosplash-be
npm install
cp .env.example .env
# Configure your environment variables (MongoDB, JWT, etc.)
npm run dev
```

### Frontend setup
```bash
cd autosplash-frontend
npm install
cp .env.example .env
# Set VITE_API_URL to your backend URL
npm run dev
```

---

## 🔗 Backend Repository

You can check the backend code here:  
👉 [autosplash-be](https://github.com/frcampero/autosplash-be)

---

## 📄 Screenshots


---

## 🧠 Entity Relationship Diagram (ERD)

This is the database structure used by Autosplash:

![ERD](./docs/der-autosplash.png)

---

## 📦 Project Status

🚧 In development — Currently used by a real-world laundry shop. Coming soon:
- Dashboard filters by date range.
- Photo upload when creating a ticket.

---

## 💼 Great for your portfolio

This project was built as a real solution to replace Excel spreadsheets in a laundry business. It showcases fullstack development, UI/UX design, database management, security, and dynamic PDF generation.

---

## 🧠 Author

Federico Campero  
📫 [fcampero.dev](mailto:fcampero.dev)