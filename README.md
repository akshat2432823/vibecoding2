# GenC Tracking System

A comprehensive web application for tracking onboarding and progress of new trainee employees called GenC. Built with React TypeScript frontend, Python FastAPI backend, and SQLite database.

## Features

- **GenC Management**: Track trainee employees with complete profile information
- **Mentor Management**: Manage mentors assigned to GenCs
- **Account Management**: Handle client accounts and service lines
- **Feedback System**: Record and track feedback for GenCs
- **Status Workflow**: Implement proper status transitions for GenC progress
- **User Management**: Manage application users with different roles

## Technology Stack

- **Frontend**: React 18 + TypeScript + Tailwind CSS + Vite
- **Backend**: Python FastAPI + SQLAlchemy + SQLite
- **UI Components**: Lucide React icons + React Hook Form + React Hot Toast

## Database Schema

The application includes the following tables:

1. **GenC**: Main table for trainee employees
2. **Mentor**: Table for mentors
3. **Account**: Table for client accounts
4. **Account Service Line**: Service lines associated with accounts
5. **GenC Feedback**: Feedback records for GenCs
6. **Application Users**: System users

## Project Structure

```
vibecoding2/
├── backend/
│   ├── main.py              # FastAPI application
│   ├── models.py            # Database models
│   ├── schemas.py           # Pydantic schemas
│   ├── crud.py              # CRUD operations
│   ├── database.py          # Database configuration
│   └── requirements.txt     # Python dependencies
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── pages/           # Page components
│   │   ├── types.ts         # TypeScript types
│   │   ├── api.ts           # API service layer
│   │   ├── App.tsx          # Main App component
│   │   └── main.tsx         # React entry point
│   ├── package.json         # Node dependencies
│   └── index.html           # HTML template
└── README.md
```

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a Python virtual environment:
   ```bash
   python -m venv venv
   ```

3. Activate the virtual environment:
   - Windows: `venv\Scripts\activate`
   - macOS/Linux: `source venv/bin/activate`

4. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

5. Run the FastAPI server:
   ```bash
   python main.py
   ```
   
   Or alternatively:
   ```bash
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

The backend API will be available at: `http://localhost:8000`

API documentation will be available at: `http://localhost:8000/docs`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install Node.js dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

The frontend application will be available at: `http://localhost:3000`

## API Endpoints

### GenC Endpoints
- `GET /gencs/` - List all GenCs
- `POST /gencs/` - Create new GenC
- `GET /gencs/{id}` - Get GenC by ID
- `PUT /gencs/{id}` - Update GenC
- `DELETE /gencs/{id}` - Delete GenC

### Mentor Endpoints
- `GET /mentors/` - List all mentors
- `POST /mentors/` - Create new mentor
- `GET /mentors/{id}` - Get mentor by ID
- `PUT /mentors/{id}` - Update mentor
- `DELETE /mentors/{id}` - Delete mentor

### Account Endpoints
- `GET /accounts/` - List all accounts
- `POST /accounts/` - Create new account
- `GET /accounts/{id}` - Get account by ID
- `PUT /accounts/{id}` - Update account
- `DELETE /accounts/{id}` - Delete account

### Service Line Endpoints
- `GET /account-service-lines/` - List all service lines
- `POST /account-service-lines/` - Create new service line
- `GET /account-service-lines/{id}` - Get service line by ID
- `PUT /account-service-lines/{id}` - Update service line
- `DELETE /account-service-lines/{id}` - Delete service line

### Feedback Endpoints
- `GET /genc-feedbacks/` - List all feedback
- `POST /genc-feedbacks/` - Create new feedback
- `GET /genc-feedbacks/{id}` - Get feedback by ID
- `PUT /genc-feedbacks/{id}` - Update feedback
- `DELETE /genc-feedbacks/{id}` - Delete feedback

### User Endpoints
- `GET /application-users/` - List all users
- `POST /application-users/` - Create new user
- `GET /application-users/{id}` - Get user by ID
- `PUT /application-users/{id}` - Update user
- `DELETE /application-users/{id}` - Delete user

### Utility Endpoints
- `GET /enums/status` - Get status options
- `GET /enums/location` - Get location options
- `GET /enums/designation` - Get designation options
- `GET /enums/mentor-designation` - Get mentor designation options
- `GET /enums/user-type` - Get user type options
- `GET /enums/status-transitions` - Get allowed status transitions

## Status Workflow

The GenC status follows a specific workflow with allowed transitions:

- **Idle** → Under Project Training, Customer Onboarded, Released/Resigned
- **Under Project Training** → Customer Onboarded, Feedback Not Good, Released/Resigned
- **Customer Onboarded** → Billing Planned, Feedback Not Good, Released/Resigned
- **Billing Planned** → Feedback Not Good, Billing Started, Released/Resigned
- **Billing Started** → GenC Regularized, Released/Resigned
- **Feedback Not Good** → (Terminal state)
- **GenC Regularized** → (Terminal state)
- **Released/Resigned** → (Terminal state)

## Development

### Running in Development Mode

1. Start the backend server (port 8000)
2. Start the frontend development server (port 3000)
3. The frontend is configured to proxy API requests to the backend

### Database

The application uses SQLite for local development. The database file `genc_tracking.db` will be created automatically when you first run the backend.

### Adding New Features

1. Backend changes:
   - Update models in `models.py`
   - Add/update schemas in `schemas.py`
   - Implement CRUD operations in `crud.py`
   - Add API endpoints in `main.py`

2. Frontend changes:
   - Update types in `types.ts`
   - Add API calls in `api.ts`
   - Create/update components and pages
   - Update routing in `App.tsx`

## Troubleshooting

- **CORS Issues**: Make sure the backend CORS middleware is configured to allow requests from the frontend origin
- **Database Issues**: Delete the `genc_tracking.db` file to reset the database
- **Port Conflicts**: Change the ports in the configuration files if there are conflicts

## Future Enhancements

- Authentication and authorization
- Role-based access control
- Advanced reporting and analytics
- Email notifications
- Data export functionality
- Advanced search and filtering 