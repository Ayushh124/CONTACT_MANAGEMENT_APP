# 📞 Contact Management App

A full-stack web application designed to help users manage their personal contacts efficiently. Features include user authentication, contact CRUD operations (Create, Read, Update, Delete), tagging, search functionality, and professional data validation.

---

## 🚀 Tech Stack

* **Frontend:** React (Vite), Tailwind CSS, Lucide React (Icons), Axios, React Phone Input 2.
* **Backend:** Node.js, Express.js.
* **Database:** MongoDB Atlas (Cloud).
* **Authentication:** JWT (JSON Web Tokens).

---

## 🛠️ Prerequisites

Before you begin, ensure you have the following installed:
* **Node.js** (v14 or higher)
* **NPM** (Node Package Manager)
* A **MongoDB Atlas** account (for the database connection).

---

📂 Project Structure
Plaintext
ContactManager/
├── backend/                # Server-side logic
│   ├── config/             # Database connection
│   ├── controllers/        # API logic (Auth, Contacts)
│   ├── middleware/         # Auth protection
│   ├── models/             # Database Schemas (User, Contact)
│   ├── routes/             # API Routes
│   └── server.js           # Entry point
│
└── frontend/               # Client-side UI
    ├── src/
    │   ├── components/     # Reusable UI parts
    │   ├── context/        # Auth State Management
    │   ├── pages/          # Login, Dashboard, ContactForm
    │   └── utils/          # API Setup (Axios)
    └── tailwind.config.js  # Styling Config


