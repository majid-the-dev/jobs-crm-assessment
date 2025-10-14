import { useDrag } from "react-dnd";
import { Link } from "react-router-dom";
import type { Job, JobStatus } from "@/types";
import { User } from "lucide-react";

const ITEM_TYPE = "JOB";

interface JobCardProps {
  job: Job;
  onDrop: (job: Job, newStatus: JobStatus) => void;
}

export default function JobCard({ job }: JobCardProps) {
  const [{ isDragging }, drag] = useDrag({
    type: ITEM_TYPE,
    item: () => ({ job }),
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <div
      ref={drag as any}
      className={`block p-4 bg-white rounded-lg border border-gray-200/70 !shadow-none cursor-move ${isDragging ? "opacity-50" : ""}`}
    >
      <Link 
        to={`/jobs/${job.id}`} 
        className="text-sm font-semibold text-gray-900 hover:text-blue-600 transition-colors block mb-2"
      >
        {job.title}
      </Link>
      <p className="text-xs text-gray-600 line-clamp-2 mb-4">{job.description}</p>
      <Link 
        to={`/customers/${job.customer.id}`}
        className="flex items-center gap-2 hover:bg-gray-50 -mx-2 px-2 rounded transition-colors"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-center size-5 rounded-full bg-gray-200/70">
          <User size={12} className="text-gray-600" />
        </div>
        <p className="text-xs text-gray-600 font-medium hover:text-gray-900">{job.customer.name}</p>
      </Link>
    </div>
  );
}

export { ITEM_TYPE };
