import { Request, Response } from 'express';
import { getAll, getOne, runQuery } from '../config/database';
import { AppError, asyncHandler } from '../middleware/errorHandler';

export const createTechnician = asyncHandler(
  async (req: Request, res: Response) => {
    const { name, phone, email } = req.body;

    if (!name) {
      throw new AppError(400, 'Name is required');
    }

    const sql = `INSERT INTO technicians (name, phone, email) VALUES (?, ?, ?)`;
    const result = await runQuery(sql, [name, phone || null, email || null]);

    res.status(201).json({
      id: result.lastID,
      name,
      phone: phone || null,
      email: email || null,
      created_at: new Date().toISOString(),
    });
  }
);

export const getTechnicianById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const technician = await getOne('SELECT * FROM technicians WHERE id = ?', [id]);

  if (!technician) {
    throw new AppError(404, 'Technician not found');
  }

  const appointments = await getAll(
    `SELECT 
      a.*,
      j.title as job_title,
      j.status as job_status,
      c.name as customer_name
    FROM appointments a
    LEFT JOIN jobs j ON a.job_id = j.id
    LEFT JOIN customers c ON j.customer_id = c.id
    WHERE a.technician_id = ?
    ORDER BY a.start_time DESC`,
    [id]
  );

  res.json({
    ...technician,
    appointments,
  });
});

export const getTechnicians = asyncHandler(async (_req: Request, res: Response) => {
  const technicians = await getAll(
    'SELECT * FROM technicians ORDER BY name ASC'
  );
  res.json(technicians);
});
