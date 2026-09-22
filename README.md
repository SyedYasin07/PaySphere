# 💳 PaySphere — Secure P2P Digital Wallet & Money Transfer System

PaySphere is a **full-stack P2P digital wallet application** designed to simulate secure wallet-based money transfers between registered users.

The application allows users to create an account, manage their digital wallet, add or withdraw simulated funds, transfer wallet balance to another registered user, use QR-based recipient identification, and track transaction history.

It also includes a dedicated **Admin Dashboard** for monitoring users, wallets, and transactions.

> **Note:** PaySphere is an academic/project implementation. It does not process real-world bank or UPI payments. Add Money is implemented as a simulated wallet top-up, while P2P transfers operate within the application's wallet system.

---

## 🚀 Live Demo

### 🌐 Frontend

**PaySphere Web Application:**
https://paysphere-1.onrender.com/

### ⚙️ Backend API

**Spring Boot Backend:**
https://paysphere-ju54.onrender.com

### 📂 GitHub Repository

**Source Code:**
https://github.com/SyedYasin07/PaySphere


# 🔐 Demo Credentials

Recruiters can use the following demo account to explore the PaySphere application.

### 👤 User Login

```text
Email: yasin@gmail.com
Password: $yasin4758

---

## 🎯 Project Overview

The main objective of PaySphere is to build a secure digital wallet platform where registered users can transfer wallet balances directly to other registered users within the application.

Unlike a traditional payment gateway integration, PaySphere focuses on implementing the **core backend wallet and P2P transaction logic**:

* User authentication and authorization
* Digital wallet management
* Wallet balance operations
* User-to-user P2P transfers
* QR-based recipient identification
* Transaction processing
* Transaction history
* Role-based access control
* Admin management
* Secure REST APIs
* Database persistence

---

## 💡 Why PaySphere is a P2P Digital Transfer System?

PaySphere follows a **Peer-to-Peer (P2P)** model because the transfer happens directly between two registered users of the application.

For example:

```text
User A
  │
  │  Transfer ₹500
  ▼
PaySphere Wallet System
  │
  │  Validate sender,
  │  receiver, balance,
  │  wallet status & transaction
  ▼
User B
```

The sender and receiver are both PaySphere users.

When User A transfers money to User B:

1. The sender is authenticated using JWT.
2. The recipient is identified using their PaySphere user ID / QR data.
3. The backend verifies that the recipient exists.
4. The sender's wallet is verified.
5. The receiver's wallet is verified.
6. The sender's wallet balance is checked.
7. The transfer amount is validated.
8. The sender's balance is debited.
9. The receiver's balance is credited.
10. A transaction record is created with a unique reference number.

This makes the application a **P2P wallet transfer system** because the core transaction is between one application user and another application user.

### 🔐 Example QR Identity

PaySphere uses QR data such as:

```text
PAYSPHERE:USER:4
```

The QR code identifies the PaySphere recipient. It is **not a UPI QR code** and does not initiate a real-world banking transaction.

---

## ✨ Key Features

### 👤 User Features

* User registration
* User login
* JWT-based authentication
* Email verification
* Forgot password
* Reset password
* Profile management
* Password change
* Role-based authorization

### 💰 Digital Wallet

* Automatic wallet creation during user registration
* View wallet details
* View wallet balance
* Add simulated money
* Withdraw simulated money
* Wallet status management
* Wallet number generation

### 🔄 P2P Money Transfer

* Transfer wallet balance to another registered user
* QR-based recipient identification
* Sender balance validation
* Receiver wallet validation
* Wallet status validation
* Transaction validation
* Transaction reference number generation
* Transaction remarks
* Transaction status tracking

### 📱 QR Transfer

Users can:

* Generate their personal PaySphere QR
* Display their QR
* Scan/enter recipient QR information
* Transfer funds to the identified PaySphere user

### 📜 Transaction History

Users can:

* View their transaction history
* Identify sender/receiver
* View transaction amount
* View transaction status
* View transaction type
* View transaction reference number
* View transaction date/time
* Open transaction details

### 🛡️ Admin Dashboard

Administrators can manage and monitor:

* Users
* User details
* User status
* Wallets
* Wallet status
* Transactions
* Transaction details
* Transaction status

The dashboard also provides statistics such as:

* Total users
* Active users
* Blocked users
* Total wallets
* Active wallets
* Blocked wallets
* Total transactions
* Successful transactions
* Failed transactions
* Total transferred amount

---

## 🔐 Security

PaySphere implements several backend security mechanisms:

* Spring Security
* JWT authentication
* Role-based authorization
* Password hashing
* Protected REST APIs
* Stateless authentication
* User-specific transaction access
* Admin-only management APIs
* Input validation
* Transactional wallet transfers
* Secure ownership checks

### Role-Based Access

```text
USER
 ├── Wallet
 ├── Transfer
 ├── QR
 ├── Transactions
 └── Profile

ADMIN
 ├── Dashboard
 ├── Users
 ├── Wallets
 └── Transactions
```

---

## 🏗️ Technology Stack

### Frontend

* React.js
* Vite
* Tailwind CSS
* Axios
* React Router
* JavaScript
* HTML5
* CSS3

### Backend

* Java 21
* Spring Boot
* Spring Security
* JWT
* Spring Data JPA
* Hibernate
* REST APIs
* Maven

### Database

* MySQL-compatible TiDB Cloud
* MySQL Connector/J

### Deployment

* Render — Frontend
* Render — Backend
* TiDB Cloud — Database
* GitHub — Source Code & Version Control

---

## 🏛️ Application Architecture

PaySphere follows a layered backend architecture:

```text
React Frontend
      │
      │ REST API / Axios
      ▼
