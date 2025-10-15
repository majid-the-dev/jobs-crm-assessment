import { db, initializeDatabase, runQuery } from '../config/database';

console.log('Seeding database..');

async function seed() {
  try {

    await initializeDatabase();


    console.log('Clearing existing data...');
    await runQuery('DELETE FROM payments');
    await runQuery('DELETE FROM invoices');
    await runQuery('DELETE FROM appointments');
    await runQuery('DELETE FROM jobs');
    await runQuery('DELETE FROM customers');
    await runQuery('DELETE FROM technicians');
    
    await runQuery('DELETE FROM sqlite_sequence WHERE name IN ("customers", "technicians", "jobs", "appointments", "invoices", "payments")');


    console.log('Creating customers...');
    const customer1 = await runQuery(
      'INSERT INTO customers (name, phone, email, address) VALUES (?, ?, ?, ?)',
      ['John Smith', '555-123-4567', 'john.smith@email.com', '123 Main St, Springfield, IL']
    );
    const customer2 = await runQuery(
      'INSERT INTO customers (name, phone, email, address) VALUES (?, ?, ?, ?)',
      ['Jane Doe', '555-234-5678', 'jane.doe@email.com', '456 Oak Ave, Riverside, CA']
    );
    const customer3 = await runQuery(
      'INSERT INTO customers (name, phone, email, address) VALUES (?, ?, ?, ?)',
      ['Bob Wilson', '555-345-6789', 'bob.wilson@email.com', '789 Pine Rd, Denver, CO']
    );


    console.log('Creating technician...');
    const technician = await runQuery(
      'INSERT INTO technicians (name, phone, email) VALUES (?, ?, ?)',
      ['Taylor', '555-111-2222', 'taylor@company.com']
    );


    console.log('Creating jobs...');
    const job1 = await runQuery(
      'INSERT INTO jobs (customer_id, title, description, status) VALUES (?, ?, ?, ?)',
      [customer1.lastID, 'Fix AC Unit', 'AC not cooling properly, needs inspection and repair', 'New']
    );
    const job2 = await runQuery(
      'INSERT INTO jobs (customer_id, title, description, status) VALUES (?, ?, ?, ?)',
      [customer2.lastID, 'Install Thermostat', 'Install new smart thermostat in living room', 'New']
    );
    const job3 = await runQuery(
      'INSERT INTO jobs (customer_id, title, description, status) VALUES (?, ?, ?, ?)',
      [customer3.lastID, 'Repair Heater', 'Heater making strange noises, urgent repair needed', 'Scheduled']
    );


    console.log('Creating appointment...');
    const today = new Date();
    
    const startTime = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 10, 0, 0);
    const endTime = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 12, 0, 0);
    await runQuery(
      'INSERT INTO appointments (job_id, technician_id, start_time, end_time) VALUES (?, ?, ?, ?)',
      [job3.lastID, technician.lastID, startTime.toISOString(), endTime.toISOString()]
    );

    console.log('Appointment created');

    console.log('Database seeded successfully!\n');
    console.log('Summary:');
    console.log('  - Customers: 3');
    console.log('  - Technician: 1 (Taylor)');
    console.log('  - Jobs: 3 (2 New, 1 Scheduled)');
    console.log('  - Appointment: 1 (Taylor, 10:00-12:00 today)');
    console.log('\nYou can now start the server with: npm run dev\n');

    db.close();
  } catch (error) {
    console.error('Error seeding database:', error);
    db.close();
    process.exit(1);
  }
}

seed();
