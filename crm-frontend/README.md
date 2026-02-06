# CRM Frontend

Employee attendance and management system built with React, Redux, and TypeScript.

## Technologies

- **React 19.2.4** - UI framework
- **TypeScript 5.9.3** - Type-safe JavaScript
- **Redux Toolkit 2.11.2** - State management
- **Tailwind CSS 3** - Utility-first CSS framework
- **Axios 1.13.4** - HTTP client
- **React Router 7.13.0** - Client-side routing
- **React Icons 5.5.0** - Icon library

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn

## Installation

```bash
cd crm-frontend
npm install
```

## Running the Application

### Development Mode

```bash
npm start
```

Opens [http://localhost:3000](http://localhost:3000) in your browser. The page will reload when you make changes.

### Production Build

```bash
npm run build
```

Builds the app for production to the `build` folder. The build is optimized and ready for deployment.

### Testing

```bash
npm test
```

Launches the test runner in interactive watch mode.

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── atoms/          # Basic components (Button, Input, Card, etc.)
│   ├── molecules/      # Composite components (FormField, Pagination)
│   ├── organisms/      # Complex components (Forms, Header)
│   └── layouts/        # Page layouts (AdminLayout, UserLayout)
├── pages/              # Page components
│   ├── admin/         # Admin pages (Dashboard, Attendance Monitoring, Manage Employee)
│   ├── auth/          # Auth pages (Login, Register)
│   └── user/          # User pages (Employee Dashboard)
├── redux/             # State management
│   ├── store.ts       # Redux store configuration
│   ├── slices/        # Redux slices (auth, employee, attendance)
│   └── actions/       # Redux action creators
├── routes/            # Route configuration
│   ├── AppRoutes.tsx  # Main routing setup
│   └── ProtectedRoute.tsx  # Route protection logic
├── services/          # API services
│   └── api.ts         # Axios instance and API calls
├── utils/             # Utility functions
└── App.tsx            # Root component

```

## Key Features

- **Authentication** - User login and registration
- **Employee Management** - Create, read, update, delete employees
- **Attendance Tracking** - Check-in/check-out with photo capture
- **Dashboard** - View attendance statistics and employee data
- **Role-based Access** - Different views for admin and employees

## API Integration

The frontend communicates with the backend API at `http://localhost:3001/api`.

Key endpoints used:

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/employees` - Get all employees
- `POST /api/employees` - Create employee
- `GET /api/employees/:id` - Get employee by ID
- `PUT /api/employees/:id` - Update employee
- `DELETE /api/employees/:id` - Delete employee
- `POST /api/attendances` - Check-in
- `PUT /api/attendances/:id/checkout` - Check-out
- `GET /api/attendances` - Get all attendances
