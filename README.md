# 💰 SmartFin

SmartFin is a full-stack personal finance management web application that enables users to track income, expenses, and budgets through an intuitive dashboard. It uses **Firebase Authentication** for secure user management, **Flask** as the backend API, and **MongoDB** for persistent data storage.

The application provides separate interfaces for **users** and **administrators**, offering comprehensive financial tracking, analytics, and system management features.

---

## ✨ Features

### 👤 User Features

- Secure authentication using Email/Password and Google Sign-In
- User registration and login
- Personalized finance dashboard
- Income management
- Expense tracking
- Budget monitoring
- Interactive charts and financial summaries
- User profile management
- Dark/Light theme support

### 🛠️ Admin Features

- Separate admin authentication
- Admin dashboard
- User management
  - View users
  - Create users
  - Update user details
  - Disable user accounts
  - Delete users
- System status monitoring

---

## 🏗️ Architecture

```text
Frontend (HTML, CSS, JavaScript)
            │
            ▼
Firebase Authentication
            │
            ▼
      Flask REST API
            │
            ▼
         MongoDB
```

---

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| Frontend | HTML5, CSS3, JavaScript |
| Backend | Flask (Python) |
| Database | MongoDB |
| Authentication | Firebase Authentication |
| Charts | Chart.js |
| Icons | Font Awesome |
| Styling | Custom CSS |

---

## 📌 Main Modules

| Module | Description |
|--------|-------------|
| **Home** | Dashboard displaying financial summaries, analytics, and charts |
| **Authentication** | User login, signup, and Google Sign-In |
| **Income** | Add, edit, and manage income records |
| **Expense** | Add, edit, and manage expense records |
| **Profile** | User profile management |
| **Admin** | User management and system administration |
| **Shared** | Reusable UI components, navigation, and theme handling |
| **Backend** | REST APIs for finance data and admin operations |

---

## 📷 Screenshots

| Authentication | Dashboard |
|:--------------:|:---------:|
| <img src="screenshots/login.png" alt="Login" width="450"/> | <img src="screenshots/home.png" alt="Home Dashboard" width="450"/> |

| Income Tracking | Expense Tracking |
|:---------------:|:----------------:|
| <img src="screenshots/income.png" alt="Income" width="450"/> | <img src="screenshots/expense.png" alt="Expense" width="450"/> |

| Admin Login | Admin Dashboard |
|:-----------:|:---------------:|
| <img src="screenshots/admin%20login.png" alt="Admin Login" width="450"/> | <img src="screenshots/admin%20dashboard.png" alt="Admin Dashboard" width="450"/> |

---

## 🔒 Security

The current backend expects `serviceAccountKey.json` to exist in the project root.

For production deployments:

- Store Firebase credentials using environment variables.
- Store MongoDB connection strings securely.
- Never commit secrets to version control.
- Enable HTTPS in production.

---

## 📄 License

This project is intended for educational and learning purposes.
