import { useDrop } from "react-dnd";
import type { Job, JobStatus } from "@/types";
import JobCard, { ITEM_TYPE } from "./JobCard";

interface ColumnProps {
  status: JobStatus;
  label: string;
  color: string;
  jobs: Job[];
  onDrop: (job: Job, newStatus: JobStatus) => void;
}

export default function Column({ status, label, color, jobs, onDrop }: ColumnProps) {
  const [{ isOver }, drop] = useDrop({
    accept: ITEM_TYPE,
    drop: (item: { job: Job }) => {
      if (item.job.status !== status) {
        onDrop(item.job, status);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  return (
    <div
      ref={drop as any}
      className={`flex-1 min-w-[280px] flex flex-col transition-colors ${
        isOver ? "bg-blue-50 rounded-lg" : ""
      }`}
    >
      <div className="rounded-lg border border-gray-200/70 p-4 flex flex-col h-full">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${color}`}></div>
            <h2 className="font-medium text-sm">{label}</h2>
          </div>
          <span className="text-sm bg-gray-100 px-2 py-1 rounded">
            {jobs.length}
          </span>
        </div>
        <div className="space-y-3 overflow-y-auto flex-1 pr-1">
          {jobs.map((job) => (
            <JobCard key={job.id} job={job} onDrop={onDrop} />
          ))}
          {jobs.length === 0 && (
            <p className="text-sm text-gray-500 text-center py-8">No jobs</p>
          )}
        </div>
      </div>
    </div>
  );
}

