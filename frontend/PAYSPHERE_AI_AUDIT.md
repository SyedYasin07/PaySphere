# PaySphere Digital Wallet System - Comprehensive Audit & Architecture Report

**Document Status:** Complete & Verified  
**Workspace Analysis:** Spring Boot Backend (`springbootwebPaySphereProject/`) & React Frontend (`PaySphere-Frontend/`)  
**Audit Date:** September 2026  

---

## 1. Current Backend Functionality

The Spring Boot backend is a multi-tier enterprise Java application built with Spring Boot 3.x, Spring Security 6.x, Spring Data JPA / Hibernate, and MySQL.

### Architectural Breakdown
- **Domain Entities (`com.sy.main.Entity`):**
  - `User`: Primary user entity with fields `userId`, `role` (ManyToOne to Role), `firstName`, `lastName`, `email`, `password` (BCrypt encoded), `phone`, `dateOfBirth`, `gender`, `status` ("ACTIVE", "BLOCKED"), `emailVerified` (boolean), `verificationToken`, `verificationTokenExpiry`, `resetToken`, `resetTokenExpiry`, `createdAt`, `updatedAt`.
  - `Role`: Security authority entity with `roleId`, `roleName` ("USER", "ADMIN"), `description`, `createdAt`.
  - `Wallet`: Digital wallet with `walletId`, `user` (OneToOne to User), `walletNumber` ("PAY" + timestamp), `balance` (BigDecimal), `walletStatus` ("ACTIVE", "BLOCKED"), timestamps.
  - `Transaction`: Ledger entry with `transactionId`, `wallet`, `sender` (User), `receiver` (User), `amount` (BigDecimal), `transactionType` ("TRANSFER"), `transactionStatus` ("SUCCESS", "FAILED"), `referenceNumber` ("TXN" + timestamp), `remarks`, `createdAt`.

- **Security & Authorization (`com.sy.main.security`, `com.sy.main.config`):**
  - Stateless JWT authentication: `JwtAuthenticationFilter` intercepts requests, extracts Bearer token, fetches user from database with role (`findByEmailWithRole`), and sets `ROLE_USER` or `ROLE_ADMIN` in the `SecurityContextHolder`.
  - BCrypt password hashing (`BCryptPasswordEncoder`).
  - CORS configuration explicitly allows `http://localhost:5173` with credentials and standard HTTP verbs (`GET`, `POST`, `PUT`, `DELETE`, `OPTIONS`).
  - Strict role isolation:
    - User-only: `/wallets/**`, `/transactions/**`
    - Admin-only: `/admin/**`, `/users/**` (except `/users/me` and `/users/me/password`)
    - Dual Access (Authenticated USER & ADMIN): `/users/me`, `/users/me/password`
    - Public: `/users/register`, `/users/login`, `/users/forgot-password`, `/users/reset-password`, `/users/send-verification`, `/users/verify-email`
    - Authenticated: `/qr/**` (`/qr/my-qr`, `/qr/scan`)

- **Service Layer (`com.sy.main.service.impl`):**
  - `UserServiceImpl`: Registration, authentication token generation, profile retrieval, profile updates, password change, UUID reset token creation, password reset, UUID email verification token generation, email verification.
  - `WalletServiceImpl`: Wallet creation, wallet retrieval by user ID, current user's wallet retrieval, balance queries, atomic money deposit (`addMoneyToMyWallet`), atomic money withdrawal (`withdrawFromMyWallet`), QR-data-driven transfer (`transferMoney`), admin wallet block/unblock.
  - `TransactionServiceImpl`: User-to-user money transfer by receiver ID, user transaction history, reference lookup with sender/receiver isolation, admin all-transactions view, admin transaction-by-reference lookup, admin status filtering.
  - `QrServiceImpl`: ZXing-based QR generation (`PAYSPHERE:USER:{userId}` rendered as 300x300 PNG byte array) and QR decoding/lookup returning `UserRespDTO`.
  - `AdminDashboardServiceImpl`: Aggregated platform statistics (counts of total/active/blocked users, wallets, total/successful/failed transactions, total transferred amount).

- **Exception Handling (`com.sy.main.Exception`):**
  - `GlobalExceptionHandler` intercepts all `RuntimeException` occurrences and returns HTTP 400 Bad Request with the raw exception message string in the body.

---

## 2. Current Frontend Functionality

The frontend is a single-page application built using Vite, React 19, and React Router v7.

