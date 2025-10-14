
export type JobStatus = 'New' | 'Scheduled' | 'Done' | 'Invoiced' | 'Paid';

export interface Customer {
  id: number;
  name: string;
  phone: string | null;
  email: string | null;
  address: string | null;
  created_at: string;
}

export interface Technician {
  id: number;
  name: string;
  phone: string | null;
  email: string | null;
  created_at: string;
}

export interface Job {
  id: number;
  customer_id: number;
  title: string;
  description: string | null;
  status: JobStatus;
  created_at: string;
  updated_at: string;
  customer: Customer;
  invoice?: { balance: number } | null;
}

export interface Appointment {
  id: number;
  job_id: number;
  technician_id: number;
  start_time: string;
  end_time: string;
  created_at: string;
  technician: Technician;
}

export interface InvoiceLineItem {
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

export interface Invoice {
  id: number;
  job_id: number;
  line_items: InvoiceLineItem[];
  subtotal: number;
  total: number;
  balance: number;
  created_at: string;
}

export interface Payment {
  id: number;
  invoice_id: number;
  amount: number;
  payment_date: string;
  created_at: string;
}

export interface JobDetail extends Job {
  customer: Customer;
  appointment: Appointment | null;
  invoice: (Invoice & { payments: Payment[] }) | null;
}


export interface CreateCustomerDto {
  name: string;
  phone?: string;
  email?: string;
  address?: string;
}

export interface CreateTechnicianDto {
  name: string;
  phone?: string;
  email?: string;
}

export interface CreateJobDto {
  customer_id: number;
  title: string;
  description?: string;
}

export interface CreateAppointmentDto {
  technician_id: number;
  start_time: string;
  end_time: string;
}

export interface CreateInvoiceDto {
  line_items: Omit<InvoiceLineItem, 'amount'>[];
}

export interface CreatePaymentDto {
  amount: number;
}
