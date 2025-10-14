import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useJob, useUpdateJobStatus } from "@/hooks/useJobs";
import { useCreateAppointment } from "@/hooks/useAppointments";
import { useCreateInvoice } from "@/hooks/useInvoices";
import { useCreatePayment } from "@/hooks/usePayments";
import { Card } from "@/components/ui/card";
import DetailsTab from "@/components/job-tabs/DetailsTab";
import ScheduleTab from "@/components/job-tabs/ScheduleTab";
import InvoiceTab from "@/components/job-tabs/InvoiceTab";

export default function JobDetail() {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState("details");

  const jobId = Number(id);
  const { data: job, isLoading } = useJob(jobId);
  const updateStatusMutation = useUpdateJobStatus();
  const createAppointmentMutation = useCreateAppointment(jobId);
  const createInvoiceMutation = useCreateInvoice(jobId);
  const createPaymentMutation = useCreatePayment(
    job?.invoice?.id || 0,
    jobId
  );

  if (isLoading) return <div className="text-center py-8">Loading job...</div>;
  if (!job) return <div className="text-center py-8">Job not found</div>;

  return (
    <div className="max-w-5xl mx-auto">
      <Link to="/" className="text-blue-600 text-sm hover:underline mb-4 inline-block underline-offset-2">
        Back to Board
      </Link>

      <Card className="overflow-hidden">
        <div className="flex items-center justify-between p-8 border-b">
          <h2 className="text-xl font-bold text-gray-900">{job.title}</h2>
          <span
            className={`inline-block px-4 py-1.5 rounded-lg text-sm font-semibold ${
              job.status === "Paid"
                ? "bg-green-100 text-green-800"
                : job.status === "Invoiced"
                ? "bg-purple-100 text-purple-800"
                : job.status === "Done"
                ? "bg-orange-100 text-orange-800"
                : job.status === "Scheduled"
                ? "bg-yellow-100 text-yellow-800"
                : "bg-blue-100 text-blue-800"
            }`}
          >
            {job.status}
          </span>
        </div>

        <div className="flex border-b bg-gray-50">
          <button
            className={`px-6 py-3 text-sm font-medium transition-all ${
              activeTab === "details"
                ? "bg-white text-blue-600 border-b-2 border-blue-600"
                : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            }`}
            onClick={() => setActiveTab("details")}
          >
            Details
          </button>
          <button
            className={`px-6 py-3 text-sm font-medium transition-all ${
              activeTab === "schedule"
                ? "bg-white text-blue-600 border-b-2 border-blue-600"
                : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            }`}
            onClick={() => setActiveTab("schedule")}
          >
            Schedule
          </button>
          <button
            className={`px-6 py-3 text-sm font-medium transition-all ${
              activeTab === "invoice"
                ? "bg-white text-blue-600 border-b-2 border-blue-600"
                : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            }`}
            onClick={() => setActiveTab("invoice")}
          >
            Invoice
          </button>
        </div>

        {activeTab === "details" && (
          <DetailsTab
            job={job}
            onMarkAsDone={() => updateStatusMutation.mutate({ jobId, status: 'Done' })}
            isUpdating={updateStatusMutation.isPending}
          />
        )}

        {activeTab === "schedule" && (
          <ScheduleTab
            job={job}
            onCreateAppointment={(data) => createAppointmentMutation.mutate(data)}
            isCreating={createAppointmentMutation.isPending}
          />
        )}

        {activeTab === "invoice" && (
          <InvoiceTab
            job={job}
            onCreateInvoice={(data) => createInvoiceMutation.mutate(data)}
            onCreatePayment={(amount) => createPaymentMutation.mutate({ amount })}
            isCreatingInvoice={createInvoiceMutation.isPending}
            isCreatingPayment={createPaymentMutation.isPending}
          />
        )}
      </Card>
    </div>
  );
}