### Current Architecture
- **HTTP Client (`src/Services/api.js`):**
  - Pre-configured Axios instance pointing to `http://localhost:8081`.
  - Request interceptor attaches `Authorization: Bearer <token>` from `localStorage.getItem("token")`.
- **State & Context:**
  - `src/context/AuthContext.jsx` exists but is empty (0 bytes).
  - Component-level state with `useState` and `useEffect` is used across all pages.
- **Routing (`src/App.jsx`):**
  - Flat route definitions without layout nesting or route guards.
  - No redirection for unauthenticated visitors attempting to view protected pages.
  - No role checks separating Admin and User views.
- **Styling:**
  - Raw unstyled HTML with `<br/>`, `<h1>` to `<h3>`, unstyled form inputs, and browser `alert()` popups.
  - Tailwind CSS is not yet installed or configured in `package.json`.

---

## 3. Completed Frontend Features

| Feature | File Location | Status | Notes |
|---|---|---|---|
| User Login | `src/components/pages/Login.jsx` | Rudimentary | Calls `POST /users/login`, stores token in `localStorage`, navigates to `/dashboard`. Unstyled. |
| User Register | `src/components/pages/Register.jsx` | Rudimentary | Calls `POST /users/register`. Missing `dateOfBirth`. Unstyled. |
| User Dashboard | `src/components/pages/UserDashboard.jsx` | Rudimentary | Calls `GET /users/me`. Displays user info and plain navigation buttons. Unstyled. |
| User Wallet | `src/components/pages/Wallet.jsx` | Rudimentary | Calls `GET /wallets/my-wallet`, `POST /wallets/add-money?amount=...`, `POST /wallets/withdraw?amount=...`. Unstyled. |
| Money Transfer | `src/components/pages/Transfer.jsx` | Rudimentary | Calls `POST /wallets/transfer` with manual QR data string input. Unstyled. |
| Transaction History | `src/components/pages/Transactions.jsx` | Rudimentary | Calls `GET /transactions/history`. Lists transactions with view details button. Unstyled. |
| Transaction Search | `src/components/pages/Transactions.jsx` | Rudimentary | Calls `GET /transactions/reference/:ref`. Unstyled. |
| Transaction Details | `src/components/pages/UserTransactionDetails.jsx` | Rudimentary | Calls `GET /transactions/reference/:ref`. Unstyled. |
| User Profile | `src/components/pages/Profile.jsx` | Rudimentary | Calls `GET /users/me`, `PUT /users/me`, `PUT /users/me/password`. Unstyled. |
| Admin Dashboard | `src/components/pages/AdminDashboard.jsx` | Rudimentary / Buggy | Calls `GET /admin/dashboard`. Has field mismatches (`totalWallets`, `totalSuccessfulAmount`). Unstyled. |
| Admin Users | `src/components/pages/AdminUsers.jsx` | Rudimentary | Calls `GET /users`. Client-side filter. Unstyled. |
| Admin User Details | `src/components/AdminUserDetails.jsx` | Rudimentary | Calls `GET /users/:id`, `PUT /users/:id/block`, `PUT /users/:id/unblock`. Unstyled. |
| Admin Transactions | `src/components/pages/AdminTransactions.jsx` | Rudimentary | Calls `GET /admin/transactions`. Filter and search. Unstyled. |
| Admin Transaction Details | `src/components/pages/AdminTransactionDetails.jsx` | Rudimentary | Calls `GET /admin/transactions/:ref`. Unstyled. |

---

## 4. Missing Frontend Features

1. **Authentication & Password Management:**
   - **Forgot Password Page:** Needs route `/forgot-password` integrating `POST /users/forgot-password`.
   - **Reset Password Page:** Needs route `/reset-password` integrating `POST /users/reset-password`.
   - **Email Verification Flow:** Needs route `/verify-email` integrating `POST /users/send-verification` and `GET /users/verify-email?token=...`.
   - **AuthContext & Session Management:** Global context storing `user`, `token`, `role`, `isAuthenticated`, `login()`, `logout()`, `refreshUser()`.

2. **Route Protection & Role Guards:**
   - `ProtectedRoute` component: restricts access based on authentication status and user role.
   - USER cannot access `/admin/**`.
   - ADMIN cannot access `/wallet`, `/transfer`, `/transactions/**`.
   - Public-only route guards (redirect logged-in users away from `/login`, `/register`).

