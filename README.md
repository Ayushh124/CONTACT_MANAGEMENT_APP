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
* 

---



✨ Features

User Authentication: Secure Login and Registration pages with password encryption.

Contact Dashboard: View all contacts in a clean, responsive table.

Smart Search: Filter contacts instantly by name or email.

Tag System: Filter contacts by groups (e.g., Work, Family) using the tag pill bar.

Add/Edit Contacts: A comprehensive form to manage contact details.

Favorites: Mark important contacts with a star.

Phone Validation: Includes country codes and flags.





## 📂 Project Structure

```text
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

🔌 API Reference

 User Authentication
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register a new user |
| `POST` | `/api/auth/login` | Login user & get Token |

#### Contacts
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/contacts` | Get all contacts for logged-in user |
| `POST` | `/api/contacts` | Create a new contact |
| `PUT` | `/api/contacts/:id` | Update a specific contact |
| `DELETE` | `/api/contacts/:id` | Delete a specific contact |





