import { Link } from "react-router-dom";
import type { JobDetail } from "@/types";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Circle } from "lucide-react";

interface DetailsTabProps {
  job: JobDetail;
  onMarkAsDone: () => void;
  isUpdating: boolean;
}

export default function DetailsTab({ job, onMarkAsDone, isUpdating }: DetailsTabProps) {
  const isStatusCompleted = (status: string) => {
    const statuses = ["New", "Scheduled", "Done", "Invoiced", "Paid"];
    const currentIndex = statuses.indexOf(job.status);
    const targetIndex = statuses.indexOf(status);
    return targetIndex <= currentIndex;
  };

  return (
    <div className="p-8 space-y-8">
      {}
      <div>
        <h3 className="text-sm font-semibold mb-4">Job Information</h3>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <Label className="text-gray-500 mb-1 block">Job ID:</Label>
            <p className="text-gray-900 font-medium text-sm">#{job.id}</p>
          </div>
          <div>
            <Label className="text-gray-500 mb-1 block">Title:</Label>
            <p className="text-gray-900 font-medium text-sm">{job.title}</p>
          </div>
          <div className="col-span-2">
            <Label className="text-gray-500 mb-1 block">Description:</Label>
            <p className="text-gray-900 text-sm">{job.description || "No description"}</p>
          </div>
          <div>
            <Label className="text-gray-500 mb-1 block">Status:</Label>
            <p className="text-gray-900 font-medium text-sm">{job.status}</p>
          </div>
        </div>
      </div>

      {}
      <div>
        <h3 className="text-sm font-semibold mb-4">Customer Information</h3>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <Label className="text-gray-500 mb-1 block">Name:</Label>
            <Link
              to={`/customers/${job.customer.id}`}
              className="text-blue-600 hover:underline font-medium text-sm underline-offset-2"
            >
              {job.customer.name}
            </Link>
          </div>
          <div>
            <Label className="text-gray-500 mb-1 block">Phone:</Label>
            <p className="text-gray-900 text-sm">{job.customer.phone || "N/A"}</p>
          </div>
          <div>
            <Label className="text-gray-500 mb-1 block">Email:</Label>
            <p className="text-gray-900 text-sm">{job.customer.email || "N/A"}</p>
          </div>
          <div>
            <Label className="text-gray-500 mb-1 block">Address:</Label>
            <p className="text-gray-900 text-sm">{job.customer.address || "N/A"}</p>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold mb-4">Status Timeline</h3>
        <div className="relative pl-8 space-y-6">
          {}
          <div className="absolute left-2 top-2 bottom-2 w-0.5 bg-gray-200" />

          {}
          {[
            { status: "New", label: "Job created" },
            {
              status: "Scheduled",
              label: job.appointment ? "Appointment created" : "",
            },
            {
              status: "Done",
              label: job.status === "Done" || job.status === "Invoiced" || job.status === "Paid" ? "Job completed" : "",
            },
            {
              status: "Invoiced",
              label: job.invoice ? "Invoice generated" : "",
            },
            {
              status: "Paid",
              label: job.status === "Paid" ? "Payment received" : "",
            },
          ].map((item, index) => (
            <div
              key={index}
              className={`relative ${isStatusCompleted(item.status) ? "opacity-100" : "opacity-40"}`}
            >
              <div className="absolute -left-8 flex items-center justify-center">
                {isStatusCompleted(item.status) ? (
                  <CheckCircle2 className="w-4 h-4 text-green-500 fill-green-500" />
                ) : (
                  <Circle className="w-4 h-4 text-gray-300" />
                )}
              </div>
              <div>
                <p className="font-semibold text-gray-900">{item.status}</p>
                {item.label && <p className="text-sm text-gray-600">{item.label}</p>}
              </div>
            </div>
          ))}
        </div>
      </div>

      {}
      {job.status === "Scheduled" && job.appointment && (
        <div>
          <h3 className="text-sm font-semibold mb-4">Actions</h3>
          <Button onClick={onMarkAsDone} disabled={isUpdating} className="bg-green-600 hover:bg-green-700">
            {isUpdating ? "Updating..." : "Mark as Done"}
          </Button>
        </div>
      )}
    </div>
  );
}