3. **QR Generation & Scanning Features:**
   - **My QR Code View/Modal:** Calls `GET /qr/my-qr` (blob image), displays QR code with PaySphere branding and "Download QR" action.
   - **QR Code Scanner / Reader:** User can paste QR payload or upload a QR image, calls `POST /qr/scan`, displays receiver verification preview (name, email, phone) before executing transfer.

4. **Admin Wallet Management:**
   - `src/components/pages/AdminWallets.jsx` is currently empty (0 bytes).
   - Needs full table view: `GET /admin/wallets`, search/filter, and actions for `PUT /admin/wallets/:id/block` and `PUT /admin/wallets/:id/unblock`.
   - Missing route `/admin/wallets` in `App.jsx`.

5. **Navigation & Shared Shell Layouts:**
   - Responsive Navigation Bar & Sidebar with active states, role indicators, mobile drawer.
   - Separate User Layout and Admin Layout.
   - Top status indicators (wallet balance chip, verification warning banner if email unverified).

6. **Tailwind CSS UI/UX Design System:**
   - Installation & configuration of Tailwind CSS.
   - Reusable UI component library: Cards, Tables, Buttons, Input fields, Badges, Modals, Empty States, Spinners, Toast notifications (replacing `alert()`).
   - Mobile, tablet, and desktop responsiveness.

---

## 5. Existing API Endpoints Inventory

All backend endpoints are listed below. No endpoints will be invented.

| Module | HTTP Method | Endpoint | Required Authority | Request Body / Params | Response Type |
|---|---|---|---|---|---|
| **Auth** | POST | `/users/register` | Public | Body: `RegReqDTO` | `UserRespDTO` |
| **Auth** | POST | `/users/login` | Public | Body: `LoginReqDTO` | `LoginRespDTO` (token, user) |
| **Auth** | POST | `/users/forgot-password` | Public | Body: `ForgotPasswordDTO` | `String` (reset token) |
| **Auth** | POST | `/users/reset-password` | Public | Body: `ResetPasswordDTO` | `String` |
| **Auth** | POST | `/users/send-verification`| Public | Body: `EmailVerificationDTO`| `String` (verification token) |
| **Auth** | GET | `/users/verify-email` | Public | Query: `token` | `String` |
| **User Profile** | GET | `/users/me` | USER, ADMIN | None | `UserRespDTO` |
| **User Profile** | PUT | `/users/me` | USER, ADMIN | Body: `RegReqDTO` | `UserRespDTO` |
| **User Profile** | PUT | `/users/me/password` | USER, ADMIN | Body: `ChangePasswordDTO` | `String` |
| **User Management**| GET | `/users` or `/admin/users` | ADMIN | None | `List<UserRespDTO>` |
| **User Management**| GET | `/users/{id}` or `/admin/users/{userId}` | ADMIN | Path: `id` | `UserRespDTO` |
| **User Management**| PUT | `/users/{id}/block` or `/admin/users/{userId}/block` | ADMIN | Path: `id` | `UserRespDTO` |
| **User Management**| PUT | `/users/{id}/unblock` or `/admin/users/{userId}/unblock` | ADMIN | Path: `id` | `UserRespDTO` |
| **User Management**| DELETE | `/users/{id}` or `/admin/users/{userId}` | ADMIN | Path: `id` | `void` / `String` |
| **Wallets (User)** | GET | `/wallets/my-wallet` | USER | None | `WalletRespDto` |
| **Wallets (User)** | GET | `/wallets/balance` | USER | None | `BigDecimal` |
| **Wallets (User)** | POST | `/wallets/add-money` | USER | Query: `amount` | `WalletRespDto` |
| **Wallets (User)** | POST | `/wallets/withdraw` | USER | Query: `amount` | `WalletRespDto` |
| **Wallets (User)** | POST | `/wallets/transfer` | USER | Body: `TransferMoneyReqDTO` | `String` |
| **Wallets (Admin)**| GET | `/admin/wallets` | ADMIN | None | `List<AdminWalletRespDto>` |
| **Wallets (Admin)**| PUT | `/admin/wallets/{walletId}/block` | ADMIN | Path: `walletId` | `WalletRespDto` |
| **Wallets (Admin)**| PUT | `/admin/wallets/{walletId}/unblock` | ADMIN | Path: `walletId` | `WalletRespDto` |
| **Transactions (User)** | POST | `/transactions/transfer` | USER | Query: `receiverId`, `amount` | `TransactionRespDto` |
| **Transactions (User)** | GET | `/transactions/history` | USER | None | `List<TransactionRespDto>` |
| **Transactions (User)** | GET | `/transactions/my` | USER | None | `List<TransactionRespDto>` |
| **Transactions (User)** | GET | `/transactions/reference/{referenceNumber}` | USER | Path: `referenceNumber` | `TransactionRespDto` |
| **Transactions (Admin)**| GET | `/admin/transactions` | ADMIN | None | `List<AdminTransactionRespDto>` |
| **Transactions (Admin)**| GET | `/admin/transactions/{referenceNumber}` | ADMIN | Path: `referenceNumber` | `AdminTransactionRespDto` |
| **Transactions (Admin)**| GET | `/admin/transactions/status/{status}` | ADMIN | Path: `status` | `List<AdminTransactionRespDto>` |
| **QR Code** | GET | `/qr/my-qr` | Authenticated | None | `byte[]` (image/png) |
| **QR Code** | POST | `/qr/scan` | Authenticated | Body: `QrScanReqDTO` | `UserRespDTO` |
| **Dashboard (Admin)** | GET | `/admin/dashboard` | ADMIN | None | `AdminDashboardRespDTO` |