Spring Boot REST Controllers
      │
      ▼
Service Layer
      │
      ▼
Repository Layer
      │
      ▼
JPA / Hibernate
      │
      ▼
TiDB Cloud Database
```

### Backend Structure

```text
src/main/java/com/sy/main
│
├── controller
├── service
├── service/impl
├── repository
├── Entity
├── DTO
├── security
├── exception
└── configuration
```

---

## 🔄 P2P Transfer Flow

```text
Login
  │
  ▼
JWT Authentication
  │
  ▼
User selects recipient
  │
  ▼
Recipient QR / User ID
  │
  ▼
Backend validates recipient
  │
  ▼
Validate sender wallet
  │
  ▼
Check wallet status
  │
  ▼
Check available balance
  │
  ▼
Debit Sender Wallet
  │
  ▼
Credit Receiver Wallet
  │
  ▼
Create Transaction
  │
  ▼
Generate Reference Number
  │
  ▼
Return Transaction Result
```

The transfer operation is handled transactionally so that the wallet updates and transaction record remain consistent.

---

## 🗄️ Main Database Entities

### Users

Stores registered PaySphere users and their authentication/role information.

### Roles

Defines application roles such as:

```text
USER
ADMIN
```

### Wallets

Stores:

* Wallet ID
* User
* Wallet number
* Balance
* Wallet status
* Created timestamp
* Updated timestamp

### Transactions

Stores:

* Transaction ID
* Sender
* Receiver
* Wallet
* Amount
* Transaction type
* Transaction status
* Remarks
* Reference number
* Created timestamp

---

## 🌐 Main API Modules

### Authentication

```text
POST /auth/register
POST /auth/login
POST /auth/verify-email
POST /auth/forgot-password
POST /auth/reset-password
```

### Wallet

```text
GET  /wallets/my-wallet
POST /wallets/add-money
POST /wallets/withdraw
```

### P2P Transfer

```text
POST /transactions/transfer
GET  /transactions/history
GET  /transactions/reference/{referenceNumber}
```

### Admin

```text
GET    /users
GET    /users/{userId}
PUT    /users/{userId}/block
PUT    /users/{userId}/unblock
DELETE /users/{userId}

GET /admin/wallets
GET /admin/transactions
GET /admin/transactions/{referenceNumber}
```

---

## 🧪 Example P2P Transaction

Suppose:

```text
Sender:
User A
Wallet Balance: ₹2,000

Receiver:
User B
Wallet Balance: ₹500

Transfer:
₹300
```

After a successful transfer:

```text
User A → ₹1,700
User B → ₹800
```

The application also stores a transaction record containing the sender, receiver, amount, status, timestamp, remarks, and unique reference number.

---

## ☁️ Deployment

PaySphere is deployed as a full-stack application:

```text
                 GitHub
                   │
          ┌────────┴────────┐
          ▼                 ▼
      Render             Render
     Frontend            Backend
       React           Spring Boot
          │                 │
          └───────┬─────────┘
                  │
                  ▼
             TiDB Cloud
              Database
```

### Frontend

Hosted using **Render Static Site**.

### Backend

Hosted using **Render Docker deployment** with Java 21 and Spring Boot.

### Database

Hosted using **TiDB Cloud**, using MySQL-compatible connectivity over TLS.

---

## 🛠️ Running Locally

### Backend

```bash
git clone https://github.com/SyedYasin07/PaySphere.git

cd PaySphere

./mvnw spring-boot:run
```

Backend:

```text
http://localhost:8081
```

### Frontend

```bash
cd frontend

npm install

npm run dev
```

Frontend:

```text
http://localhost:5173
```

### Environment Configuration

The application requires environment-specific configuration for:

```text
Database URL
Database username
Database password
JWT secret
Frontend API URL
```

Sensitive credentials should **never be committed to GitHub**.

---

## 📸 Project Highlights

PaySphere includes a complete user and admin experience:

### User Side

* Login & Registration
* Dashboard
* Wallet
* Add Money
* Withdraw Money
* P2P Transfer
* QR Code
* Transaction History
* Transaction Details
* Profile

### Admin Side

* Admin Dashboard
* User Management
* User Details
* Wallet Management
* Transaction Management
* Transaction Details

---

## 🎓 Project Purpose

PaySphere was developed as a full-stack software engineering project to demonstrate practical implementation of:

* Java backend development
* Spring Boot
* REST API development
* Spring Security
* JWT authentication
* Role-based authorization
* JPA/Hibernate
* Database design
* Transaction management
* React frontend development
* API integration
* QR-based user identification
* Full-stack deployment
* Git/GitHub workflow

The project focuses on understanding how a wallet-based P2P transfer platform can be designed and implemented from the frontend to the backend and database layers.

---

## ⚠️ Disclaimer

PaySphere is an **academic/demo digital wallet application**.

It does not provide:

* Real banking services
* UPI payment processing
* Real-world financial settlement
* Real payment gateway processing

The **Add Money** feature represents a simulated wallet top-up for demonstration purposes, while P2P transfers operate between wallets maintained within the PaySphere application.

---

## 👨‍💻 Developer

**Sayed Yasin**

B.Tech — Computer Science & Engineering

### Connect

* GitHub: https://github.com/SyedYasin07
* LinkedIn: https://www.linkedin.com/in/sayed-yasin-296a49348/
* LeetCode: https://leetcode.com/u/Yasin_Syed07/

---

## ⭐ Project

If you find this project useful or interesting, feel free to explore the source code and give the repository a ⭐.

**PaySphere — Secure P2P Digital Wallet & Money Transfer System**
