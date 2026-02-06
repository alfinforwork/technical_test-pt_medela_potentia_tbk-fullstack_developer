# CRM Backend

RESTful API for employee attendance and management system built with NestJS and TypeORM.

## Technologies

- **NestJS 11.0.1** - Progressive Node.js framework
- **TypeScript 5.9.3** - Type-safe JavaScript
- **TypeORM 0.3.28** - Object-Relational Mapping
- **MySQL 8** - Database
- **JWT** - Authentication
- **AWS S3** - File storage for photos
- **bcryptjs** - Password hashing
- **Passport** - Authentication middleware

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- MySQL server running
- AWS S3 bucket (for file uploads)

## Installation

```bash
cd crm-backend
npm install
```

## Environment Setup

Create a `.env` file in the root directory:

```env
# Database
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=password
DB_NAME=crm_db

# JWT
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRATION=7d

# AWS S3
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_S3_BUCKET=your_bucket_name

# Server
PORT=3001
NODE_ENV=development
```

## Running the Application

### Development Mode

```bash
npm run start:dev
```

Starts the server with watch mode. Changes to files will automatically reload the server.

### Production Mode

```bash
npm run build
npm run start:prod
```

### Watch Mode (without start)

```bash
npm run start:watch
```

## Running Tests

```bash
# Unit tests
npm run test

# Test with coverage
npm run test:cov

# E2E tests
npm run test:e2e
```

## Project Structure

```
src/
├── app/                 # Application modules
│   ├── auth/           # Authentication module
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── auth.module.ts
│   │   └── dto/
│   ├── employee/       # Employee management module
│   │   ├── employee.controller.ts
│   │   ├── employee.service.ts
│   │   ├── employee.module.ts
│   │   └── dto/
│   └── attendance/     # Attendance tracking module
│       ├── attendance.controller.ts
│       ├── attendance.service.ts
│       ├── attendance.module.ts
│       └── dto/
├── common/             # Common utilities
│   ├── error.handler.ts    # Error handling
│   └── response.ts         # Standardized response format
├── config/             # Configuration files
│   ├── database.config.ts
│   └── jwt.config.ts
├── entities/           # Database entities
│   ├── user.entity.ts
│   ├── employee.entity.ts
│   └── attendance.entity.ts
├── services/           # Shared services
│   └── s3.service.ts   # AWS S3 file upload
├── seed/               # Database seeding
│   └── seed.service.ts
└── main.ts            # Application entry point
```

## API Documentation

### Base URL

```
http://localhost:3001/api
```

### Authentication Endpoints

#### Register User

```
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe",
  "role": "employee"
}

Response: 201 Created
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe",
    "role": "employee"
  }
}
```

#### Login

```
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

Response: 200 OK
{
  "success": true,
  "message": "Login successful",
  "data": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe",
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

### Employee Endpoints

#### Get All Employees (Paginated)

```
GET /employees?page=1&limit=10
Authorization: Bearer {token}

Response: 200 OK
{
  "success": true,
  "message": "Employees retrieved successfully",
  "data": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "department": "IT",
      "position": "Developer",
      "isActive": true
    }
  ],
  "total": 50,
  "page": 1,
  "limit": 10
}
```

#### Get Active Employees

```
GET /employees/active
Authorization: Bearer {token}

Response: 200 OK
```

#### Get Employee by ID

```
GET /employees/:id
Authorization: Bearer {token}

Response: 200 OK
{
  "success": true,
  "message": "Employee retrieved successfully",
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "department": "IT",
    "position": "Developer",
    "isActive": true
  }
}
```

#### Get Employee by User ID

```
GET /employees/user/:userId
Authorization: Bearer {token}

Response: 200 OK
```

#### Create Employee

```
POST /employees
Authorization: Bearer {token}
Content-Type: application/json

{
  "userId": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "department": "IT",
  "position": "Developer"
}

Response: 201 Created
{
  "success": true,
  "message": "Employee created successfully",
  "data": {
    "id": 1,
    "userId": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "department": "IT",
    "position": "Developer",
    "isActive": true
  }
}
```

#### Update Employee

```
PUT /employees/:id
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Jane Doe",
  "department": "HR",
  "position": "Manager"
}

Response: 200 OK
{
  "success": true,
  "message": "Employee updated successfully",
  "data": { ... }
}
```

#### Deactivate Employee

```
PUT /employees/:id/deactivate
Authorization: Bearer {token}

Response: 200 OK
{
  "success": true,
  "message": "Employee deactivated successfully",
  "data": { ... }
}
```

#### Activate Employee

```
PUT /employees/:id/activate
Authorization: Bearer {token}

