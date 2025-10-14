import { Request, Response } from 'express';
import { getAll, getOne, runQuery } from '../config/database';
import { AppError, asyncHandler } from '../middleware/errorHandler';

export const createJob = asyncHandler(async (req: Request, res: Response) => {
  const { customer_id, title, description } = req.body;

  if (!customer_id || !title) {
    throw new AppError(400, 'customer_id and title are required');
  }

  const sql = `INSERT INTO jobs (customer_id, title, description, status) VALUES (?, ?, ?, 'New')`;
  const result = await runQuery(sql, [customer_id, title, description || null]);

  const customer = await getOne('SELECT * FROM customers WHERE id = ?', [customer_id]);

  res.status(201).json({
    id: result.lastID,
    customer_id,
    title,
    description: description || null,
    status: 'New',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    customer: customer!,
  });
});

export const getJobs = asyncHandler(async (req: Request, res: Response) => {
  const { status } = req.query;

  let sql = `
    SELECT 
      j.*,
      c.id as customer_id,
      c.name as customer_name,
      c.phone as customer_phone,
      c.email as customer_email,
      c.address as customer_address,
      c.created_at as customer_created_at,
      i.balance as invoice_balance
    FROM jobs j
    LEFT JOIN customers c ON j.customer_id = c.id
    LEFT JOIN invoices i ON j.id = i.job_id
  `;
  
  const params: any[] = [];

  if (status) {
    sql += ' WHERE j.status = ?';
    params.push(status);
  }

  sql += ' ORDER BY j.created_at DESC';

  const rows = await getAll(sql, params);
  
  const jobs = (rows as any[]).map(row => ({
    id: row.id,
    customer_id: row.customer_id,
    title: row.title,
    description: row.description,
    status: row.status,
    created_at: row.created_at,
    updated_at: row.updated_at,
    customer: {
      id: row.customer_id,
      name: row.customer_name,
      phone: row.customer_phone,
      email: row.customer_email,
      address: row.customer_address,
      created_at: row.customer_created_at,
    },
    invoice: row.invoice_balance !== null ? { balance: row.invoice_balance } : null,
  }));
  
  res.json(jobs);
});

export const getJobById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const sql = `
    SELECT 
      j.*,
      c.id as customer_id,
      c.name as customer_name,
      c.phone as customer_phone,
      c.email as customer_email,
      c.address as customer_address,
      a.id as appointment_id,
      a.technician_id,
      a.start_time,
      a.end_time,
      t.id as tech_id,
      t.name as technician_name,
      t.phone as technician_phone,
      t.email as technician_email,
      i.id as invoice_id,
      i.line_items,
      i.subtotal,
      i.total,
      i.balance
    FROM jobs j
    LEFT JOIN customers c ON j.customer_id = c.id
    LEFT JOIN appointments a ON j.id = a.job_id
    LEFT JOIN technicians t ON a.technician_id = t.id
    LEFT JOIN invoices i ON j.id = i.job_id
    WHERE j.id = ?
  `;

  const row = await getOne(sql, [id]);

  if (!row) {
    throw new AppError(404, 'Job not found');
  }

  const rowData = row as any;

  let payments: any[] = [];
  if (rowData.invoice_id) {
    payments = await getAll(
      'SELECT * FROM payments WHERE invoice_id = ? ORDER BY payment_date',
      [rowData.invoice_id]
    );
  }

  const job = {
    id: rowData.id,
    customer_id: rowData.customer_id,
    title: rowData.title,
    description: rowData.description,
    status: rowData.status,
    created_at: rowData.created_at,
    updated_at: rowData.updated_at,
    customer: {
      id: rowData.customer_id,
      name: rowData.customer_name,
      phone: rowData.customer_phone,
      email: rowData.customer_email,
      address: rowData.customer_address,
      created_at: '',
    },
    appointment: rowData.appointment_id
      ? {
          id: rowData.appointment_id,
          job_id: rowData.id,
          technician_id: rowData.technician_id,
          start_time: rowData.start_time,
          end_time: rowData.end_time,
          created_at: '',
          technician: {
            id: rowData.tech_id,
            name: rowData.technician_name,
            phone: rowData.technician_phone,
            email: rowData.technician_email,
            created_at: '',
          },
        }
      : null,
    invoice: rowData.invoice_id
      ? {
        id: rowData.invoice_id,
        job_id: rowData.id,
        line_items: JSON.parse(rowData.line_items),
        subtotal: rowData.subtotal,
        total: rowData.total,
        balance: rowData.balance,
        created_at: '',
          payments,
        }
      : null,
  };

  res.json(job);
});

export const updateJobStatus = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;

  const validStatuses = ['New', 'Scheduled', 'Done', 'Invoiced', 'Paid'];
  if (!validStatuses.includes(status)) {
    throw new AppError(400, `Invalid status. Must be one of: ${validStatuses.join(', ')}`);
  }

  const job = await getOne('SELECT * FROM jobs WHERE id = ?', [id]);

  if (!job) {
    throw new AppError(404, 'Job not found');
  }

  const jobData = job as any;

  const statusOrder = ['New', 'Scheduled', 'Done', 'Invoiced', 'Paid'];
  const currentIndex = statusOrder.indexOf(jobData.status);
  const newIndex = statusOrder.indexOf(status);

  if (newIndex < currentIndex) {
    throw new AppError(400, 'Cannot move job backwards in status');
  }

  if (newIndex > currentIndex + 1) {
    throw new AppError(400, 'Cannot skip status steps. Jobs must progress linearly.');
  }

  if (status === 'Scheduled') {
    const appointment = await getOne('SELECT id FROM appointments WHERE job_id = ?', [id]);
    if (!appointment) {
      throw new AppError(400, 'Job cannot be moved to Scheduled without an appointment');
    }
  }

  if (status === 'Done') {
    const appointment = await getOne('SELECT id FROM appointments WHERE job_id = ?', [id]);
    if (!appointment) {
      throw new AppError(400, 'Job cannot be marked as Done without an appointment');
    }
  }

  if (status === 'Invoiced') {
    if (jobData.status !== 'Done') {
      throw new AppError(400, 'Job must be marked as Done before creating an invoice');
    }
    const invoice = await getOne('SELECT id FROM invoices WHERE job_id = ?', [id]);
    if (!invoice) {
      throw new AppError(400, 'Job cannot be moved to Invoiced without an invoice');
    }
  }

  if (status === 'Paid') {
    const invoice = await getOne('SELECT balance FROM invoices WHERE job_id = ?', [id]);
    if (!invoice) {
      throw new AppError(400, 'Job cannot be moved to Paid without an invoice');
    }
    if ((invoice as any).balance > 0) {
      throw new AppError(400, `Job cannot be moved to Paid with outstanding balance of ${(invoice as any).balance.toFixed(2)}`);
    }
  }

  const sql = `UPDATE jobs SET status = ?, updated_at = datetime('now') WHERE id = ?`;
  const result = await runQuery(sql, [status, id]);

  if (result.changes === 0) {
    throw new AppError(404, 'Job not found');
  }

  res.json({
    id: parseInt(id),
    status,
    updated_at: new Date().toISOString(),
  });
});
