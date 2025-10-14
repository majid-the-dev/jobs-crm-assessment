import { Database } from 'sqlite3';
import path from 'path';

const TEST_DB_PATH = path.join(__dirname, '../../../test-database.sqlite');

describe('Appointment Conflict Integration Tests', () => {
  let testDb: Database;

  beforeAll(async () => {
    testDb = new Database(TEST_DB_PATH);
    
    await new Promise<void>((resolve, reject) => {
      testDb.serialize(() => {
        testDb.run(`
          CREATE TABLE IF NOT EXISTS technicians (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            phone TEXT,
            email TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
          )
        `);

        testDb.run(`
          CREATE TABLE IF NOT EXISTS customers (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            phone TEXT,
            email TEXT,
            address TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
          )
        `);

        testDb.run(`
          CREATE TABLE IF NOT EXISTS jobs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            customer_id INTEGER NOT NULL,
            title TEXT NOT NULL,
            description TEXT,
            status TEXT DEFAULT 'New',
            is_completed BOOLEAN DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (customer_id) REFERENCES customers(id)
          )
        `);

        testDb.run(`
          CREATE TABLE IF NOT EXISTS appointments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            job_id INTEGER UNIQUE NOT NULL,
            technician_id INTEGER NOT NULL,
            start_time DATETIME NOT NULL,
            end_time DATETIME NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (job_id) REFERENCES jobs(id),
            FOREIGN KEY (technician_id) REFERENCES technicians(id)
          )
        `, (err) => {
          if (err) reject(err);
          else resolve();
        });
      });
    });
  });

  beforeEach(async () => {
    await runQueryTest('DELETE FROM appointments');
    await runQueryTest('DELETE FROM jobs');
    await runQueryTest('DELETE FROM customers');
    await runQueryTest('DELETE FROM technicians');

    await runQueryTest('INSERT INTO technicians (name, phone, email) VALUES (?, ?, ?)', 
      ['Taylor', '555-1111', 'taylor@test.com']);
    await runQueryTest('INSERT INTO technicians (name, phone, email) VALUES (?, ?, ?)', 
      ['Alex', '555-2222', 'alex@test.com']);

    await runQueryTest('INSERT INTO customers (name, phone, email) VALUES (?, ?, ?)', 
      ['Test Customer', '555-0000', 'test@customer.com']);

    await runQueryTest('INSERT INTO jobs (customer_id, title, status) VALUES (?, ?, ?)', 
      [1, 'Job 1', 'New']);
    await runQueryTest('INSERT INTO jobs (customer_id, title, status) VALUES (?, ?, ?)', 
      [1, 'Job 2', 'New']);
    await runQueryTest('INSERT INTO jobs (customer_id, title, status) VALUES (?, ?, ?)', 
      [1, 'Job 3', 'New']);
  });

  afterAll(async () => {
    await new Promise<void>((resolve) => {
      testDb.close(() => {
        resolve();
      });
    });
    
    const fs = require('fs');
    if (fs.existsSync(TEST_DB_PATH)) {
      fs.unlinkSync(TEST_DB_PATH);
    }
  });

  const runQueryTest = (sql: string, params?: any[]): Promise<any> => {
    return new Promise((resolve, reject) => {
      testDb.run(sql, params || [], function(err) {
        if (err) reject(err);
        else resolve({ lastID: this.lastID, changes: this.changes });
      });
    });
  };

  const getOneTest = <T>(sql: string, params?: any[]): Promise<T | undefined> => {
    return new Promise((resolve, reject) => {
      testDb.get(sql, params || [], (err, row) => {
        if (err) reject(err);
        else resolve(row as T | undefined);
      });
    });
  };

  const checkAppointmentConflict = async (
    technicianId: number,
    startTime: string,
    endTime: string
  ): Promise<boolean> => {
    const overlapSql = `
      SELECT a.*, t.name as technician_name
      FROM appointments a
      LEFT JOIN technicians t ON a.technician_id = t.id
      WHERE a.technician_id = ?
      AND ? < a.end_time 
      AND ? > a.start_time
    `;

    const conflict = await getOneTest<any>(overlapSql, [technicianId, startTime, endTime]);
    return !!conflict;
  };

  it('should allow first appointment for technician', async () => {
    const technicianId = 1;
    const startTime = '2025-10-14T10:00:00.000Z';
    const endTime = '2025-10-14T11:00:00.000Z';

    const hasConflict = await checkAppointmentConflict(technicianId, startTime, endTime);

    expect(hasConflict).toBe(false);
  });

  it('should detect conflict with existing appointment', async () => {
    const technicianId = 1;

    await runQueryTest(
      'INSERT INTO appointments (job_id, technician_id, start_time, end_time) VALUES (?, ?, ?, ?)',
      [1, technicianId, '2025-10-14T10:00:00.000Z', '2025-10-14T11:00:00.000Z']
    );

    const hasConflict = await checkAppointmentConflict(
      technicianId,
      '2025-10-14T10:30:00.000Z',
      '2025-10-14T11:30:00.000Z'
    );

    expect(hasConflict).toBe(true);
  });

  it('should allow non-overlapping appointments for same technician', async () => {
    const technicianId = 1;

    await runQueryTest(
      'INSERT INTO appointments (job_id, technician_id, start_time, end_time) VALUES (?, ?, ?, ?)',
      [1, technicianId, '2025-10-14T08:00:00.000Z', '2025-10-14T09:00:00.000Z']
    );

    const hasConflict = await checkAppointmentConflict(
      technicianId,
      '2025-10-14T09:00:00.000Z',
      '2025-10-14T10:00:00.000Z'
    );

    expect(hasConflict).toBe(false);

    await runQueryTest(
      'INSERT INTO appointments (job_id, technician_id, start_time, end_time) VALUES (?, ?, ?, ?)',
      [2, technicianId, '2025-10-14T09:00:00.000Z', '2025-10-14T10:00:00.000Z']
    );

    const appointments = await new Promise<any[]>((resolve, reject) => {
      testDb.all(
        'SELECT * FROM appointments WHERE technician_id = ? ORDER BY start_time',
        [technicianId],
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        }
      );
    });

    expect(appointments.length).toBe(2);
  });

  it('should allow same time slot for different technicians', async () => {
    const tech1 = 1;
    const tech2 = 2;

    await runQueryTest(
      'INSERT INTO appointments (job_id, technician_id, start_time, end_time) VALUES (?, ?, ?, ?)',
      [1, tech1, '2025-10-14T10:00:00.000Z', '2025-10-14T12:00:00.000Z']
    );

    const hasConflict = await checkAppointmentConflict(
      tech2,
      '2025-10-14T10:00:00.000Z',
      '2025-10-14T12:00:00.000Z'
    );

    expect(hasConflict).toBe(false);

    await runQueryTest(
      'INSERT INTO appointments (job_id, technician_id, start_time, end_time) VALUES (?, ?, ?, ?)',
      [2, tech2, '2025-10-14T10:00:00.000Z', '2025-10-14T12:00:00.000Z']
    );

    const tech1Appointments = await new Promise<any[]>((resolve, reject) => {
      testDb.all('SELECT * FROM appointments WHERE technician_id = ?', [tech1], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });

    const tech2Appointments = await new Promise<any[]>((resolve, reject) => {
      testDb.all('SELECT * FROM appointments WHERE technician_id = ?', [tech2], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });

    expect(tech1Appointments.length).toBe(1);
    expect(tech2Appointments.length).toBe(1);
  });

  it('should detect complex overlap scenario', async () => {
    const technicianId = 1;

    await runQueryTest(
      'INSERT INTO appointments (job_id, technician_id, start_time, end_time) VALUES (?, ?, ?, ?)',
      [1, technicianId, '2025-10-14T08:00:00.000Z', '2025-10-14T09:00:00.000Z']
    );
    await runQueryTest(
      'INSERT INTO appointments (job_id, technician_id, start_time, end_time) VALUES (?, ?, ?, ?)',
      [2, technicianId, '2025-10-14T11:00:00.000Z', '2025-10-14T13:00:00.000Z']
    );

    const testCases = [
      { start: '2025-10-14T07:00:00.000Z', end: '2025-10-14T08:00:00.000Z', shouldConflict: false },
      { start: '2025-10-14T09:00:00.000Z', end: '2025-10-14T10:00:00.000Z', shouldConflict: false },
      { start: '2025-10-14T08:30:00.000Z', end: '2025-10-14T09:30:00.000Z', shouldConflict: true },
      { start: '2025-10-14T10:30:00.000Z', end: '2025-10-14T11:30:00.000Z', shouldConflict: true },
      { start: '2025-10-14T13:00:00.000Z', end: '2025-10-14T14:00:00.000Z', shouldConflict: false },
    ];

    for (const testCase of testCases) {
      const hasConflict = await checkAppointmentConflict(
        technicianId,
        testCase.start,
        testCase.end
      );

      expect(hasConflict).toBe(testCase.shouldConflict);
    }
  });

  it('should prevent overlapping appointment from being created', async () => {
    const technicianId = 1;

    await runQueryTest(
      'INSERT INTO appointments (job_id, technician_id, start_time, end_time) VALUES (?, ?, ?, ?)',
      [1, technicianId, '2025-10-14T10:00:00.000Z', '2025-10-14T12:00:00.000Z']
    );

    const hasConflict = await checkAppointmentConflict(
      technicianId,
      '2025-10-14T11:00:00.000Z',
      '2025-10-14T13:00:00.000Z'
    );

    expect(hasConflict).toBe(true);
  });
});