Response: 200 OK
{
  "success": true,
  "message": "Employee activated successfully",
  "data": { ... }
}
```

#### Delete Employee

```
DELETE /employees/:id
Authorization: Bearer {token}

Response: 200 OK
{
  "success": true,
  "message": "Employee deleted successfully",
  "data": null
}
```

### Attendance Endpoints

#### Check-in (Create Attendance)

```
POST /attendances
Authorization: Bearer {token}
Content-Type: multipart/form-data

{
  "employeeId": 1,
  "checkInTime": "2024-01-15T09:00:00Z",
  "photo": <file>
}

Response: 201 Created
{
  "success": true,
  "message": "Attendance checked in successfully",
  "data": {
    "id": 1,
    "employeeId": 1,
    "checkInTime": "2024-01-15T09:00:00Z",
    "checkOutTime": null,
    "photoUrl": "https://s3.amazonaws.com/bucket/..."
  }
}
```

#### Get All Attendances (Paginated)

```
GET /attendances?page=1&limit=10
Authorization: Bearer {token}

Response: 200 OK
{
  "success": true,
  "message": "Attendances retrieved successfully",
  "data": [
    {
      "id": 1,
      "employeeId": 1,
      "checkInTime": "2024-01-15T09:00:00Z",
      "checkOutTime": "2024-01-15T17:00:00Z",
      "photoUrl": "https://s3.amazonaws.com/bucket/..."
    }
  ],
  "total": 100,
  "page": 1,
  "limit": 10
}
```

#### Get Attendance by User ID (Paginated)

```
GET /attendances/user/:userId?page=1&limit=10
Authorization: Bearer {token}

Response: 200 OK
```

#### Get Attendance by Employee ID (Paginated)

```
GET /attendances/employee/:employeeId?page=1&limit=10
Authorization: Bearer {token}

Response: 200 OK
```

#### Get Today's Attendance

```
GET /attendances/today/:employeeId
Authorization: Bearer {token}

Response: 200 OK
{
  "success": true,
  "message": "Today attendance retrieved successfully",
  "data": {
    "id": 1,
    "employeeId": 1,
    "checkInTime": "2024-01-15T09:00:00Z",
    "checkOutTime": null,
    "photoUrl": "https://s3.amazonaws.com/bucket/..."
  }
}
```

#### Get Attendance by ID

```
GET /attendances/:id
Authorization: Bearer {token}

Response: 200 OK
{
  "success": true,
  "message": "Attendance retrieved successfully",
  "data": { ... }
}
```

#### Check-out

```
PUT /attendances/:id/checkout
Authorization: Bearer {token}
Content-Type: multipart/form-data

{
  "checkOutTime": "2024-01-15T17:00:00Z",
  "photo": <file>
}

Response: 200 OK
{
  "success": true,
  "message": "Attendance checked out successfully",
  "data": {
    "id": 1,
    "employeeId": 1,
    "checkInTime": "2024-01-15T09:00:00Z",
    "checkOutTime": "2024-01-15T17:00:00Z",
    "photoUrl": "https://s3.amazonaws.com/bucket/..."
  }
}
```

#### Update Attendance

```
PUT /attendances/:id
Authorization: Bearer {token}
Content-Type: application/json

{
  "checkInTime": "2024-01-15T09:30:00Z"
}

Response: 200 OK
{
  "success": true,
  "message": "Attendance updated successfully",
  "data": { ... }
}
```

#### Delete Attendance

```
DELETE /attendances/:id
Authorization: Bearer {token}

Response: 200 OK
{
  "success": true,
  "message": "Attendance deleted successfully",
  "data": null
}
```

## Error Handling

All errors follow a consistent format:

```json
{
  "success": false,
  "message": "Error description",
  "error": "Error details"
}
```

HTTP Status Codes:

- `200` - OK
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

## Database Schema

### Users Table

```sql
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  role ENUM('admin', 'employee') DEFAULT 'employee',
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Employees Table

```sql
CREATE TABLE employees (
  id INT PRIMARY KEY AUTO_INCREMENT,
  userId INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  department VARCHAR(255),
  position VARCHAR(255),
  isActive BOOLEAN DEFAULT true,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id)
);
```

### Attendances Table

```sql
CREATE TABLE attendances (
  id INT PRIMARY KEY AUTO_INCREMENT,
  employeeId INT NOT NULL,
  checkInTime TIMESTAMP NOT NULL,
  checkOutTime TIMESTAMP,
  photoUrl VARCHAR(500),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (employeeId) REFERENCES employees(id)
);
```
