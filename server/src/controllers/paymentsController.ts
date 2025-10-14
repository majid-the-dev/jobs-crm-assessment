import { Request, Response } from 'express';
import { getOne, runQuery } from '../config/database';
import { AppError, asyncHandler } from '../middleware/errorHandler';

export const createPayment = asyncHandler(
  async (req: Request, res: Response) => {
    const invoiceId = req.params.id;
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      throw new AppError(400, 'amount is required and must be greater than 0');
    }

    const invoice = await getOne(
      'SELECT balance, job_id FROM invoices WHERE id = ?',
      [invoiceId]
    );

    if (!invoice) {
      throw new AppError(404, 'Invoice not found');
    }

    const invoiceData = invoice as any;

    if (amount > invoiceData.balance) {
      throw new AppError(
        400,
        `Payment amount (${amount}) exceeds remaining balance (${invoiceData.balance})`
      );
    }

    const insertSql = `INSERT INTO payments (invoice_id, amount) VALUES (?, ?)`;
    const result = await runQuery(insertSql, [invoiceId, amount]);

    const newBalance = parseFloat((invoiceData.balance - amount).toFixed(2));

    await runQuery('UPDATE invoices SET balance = ? WHERE id = ?', [newBalance, invoiceId]);

    if (newBalance === 0) {
      await runQuery(
        `UPDATE jobs SET status = 'Paid', updated_at = datetime('now') WHERE id = ?`,
        [invoiceData.job_id]
      );
    }

    res.status(201).json({
      id: result.lastID,
      invoice_id: parseInt(invoiceId),
      amount,
      payment_date: new Date().toISOString(),
      remaining_balance: newBalance,
    });
  }
);
