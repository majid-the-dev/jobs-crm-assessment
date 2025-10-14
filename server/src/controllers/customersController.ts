import { Request, Response } from 'express';
import { getAll, getOne, runQuery } from '../config/database';
import { AppError, asyncHandler } from '../middleware/errorHandler';

export const createCustomer = asyncHandler(async (req: Request, res: Response) => {
  const { name, phone, email, address } = req.body;

  if (!name) {
    throw new AppError(400, 'Name is required');
  }

  const sql = `INSERT INTO customers (name, phone, email, address) VALUES (?, ?, ?, ?)`;
  const result = await runQuery(sql, [name, phone || null, email || null, address || null]);

  res.status(201).json({
    id: result.lastID,
    name,
    phone: phone || null,
    email: email || null,
    address: address || null,
    created_at: new Date().toISOString(),
  });
});

export const getCustomerById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const customer = await getOne('SELECT * FROM customers WHERE id = ?', [id]);

  if (!customer) {
    throw new AppError(404, 'Customer not found');
  }

  const jobs = await getAll('SELECT * FROM jobs WHERE customer_id = ? ORDER BY created_at DESC', [id]);

  res.json({ ...customer, jobs });
});

export const getCustomers = asyncHandler(async (_req: Request, res: Response) => {
  const customers = await getAll('SELECT * FROM customers ORDER BY created_at DESC');
  res.json(customers);
});