---

## 6. React Routes Mapping

### Current Routes in `src/App.jsx`
- `/` -> `Login`
- `/login` -> `Login`
- `/register` -> `Register`
- `/dashboard` -> `UserDashboard` (unprotected)
- `/profile` -> `Profile` (unprotected)
- `/wallet` -> `Wallet` (unprotected)
- `/transfer` -> `Transfer` (unprotected)
- `/transactions` -> `Transactions` (unprotected)
- `/transactions/:referenceNumber` -> `UserTransactionDetails` (unprotected)
- `/admin/dashboard` -> `AdminDashboard` (unprotected)
- `/admin/users` -> `AdminUsers` (unprotected)
- `/admin/users/:userId` -> `AdminUserDetails` (unprotected)
- `/admin/transactions` -> `AdminTransactions` (unprotected)
- `/admin/transactions/:referenceNumber` -> `AdminTransactionDetails` (unprotected)

### Required Complete Routes Architecture
- **Public Routes:**
  - `/login`
  - `/register`
  - `/forgot-password`
  - `/reset-password`
  - `/verify-email`
- **User Protected Routes (`ROLE_USER` only):**
  - `/dashboard` -> User Dashboard with quick balance, recent activity, quick actions
  - `/wallet` -> Wallet overview, add money, withdraw money
  - `/transfer` -> Transfer money with recipient preview & QR options
  - `/qr` -> Personal QR code generation & display
  - `/transactions` -> History with filters & search
  - `/transactions/:referenceNumber` -> Detailed digital receipt
  - `/profile` -> Profile viewing, editing, password change, verification trigger
- **Admin Protected Routes (`ROLE_ADMIN` only):**
  - `/admin/dashboard` -> Platform statistics & metrics
  - `/admin/users` -> User management table
  - `/admin/users/:userId` -> User details & block/unblock/delete actions
  - `/admin/wallets` -> Platform wallet management & block/unblock actions
  - `/admin/transactions` -> Transaction ledger with status filtering
  - `/admin/transactions/:referenceNumber` -> Admin transaction details
  - `/admin/profile` -> Admin account management & password change
- **Fallback Route:**
  - `*` -> 404 Not Found Page

---

## 7. Authentication Flow Analysis

1. **User Submits Login Credentials:**
   - Frontend sends `POST /users/login` with `{ email, password }`.
   - Backend validates credentials against MySQL database using `BCryptPasswordEncoder.matches()`.
   - Backend checks user account status (`"ACTIVE"` required; `"BLOCKED"` throws `RuntimeException("User account is blocked")`).
   - Backend returns `LoginRespDTO`:
     ```json
     {
       "token": "eyJhbGciOi...",
       "user": {
         "userId": 1,
         "firstName": "John",
         "lastName": "Doe",
         "email": "john@example.com",
         "phone": "9876543210",
         "gender": "MALE",
         "status": "ACTIVE",
         "emailVerified": true
       }
     }
     ```
