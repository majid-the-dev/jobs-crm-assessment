import { Link, useParams } from "react-router-dom";
import moment from "moment";
import { useTechnician } from "@/hooks/useTechnicians";
import { Calendar, Clock } from "lucide-react";

export default function TechnicianDetail() {
  const { id } = useParams<{ id: string }>();

  const { data: technician, isLoading } = useTechnician(Number(id));

  if (isLoading) return <div className="text-center py-8">Loading technician...</div>;
  if (!technician) return <div className="text-center py-8">Technician not found</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <Link to="/technicians" className="text-blue-600 text-sm hover:underline mb-4 inline-block underline-offset-2">
        Back to Technicians
      </Link>

      <div className="bg-white rounded-lg shadow p-6 space-y-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">{technician.name}</h1>
          <div className="grid grid-cols-2 gap-6 mt-5">
            <div>
              <p className="text-sm text-gray-500 mb-1">Email</p>
              <p className="font-medium text-sm">{technician.email || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Phone</p>
              <p className="font-medium text-sm">{technician.phone || "N/A"}</p>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-4">
            Appointments ({(technician as any).appointments?.length || 0})
          </h2>

          {(technician as any).appointments && (technician as any).appointments.length > 0 ? (
            <div className="space-y-3">
              {(technician as any).appointments.map((appointment: any) => (
                <Link
                  key={appointment.id}
                  to={`/jobs/${appointment.job_id}`}
                  className="block p-4 border border-gray-200 rounded-lg hover:border-blue-500 transition-colors duration-200"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900 text-sm">
                      {appointment.job_title}
                    </h3>
                    <span
                      className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                        appointment.job_status === "Paid"
                          ? "bg-green-100 text-green-800"
                          : appointment.job_status === "Invoiced"
                          ? "bg-purple-100 text-purple-800"
                          : appointment.job_status === "Scheduled"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {appointment.job_status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    Customer: {appointment.customer_name}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar size={12} />
                      <span>{moment(appointment.start_time).format('MMM DD, YYYY')}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock size={12} />
                      <span>
                        {moment(appointment.start_time).format('h:mm A')} -{' '}
                        {moment(appointment.end_time).format('h:mm A')}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No appointments scheduled</p>
          )}
        </div>
      </div>
    </div>
  );
}
