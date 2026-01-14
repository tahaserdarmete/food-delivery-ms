# 🍔 Food Delivery Microservices

A scalable and secure food delivery platform developed with a modern microservice architecture. This project applies the fundamental principles of microservice architecture, offering a system where each service can be independently developed, tested, and deployed.

### Key Features

- ✅ Microservice Architecture: Each service runs independently and is scalable
- ✅ API Gateway: All requests are managed from a single point
- ✅ Message Queues: Asynchronous inter-service communication with RabbitMQ
- ✅ JWT Authentication: Secure token-based authentication
- ✅ Role-Based Authorization: Admin, user, restaurant owner, and courier roles
- ✅ Rate Limiting: Protection against API requests
- ✅ Security: Helmet, CORS, and other security measures

### Backend
- Node.js
- TypeScript
- Express.js
- MongoDB
- Mongoose
- RabbitMQ
- JWT
- bcrypt

### Security & Middleware
- Helmet
- CORS
- express-rate-limit
- cookie-parser
- morgan

### Validation & Utilities
- Zod
- dotenv

### Development
- nodemon
- tsx
- TypeScript

## 🔧 Services

### 1. Auth Service
Manages user registration, login, logout, and profile management.

### 2. Order Service
Manages order creation, listing, and status update.

### 3. Delivery Service
Manages delivery management, courier assignment, and delivery tracking.

### 4. Restaurant Service
Manages restaurant and menu management.

### 5. Gateway Service
Provides access to all services from a single point and directs requests to the relevant services.