2. **Token Storage & Role Resolution:**
   - Token is stored in `localStorage` under key `"token"`.
   - Role determination: The backend `UserRespDTO` does not include a `role` field. However, role-based redirection is cleanly resolved:
     - The frontend probes `/admin/dashboard` upon login. If it returns `200 OK`, the role is determined as `"ADMIN"`. If it returns `403 Forbidden`, the role is determined as `"USER"`.
     - The determined role is cached in `localStorage` (`"role"`) and held in `AuthContext`.
3. **Session Interception:**
   - `api.js` attaches the JWT in the `Authorization: Bearer <token>` header on every request.
   - On response `401 Unauthorized` or `403 Forbidden` from authorization failures, the user is redirected gracefully to `/login` or an Access Denied view.
4. **Logout:**
   - `localStorage.removeItem("token")` and `localStorage.removeItem("role")`.
   - Clears `AuthContext` state and navigates to `/login`.

---

## 8. Admin Flow Analysis

1. **Dashboard:**
   - Admin accesses `/admin/dashboard`.
   - Backend service aggregates counts from `userRepo`, `walletRepo`, and `transactionRepo`.
   - Displays KPIs: Total Users, Active Users, Blocked Users, Total Wallets, Active Wallets, Blocked Wallets, Total Transactions, Successful Transactions, Failed Transactions, Total Transferred Amount.
2. **User Management:**
   - Admin accesses `/admin/users`.
   - Fetches all registered users via `GET /users` (or `/admin/users`).
   - Allows search by name, email, or phone.
   - Admin views specific user details at `/admin/users/:userId`.
   - Admin can block (`PUT /admin/users/:userId/block`) or unblock (`PUT /admin/users/:userId/unblock`) a user.
   - Admin can delete a user (`DELETE /admin/users/:userId`).
3. **Wallet Management:**
   - Admin accesses `/admin/wallets`.
   - Fetches all user wallets via `GET /admin/wallets`.
   - Shows user details, wallet number, balance, status (`ACTIVE` / `BLOCKED`), creation timestamp.
   - Admin can block (`PUT /admin/wallets/:walletId/block`) or unblock (`PUT /admin/wallets/:walletId/unblock`).
4. **Transaction Monitoring:**
   - Admin accesses `/admin/transactions`.
   - Fetches all platform transactions via `GET /admin/transactions`.
   - Filter by status (`ALL`, `SUCCESS`, `FAILED`) or search by reference number.
   - Admin views transaction details at `/admin/transactions/:referenceNumber`.
5. **Account Settings & Logout:**
   - Admin can update password via `/users/me/password`.
   - Admin logs out from navigation sidebar.

---

## 9. User Flow Analysis

1. **Registration & Onboarding:**
   - Visitor fills registration form (`firstName`, `lastName`, `email`, `password`, `phone`, `dateOfBirth`, `gender`).
   - On success, prompts user to verify email.
2. **Email Verification:**
   - User requests verification token via `POST /users/send-verification`.
   - User inputs or links token via `GET /users/verify-email?token=...`.
3. **Dashboard & Wallet Overview:**
   - Displays welcome banner, quick wallet balance card, email verification status badge, quick actions (Add Money, Send Money, Receive QR, Transactions).
4. **Deposit & Withdrawal:**
   - User navigates to `/wallet`.
   - Quick deposit chips (+₹100, +₹500, +₹1,000, +₹5,000) or custom amount via `POST /wallets/add-money?amount=...`.
   - Withdrawal validation against current balance via `POST /wallets/withdraw?amount=...`.
5. **Money Transfer:**
   - User navigates to `/transfer`.
   - Options to input Receiver QR String (`PAYSPHERE:USER:{id}`) or Receiver User ID.
   - Live recipient verification via `POST /qr/scan` to show receiver name before sending.
   - Confirmation modal before transaction execution.
   - Executes `POST /wallets/transfer` or `POST /transactions/transfer`.
6. **QR Code Sharing:**
   - User navigates to `/qr`.
   - Fetches personal QR via `GET /qr/my-qr` (blob image).
   - Allows downloading or scanning directly.
7. **Transaction History & Digital Receipt:**
   - Displays all inbound (green "+") and outbound (red "-") transactions.
   - Filter by Sent/Received and search by reference number.
   - Click to open digital receipt modal or dedicated receipt page (`/transactions/:ref`).
8. **Profile & Security Settings:**
   - View account details, update name and phone number (`PUT /users/me`).
   - Secure password change (`PUT /users/me/password`).

---

