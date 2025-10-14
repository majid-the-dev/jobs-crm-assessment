import type {
  Customer,
  Technician,
  Job,
  JobDetail,
  JobStatus,
  CreateCustomerDto,
  CreateTechnicianDto,
  CreateJobDto,
  CreateAppointmentDto,
  CreateInvoiceDto,
  CreatePaymentDto,
} from '@/types';

const API_BASE = '/api';

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Request failed');
  }

  return data;
}

export const customersAPI = {
  getAll: () => request<Customer[]>('/customers'),
  getById: (id: number) => request<Customer>(`/customers/${id}`),
  create: (data: CreateCustomerDto) =>
    request<Customer>('/customers', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

export const techniciansAPI = {
  getAll: () => request<Technician[]>('/technicians'),
  getById: (id: number) => request<Technician & { appointments: any[] }>(`/technicians/${id}`),
  create: (data: CreateTechnicianDto) =>
    request<Technician>('/technicians', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

export const jobsAPI = {
  getAll: (status?: JobStatus) => {
    const query = status ? `?status=${status}` : '';
    return request<Job[]>(`/jobs${query}`);
  },
  getById: (id: number) => request<JobDetail>(`/jobs/${id}`),
  create: (data: CreateJobDto) =>
    request<Job>('/jobs', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateStatus: (id: number, status: JobStatus) =>
    request(`/jobs/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),
};

export const appointmentsAPI = {
  create: (jobId: number, data: CreateAppointmentDto) =>
    request(`/jobs/${jobId}/appointments`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

export const invoicesAPI = {
  create: (jobId: number, data: CreateInvoiceDto) =>
    request(`/jobs/${jobId}/invoice`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

export const paymentsAPI = {
  create: (invoiceId: number, data: CreatePaymentDto) =>
    request(`/invoices/${invoiceId}/payments`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

