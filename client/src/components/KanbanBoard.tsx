import { useState } from "react";
import { toast } from "sonner";
import { useJobs, useUpdateJobStatus } from "@/hooks/useJobs";
import type { Job, JobStatus } from "@/types";
import ScheduleModal from "@/components/modals/ScheduleModal";
import CompleteModal from "@/components/modals/CompleteModal";
import InvoiceModal from "@/components/modals/InvoiceModal";
import PaymentModal from "@/components/modals/PaymentModal";
import Column from "@/components/kanban/Column";

const statusColumns: { status: JobStatus; label: string; color: string }[] = [
  { status: "New", label: "New", color: "bg-blue-400 border-blue-300" },
  {
    status: "Scheduled",
    label: "Scheduled",
    color: "bg-yellow-400 border-yellow-300",
  },
  {
    status: "Done",
    label: "Done",
    color: "bg-orange-400 border-orange-300",
  },
  {
    status: "Invoiced",
    label: "Invoiced",
    color: "bg-purple-400 border-purple-300",
  },
  { status: "Paid", label: "Paid", color: "bg-green-400 border-green-300" },
];

export default function KanbanBoard() {
  const [modalState, setModalState] = useState<{
    type: "schedule" | "complete" | "invoice" | "payment" | null;
    job: Job | null;
  }>({ type: null, job: null });

  const { data: jobs = [], isLoading } = useJobs();
  const updateStatusMutation = useUpdateJobStatus();

  const handleDrop = (job: Job, newStatus: JobStatus) => {
    const statusOrder: JobStatus[] = ["New", "Scheduled", "Done", "Invoiced", "Paid"];
    const currentIndex = statusOrder.indexOf(job.status);
    const newIndex = statusOrder.indexOf(newStatus);

    if (newIndex !== currentIndex + 1 && newIndex !== currentIndex) {
      toast.error("Jobs must progress linearly through each status. You cannot skip steps.");
      return;
    }

    if (newIndex === currentIndex) {
      return;
    }

    if (job.status === "New" && newStatus === "Scheduled") {
      setModalState({ type: "schedule", job });
      return;
    }

    if (job.status === "Scheduled" && newStatus === "Done") {
      setModalState({ type: "complete", job });
      return;
    }

    if (job.status === "Done" && newStatus === "Invoiced") {
      setModalState({ type: "invoice", job });
      return;
    }

    if (job.status === "Invoiced" && newStatus === "Paid") {
      if (!job.invoice || job.invoice.balance === undefined) {
        toast.error("Job must have an invoice before recording payments.");
        return;
      }
      if (job.invoice.balance <= 0) {
        updateStatusMutation.mutate({ jobId: job.id, status: newStatus });
        return;
      }
      setModalState({ type: "payment", job });
      return;
    }

    updateStatusMutation.mutate({ jobId: job.id, status: newStatus });
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading jobs...</div>;
  }

  const jobsByStatus = statusColumns.reduce((acc, { status }) => {
    acc[status] = jobs.filter((job) => job.status === status);
    return acc;
  }, {} as Record<JobStatus, Job[]>);

  return (
    <div className="flex flex-col h-[calc(100vh-120px)]">
      <div className="mb-6">
        <h2 className="text-gray-800 text-2xl font-medium">Board</h2>
        <p className="text-gray-500 text-sm mt-1">
          Track and manage customer jobs here
        </p>
      </div>

      <div className="bg-white border border-gray-200/70 rounded-xl p-4 shadow-xs flex flex-col flex-1 min-h-0">
        <div className="flex gap-4 overflow-x-auto flex-1 min-h-0">
          {statusColumns.map((column) => (
            <Column
              key={column.status}
              {...column}
              jobs={jobsByStatus[column.status]}
              onDrop={handleDrop}
            />
          ))}
        </div>
      </div>

      {modalState.job && (
        <>
          <ScheduleModal
            open={modalState.type === "schedule"}
            job={modalState.job}
            onClose={() => setModalState({ type: null, job: null })}
          />
          <CompleteModal
            open={modalState.type === "complete"}
            job={modalState.job}
            onClose={() => setModalState({ type: null, job: null })}
          />
          <InvoiceModal
            open={modalState.type === "invoice"}
            job={modalState.job}
            onClose={() => setModalState({ type: null, job: null })}
          />
          <PaymentModal
            open={modalState.type === "payment"}
            job={modalState.job}
            onClose={() => setModalState({ type: null, job: null })}
          />
        </>
      )}
    </div>
  );
}
