import { Request, Response } from 'express';
import { getOne, runQuery } from '../config/database';
import { AppError, asyncHandler } from '../middleware/errorHandler';

export const createInvoice = asyncHandler(
  async (req: Request, res: Response) => {
    const jobId = req.params.id;
    const { line_items } = req.body;

    if (!line_items || !Array.isArray(line_items) || line_items.length === 0) {
      throw new AppError(400, 'line_items is required and must be a non-empty array');
    }

    for (const item of line_items) {
      if (!item.description || item.quantity === undefined || item.rate === undefined) {
        throw new AppError(400, 'Each line item must have description, quantity, and rate');
      }
    }

    const job = await getOne('SELECT status FROM jobs WHERE id = ?', [jobId]);

    if (!job) {
      throw new AppError(404, 'Job not found');
    }

    if ((job as any).status !== 'Done') {
      throw new AppError(400, 'Job must be marked as Done before creating an invoice');
    }

    const itemsWithAmounts = line_items.map((item: any) => ({
      ...item,
      amount: parseFloat((item.quantity * item.rate).toFixed(2)),
    }));

    const subtotal = parseFloat(
      itemsWithAmounts.reduce((sum, item) => sum + item.amount, 0).toFixed(2)
    );
    const tax = 0;
    const total = subtotal;
    const balance = total;

    try {
      const insertSql = `
        INSERT INTO invoices (job_id, line_items, subtotal, tax, total, balance)
        VALUES (?, ?, ?, ?, ?, ?)
      `;
      const result = await runQuery(insertSql, [
        jobId,
        JSON.stringify(itemsWithAmounts),
        subtotal,
        tax,
        total,
        balance,
      ]);

      await runQuery(
        `UPDATE jobs SET status = 'Invoiced', updated_at = datetime('now') WHERE id = ?`,
        [jobId]
      );

      res.status(201).json({
        id: result.lastID,
        job_id: parseInt(jobId),
        line_items: itemsWithAmounts,
        subtotal,
        total,
        balance,
        created_at: new Date().toISOString(),
      });
    } catch (error: any) {
      if (error.message.includes('UNIQUE constraint failed')) {
        throw new AppError(400, 'This job already has an invoice');
      }
      throw error;
    }
  }
);
