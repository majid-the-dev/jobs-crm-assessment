## Tech Stack

**Backend:**
- Node.js + Express + TypeScript
- SQLite database
- RESTful API

**Frontend:**
- React + TypeScript
- React Query (data fetching)
- React DnD (drag-and-drop)
- Shadcn UI + Tailwind CSS
- Vite

### Prerequisites
- Node.js 18+
- npm

### Installation & Setup

1. **Backend Setup**
```bash
cd server
npm install
npm run seed
npm run dev     # The server runs on port 3000
```

2. **Frontend Setup**
```bash
cd client
npm install
npm run dev     # The client runs on port 5173
```

3. **Urls**
- Frontend: http://localhost:5173
- API: http://localhost:3000/api

## Features

### Job Management
- Create customers and jobs
- Drag-and-drop Kanban board
- Schedule appointments with technicians
- Conflict detection for overlapping appointments
- Mark jobs as done
- Generate invoices with invoice items
- Record payments
- Automatic status updates when full payment is recorded

### UI Components
- Customer search and autocomplete
- Modal dialogs for status transitions
- Form validation with React Hook Form + Zod
- Toast notifications
- Responsive design

## Project Structure

```
crm-assessment/
├── server/                 # Backend API
│   ├── src/
│   │   ├── config/        # Database setup
│   │   ├── controllers/   # Business logic
│   │   ├── routes/        # API endpoints
│   │   ├── middleware/    # Error handling
│   │   ├── types/         # TypeScript interfaces
│   │   └── scripts/       # Database seeding
│   └── __tests__/         # Unit & integration tests
│
└── client/                 # Frontend React app
    ├── src/
    │   ├── components/    # React components
    │   ├── hooks/         # Custom React Query hooks
    │   ├── lib/           # API utilities
    │   └── types/         # TypeScript interfaces
    └── ...
```

## API Endpoints

### Customers
- `POST /api/customers` - Create customer
- `GET /api/customers` - List customers
- `GET /api/customers/:id` - Get customer details

### Technicians
- `POST /api/technicians` - Create technician
- `GET /api/technicians` - List technicians
- `GET /api/technicians/:id` - Get technician with appointments

### Jobs
- `POST /api/jobs` - Create job
- `GET /api/jobs` - List jobs (filter by status)
- `GET /api/jobs/:id` - Get job details
- `PATCH /api/jobs/:id/status` - Update job status

### Appointments
- `POST /api/jobs/:id/appointments` - Schedule appointment

### Invoices
- `POST /api/jobs/:id/invoice` - Create invoice

### Payments
- `POST /api/invoices/:id/payments` - Record payment

## Database Schema

- **customers** - Customer information
- **technicians** - Technician details
- **jobs** - Job records with status tracking
- **appointments** - Scheduled appointments (one per job)
- **invoices** - Invoice records with line items
- **payments** - Payment history

## Validation Rules

- Jobs must be Scheduled before Done
- Jobs must be Done before Invoiced
- Jobs must be fully paid before status changes to Paid
- Cannot skip status steps (linear progression)
- Technicians cannot have overlapping appointments
- Payments cannot exceed invoice balance

## Testing

Run backend tests:
```bash
cd server
npm test
```

Tests that were ran:
- Invoice total calculations
- Payment balance updates
- Appointment overlap detection
- Integration tests for conflicts

## Seed Data

The database comes pre-seeded with:
- 3 customers
- 1 technician (Taylor)
- 2 jobs in "New" status
- 1 job in "Scheduled" status (Taylor, 10:00-12:00 today)

To re-seed: `cd server && npm run seed`
