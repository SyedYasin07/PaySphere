PaySphere — Secure P2P Digital Wallet System
PaySphere is a full-stack peer-to-peer (P2P) digital wallet application built with Java, Spring Boot, Spring Security, JWT, React.js, and TiDB Cloud. It allows registered users to manage an in-app wallet balance, transfer balances to other PaySphere users, identify recipients using PaySphere QR codes, and review transaction history. An administrator interface provides user, wallet, and transaction management.
Project disclaimer: PaySphere is an academic/software-development project, not a real banking, UPI, or payment-settlement system. Add Money is simulated within the application. No real money is deposited, withdrawn, transferred, or settled through a bank or payment gateway.

🔗 Live Links
- Live Frontend: https://paysphere-1.onrender.com/
- Backend API: https://paysphere-ju54.onrender.com
- GitHub Repository: https://github.com/SyedYasin07/PaySphere
The first request to a free Render service may take a little time if the service has been idle.

✨ Features
User Features
- User registration and login
- JWT-based authentication
- Role-based access for users and administrators
- BCrypt password hashing
- Email-verification and password-recovery workflows
- Profile viewing and updating
- Automatic wallet creation during registration
- In-app wallet balance viewing
- Simulated Add Money and wallet withdrawal operations
- P2P transfers between registered PaySphere users
- PaySphere QR generation and scanning for recipient identification
- Transaction history and transaction lookup by reference number
- Wallet operation and transaction validations
Wallet and Transfer Rules
- Maximum ₹1,00,00,000 (₹1 crore) per operation for the configured Add Money, withdrawal, and transfer flows
- Maximum 5 successful Add Money operations per day
- Maximum 5 successful withdrawals per day
- Maximum 5 successful P2P transfers per day
- Positive-amount and sufficient-balance validation
- Wallet-status checks before wallet operations and transfers
- Prevention of transfers to the same user
These limits are application-level rules for this project; they are not claims about universal banking limits.
QR Features
- Generate a QR code for the logged-in PaySphere user
- Scan PaySphere QR data to identify a recipient
- QR payload format: PAYSPHERE:USER:{userId}
PaySphere QR codes identify users inside the PaySphere application. They are not UPI QR codes.
Admin Features
- Dashboard statistics for users, wallets, and transactions
- View users and individual user details
- Block and unblock users
- Delete users with dependent transaction and wallet records handled by the backend
- View wallets and balances
- Block and unblock wallets
- View all P2P transactions
- Search a transaction by reference number
- Filter transactions by status
🧰 Technology Stack
Frontend
- React.js
- Vite
- React Router
- Axios
- Tailwind CSS
- JavaScript
Backend
- Java 21
- Spring Boot
- Spring Web / REST APIs
- Spring Security
- JSON Web Tokens (JWT)
- Spring Data JPA
- Hibernate
- Maven
- BCrypt password hashing
- ZXing for QR-code generation
Database and Tools
- MySQL for local development
- TiDB Cloud for the deployed application
- Postman for API testing
- Git and GitHub for version control
- Render for deployment
🏗️ Architecture
PaySphere follows a layered backend architecture:
React Frontend
      |
      | HTTP requests (Axios)
      v
Spring Boot REST Controllers
      |
      v
Service Interfaces and Implementations
      |
      v
Spring Data JPA Repositories
      |
      v
TiDB Cloud Database
Main backend layers
- Controller layer: Exposes endpoints, reads request data, calls services, and returns API responses.
- Service layer: Implements business rules, validates wallet operations, processes transfers, and maps data to response DTOs.
- Repository layer: Uses Spring Data JPA to query and persist entities.
- Entity layer: Represents users, roles, wallets, transactions, and wallet operations.
- DTO layer: Defines the request and response data exchanged through the API.
- Security layer: Handles JWT authentication and role-based authorization.
🔐 Security and Validation
- JWT tokens authenticate requests to protected endpoints.
- Spring Security enforces role-based access for user and administrator operations.
- Passwords are stored using BCrypt hashing rather than plaintext.
- The backend derives the current user from the authenticated security context for personal wallet/profile operations.
- Transaction lookups for normal users are scoped to transactions where the user is the sender or receiver.
- Service-layer checks validate amounts, wallet status, available balance, self-transfers, and configured daily limits.
- P2P wallet updates and the transaction record are performed within a transactional service operation.
🔌 Main API Endpoints
These are the main routes implemented in the application. Protected endpoints require the appropriate authentication and role.
Authentication and Users
Method	Endpoint	Purpose
POST	/users/register	Register a user and create a wallet
POST	/users/login	Authenticate and obtain a JWT
GET	/users/me	Get the current user's profile
PUT	/users/me	Update the current user's profile
PUT	/users/me/password	Change the current user's password
POST	/users/forgot-password	Start password recovery
POST	/users/reset-password	Reset a password using the reset flow
POST	/users/send-verification	Start email verification
GET	/users/verify-email?token=...	Verify an email using a token


