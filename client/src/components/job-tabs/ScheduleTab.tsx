import { useState } from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import type { JobDetail } from "@/types";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import AppointmentForm from "@/components/forms/AppointmentForm";

interface ScheduleTabProps {
  job: JobDetail;
  onCreateAppointment: (data: any) => void;
  isCreating: boolean;
}

export default function ScheduleTab({
  job,
  onCreateAppointment,
  isCreating,
}: ScheduleTabProps) {
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = (data: any) => {
    onCreateAppointment(data);
    setShowForm(false);
  };

  return (
    <div className="p-8">
      {job.appointment ? (
        <div>
          <h3 className="text-sm font-semibold mb-4">Appointment Details</h3>
          <div className="grid grid-cols-3 gap-6 bg-gray-50 p-6 rounded-lg">
            <div>
              <Label className="text-gray-500 mb-2 block">Technician:</Label>
              <Link
                to={`/technicians/${job.appointment.technician.id}`}
                className="text-blue-600 hover:underline font-medium text-sm underline-offset-2"
              >
                {job.appointment.technician.name}
              </Link>
            </div>
            <div>
              <Label className="text-gray-500 mb-2 block">Start Time:</Label>
              <p className="text-gray-900 text-sm font-medium">
                {moment(job.appointment.start_time).format('MMM DD, YYYY • h:mm A')}
              </p>
            </div>
            <div>
              <Label className="text-gray-500 mb-2 block">End Time:</Label>
              <p className="text-gray-900 text-sm font-medium">
                {moment(job.appointment.end_time).format('MMM DD, YYYY • h:mm A')}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div>
          {!showForm ? (
            <div>
              <p className="text-gray-600 mb-4 text-sm">No appointment scheduled</p>
              <Button onClick={() => setShowForm(true)} className="text-sm h-fit w-fit rounded-lg">Add Schedule</Button>
            </div>
          ) : (
            <AppointmentForm
              onSubmit={handleSubmit}
              onCancel={() => setShowForm(false)}
              isSubmitting={isCreating}
            />
          )}
        </div>
      )}
    </div>
  );
}

