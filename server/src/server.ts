import express from 'express';
import cors from 'cors';
import routes from './routes';
import { errorHandler } from './middleware/errorHandler';
import { initializeDatabase } from './config/database';

const app = express();
const PORT = process.env.PORT || 3000;


app.use(cors());
app.use(express.json());


app.use((req, _res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});


app.get('/', (_req, res) => {
  res.json({
    message: 'JOBS CRM API (TypeScript)',
    status: 'running',
    endpoints: {
      customers: '/api/customers',
      jobs: '/api/jobs',
      appointments: '/api/jobs/:id/appointments',
      invoices: '/api/jobs/:id/invoice',
      payments: '/api/invoices/:id/payments',
    },
  });
});


app.use('/api', routes);


app.use(errorHandler);


initializeDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to initialize database:', err);
    process.exit(1);
  });