Wallets
Method	Endpoint	Purpose
GET	/wallets/my-wallet	Get the current user's wallet
GET	/wallets/balance	Get the current user's balance
POST	/wallets/add-money?amount=500	Simulated wallet top-up
POST	/wallets/withdraw?amount=100	Withdraw from the in-app wallet balance
POST	/wallets/transfer	Transfer to a recipient using PaySphere QR data


QR and Transactions
Method	Endpoint	Purpose
GET	/qr/my-qr	Generate the current user's QR image
POST	/qr/scan	Resolve PaySphere QR data to recipient details
GET	/transactions/history	Get the current user's transaction history
GET	/transactions/my	Get the current user's transactions
GET	/transactions/reference/{referenceNumber}	Look up an accessible transaction by reference
POST	/transactions/transfer?receiverId=4&amount=500	Direct receiver-ID transfer endpoint


Administrator
Method	Endpoint	Purpose
GET	/admin/dashboard	Dashboard statistics
GET	/admin/users	View users
GET	/admin/users/{userId}	View a user
PUT	/admin/users/{userId}/block	Block a user
PUT	/admin/users/{userId}/unblock	Unblock a user
DELETE	/admin/users/{userId}	Delete a user
GET	/admin/wallets	View wallets
PUT	/admin/wallets/{walletId}/block	Block a wallet
PUT	/admin/wallets/{walletId}/unblock	Unblock a wallet
GET	/admin/transactions	View all transactions
GET	/admin/transactions/{referenceNumber}	View a transaction by reference
GET	/admin/transactions/status/{status}	Filter transactions by status


📁 Repository Structure
PaySphere/
├── src/                         # Spring Boot backend source
├── pom.xml                      # Maven project configuration
├── mvnw                         # Maven Wrapper
├── Dockerfile                   # Backend container build
└── frontend/
    ├── src/                     # React application source
    ├── public/                  # Static assets
    ├── package.json             # Frontend dependencies and scripts
    ├── package-lock.json        # Locked npm dependency versions
    └── vite.config.js           # Vite configuration
🚀 Deployment Overview
- Backend: Spring Boot application deployed on Render using Docker.
- Frontend: React/Vite app deployed as a Render Static Site.
- Database: TiDB Cloud, connected over TLS.
- Frontend API base URL: Configured with VITE_API_BASE_URL.
- Backend configuration: Database credentials and JWT secret should be supplied through environment variables in the deployment platform.
Important configuration note
Do not commit database passwords, JWT secrets, .env files, or other credentials to GitHub. Configure secrets as environment variables in Render. If a credential has ever been exposed, rotate it before continuing to use it.
🧪 Running Locally
Prerequisites
- Java 21 or a compatible JDK
- Node.js and npm
- MySQL, or another appropriately configured compatible database
- Git
Backend
1. Clone the repository:
   git clone https://github.com/SyedYasin07/PaySphere.git
   cd PaySphere
2. Configure datasource credentials and the JWT secret outside version control (for example, with environment variables or a local Spring profile).
3. Run the backend on Windows:
   .\mvnw.cmd spring-boot:run
   On macOS/Linux:
   chmod +x mvnw
   ./mvnw spring-boot:run
Frontend
Open a separate terminal:
cd frontend
npm ci
Create a local frontend environment file such as .env.local with the backend URL, for example:
VITE_API_BASE_URL=http://localhost:8081
Then start the development server:
npm run dev
The frontend must point to the backend URL you are running. Make sure the backend's CORS configuration allows that frontend origin.
📌 What I Learned
- Designing REST APIs with Spring Boot
- Implementing JWT authentication and role-based authorization
- Organizing code into controller, service, repository, entity, and DTO layers
- Managing relational data with Spring Data JPA and Hibernate
- Implementing wallet balance updates and transactional P2P transfer logic
- Validating transaction amounts, wallet status, balances, and daily operation limits
- Generating and processing application-specific QR codes with ZXing
- Integrating a React frontend with Spring Boot APIs using Axios
- Testing API workflows with Postman
- Deploying a full-stack application with Render and TiDB Cloud
👨‍💻 Developer
Sayed Yasin
- GitHub: https://github.com/SyedYasin07
- Project Repository: https://github.com/SyedYasin07/PaySphere
- Live Application: https://paysphere-1.onrender.com/
⭐ If you find this project useful, feel free to explore the repository and share feedback.
