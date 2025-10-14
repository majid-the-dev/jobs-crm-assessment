import { Request, Response } from 'express';
import { getOne, runQuery } from '../config/database';
import { AppError, asyncHandler } from '../middleware/errorHandler';

export const createAppointment = asyncHandler(
  async (req: Request, res: Response) => {
    const jobId = req.params.id;
    const { technician_id, start_time, end_time } = req.body;

    if (!technician_id || !start_time || !end_time) {
      throw new AppError(400, 'technician_id, start_time, and end_time are required');
    }

    const startDate = new Date(start_time);
    const endDate = new Date(end_time);

    if (startDate >= endDate) {
      throw new AppError(400, 'start_time must be before end_time');
    }

    const overlapSql = `
      SELECT a.*, t.name as technician_name, j.title as job_title
      FROM appointments a
      LEFT JOIN technicians t ON a.technician_id = t.id
      LEFT JOIN jobs j ON a.job_id = j.id
      WHERE a.technician_id = ?
      AND ? < a.end_time 
      AND ? > a.start_time
    `;

    const existingAppointment = await getOne<any>(overlapSql, [
      technician_id,
      start_time,
      end_time,
    ]);

    if (existingAppointment) {
      const formatTime = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleString('en-US', { 
          month: 'short', 
          day: 'numeric', 
          hour: 'numeric', 
          minute: '2-digit',
          hour12: true 
        });
      };

      throw new AppError(
        409,
        `Schedule conflict: ${existingAppointment.technician_name} is already booked for "${existingAppointment.job_title}" from ${formatTime(existingAppointment.start_time)} to ${formatTime(existingAppointment.end_time)}`
      );
    }

    try {
      const insertSql = `
        INSERT INTO appointments (job_id, technician_id, start_time, end_time)
        VALUES (?, ?, ?, ?)
      `;
      const result = await runQuery(insertSql, [jobId, technician_id, start_time, end_time]);

      await runQuery(
        `UPDATE jobs SET status = 'Scheduled', updated_at = datetime('now') WHERE id = ?`,
        [jobId]
      );

      res.status(201).json({
        id: result.lastID,
        job_id: parseInt(jobId),
        technician_id,
        start_time,
        end_time,
        created_at: new Date().toISOString(),
      });
    } catch (error: any) {
      if (error.message.includes('UNIQUE constraint failed')) {
        throw new AppError(400, 'This job already has an appointment');
      }
      throw error;
    }
  }
);