## 10. Security Observations & Verification

1. **Cross-User Transaction Access Check:**
   - **Verification:** Tested controller and service implementation for `/transactions/reference/{referenceNumber}`.
   - **Backend Implementation:**
     ```java
     // TransactionServiceImpl.java
     User user = SecurityUtil.getCurrentUser();
     Transaction trans = tr.findUserTransactionByReference(referenceNumber, user)
             .orElseThrow(() -> new RuntimeException("Transaction not found"));
     ```
     ```java
     // TransactionRepo.java
     @Query("""
         SELECT t FROM Transaction t
         WHERE t.referenceNumber = :referenceNumber
         AND (t.sender = :user OR t.receiver = :user)
     """)
     Optional<Transaction> findUserTransactionByReference(
             @Param("referenceNumber") String referenceNumber,
             @Param("user") User user);
     ```
   - **Conclusion:** A regular user **cannot** view another user's transaction by tampering with the reference number in the URL. If the user is neither sender nor receiver, the repository returns empty and an exception is raised.

2. **Role Isolation Check:**
   - In `SecurityConfig.java`:
     - `/transactions/**` and `/wallets/**` are strictly restricted to `hasRole("USER")`.
     - `/admin/**` and `/users/**` (except `/users/me` and `/users/me/password`) are strictly restricted to `hasRole("ADMIN")`.
   - If an ADMIN attempts to invoke wallet or user transaction endpoints, Spring Security halts execution with `403 Forbidden`.
   - If a USER attempts to invoke admin endpoints, Spring Security halts execution with `403 Forbidden`.
   - Frontend must respect this by preventing navigation between the two domains.

3. **User Account Status Enforcement:**
   - In `UserServiceImpl.java`:
     ```java
     if (!"ACTIVE".equals(user.getStatus())) {
         throw new RuntimeException("User account is blocked");
     }
     ```
     Blocked users cannot authenticate.
   - In `WalletServiceImpl.java`:
     ```java
     if ("BLOCKED".equals(senderWallet.getWalletStatus())) {
         throw new RuntimeException("Sender wallet is blocked");
     }
     ```
     Blocked wallets cannot send or receive funds.

4. **Exception Handling Representation:**
   - Backend returns plain text strings inside HTTP 400 Bad Request (not JSON error objects).
   - The frontend error handlers must check `typeof error.response?.data === 'string' ? error.response.data : error.response?.data?.message` to display proper error messages to the user.

---

## 11. Planned Frontend Work

1. **Phase 1: Dependencies & Tailwind CSS Configuration**
   - Install Tailwind CSS v4 / PostCSS Vite plugin in `PaySphere-Frontend`.
   - Verify build pipeline compiles cleanly with responsive utility classes.

2. **Phase 2: Authentication Context & Route Guards**
   - Implement `AuthContext.jsx` with token, user, role state, and logout handlers.
   - Implement `ProtectedRoute.jsx` supporting role checking (`requiredRole="USER"` and `requiredRole="ADMIN"`).
   - Implement role discovery logic without modifying backend code.

3. **Phase 3: Core UI Component Library**
   - Navigation Bar & Sidebar (responsive with mobile drawer).
   - Card, Button, StatusBadge, Modal, Toast/Alert, StatCard, LoadingSpinner, EmptyState.

4. **Phase 4: Missing Auth & User Features**
   - Forgot Password page (`/forgot-password`).
   - Reset Password page (`/reset-password`).
   - Email Verification page (`/verify-email`).
   - QR Code page/modal with blob fetching and download (`/qr`).
   - Enhanced Transfer page with recipient preview (`/transfer`).

5. **Phase 5: Missing Admin Features**
   - Implement `AdminWallets.jsx` with full wallet management and status toggling.
   - Fix Admin Dashboard DTO field mismatches in `AdminDashboard.jsx`.
   - Add unified Admin navigation and layout.

6. **Phase 6: Comprehensive UI/UX Upgrade**
   - Transform all existing pages into responsive Tailwind fintech components.
   - Polish spacing, typography, color scheme (slate/indigo/emerald fintech palette), cards, and tables.

7. **Phase 7: End-to-End Testing & Verification**
   - Test every User flow and Admin flow against the API specifications.
   - Validate authorization boundaries and error conditions.

8. **Phase 8: Project Handoff Documentation**
   - Generate `PAYSPHERE_HANDOFF.md` covering all 16 required sections.
