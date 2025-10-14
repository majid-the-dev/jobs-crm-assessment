import { Link, useParams } from "react-router-dom";
import moment from "moment";
import { useCustomer } from "@/hooks/useCustomers";

export default function CustomerDetail() {
  const { id } = useParams<{ id: string }>();

  const { data: customer, isLoading } = useCustomer(Number(id));

  if (isLoading) return <div className="text-center py-8">Loading customer...</div>;
  if (!customer) return <div className="text-center py-8">Customer not found</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <Link to="/customers" className="text-blue-600 text-sm hover:underline mb-4 inline-block underline-offset-2">
        Back to Customers
      </Link>

      <div className="bg-white rounded-lg shadow p-6 space-y-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">{customer.name}</h1>
          <div className="grid grid-cols-2 gap-6 mt-5">
            <div>
              <p className="text-sm text-gray-500 mb-1">Email</p>
              <p className="font-medium text-sm">{customer.email || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Phone</p>
              <p className="font-medium text-sm">{customer.phone || "N/A"}</p>
            </div>
            <div className="col-span-2">
              <p className="text-sm text-gray-500 mb-1">Address</p>
              <p className="font-medium text-sm">{customer.address || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Created</p>
              <p className="font-medium text-sm">{moment(customer.created_at).format('MMM DD, YYYY')}</p>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-4">
            Jobs ({(customer as any).jobs?.length || 0})
          </h2>

          {(customer as any).jobs && (customer as any).jobs.length > 0 ? (
            <div className="space-y-3">
              {(customer as any).jobs.map((job: any) => (
                <Link
                  key={job.id}
                  to={`/jobs/${job.id}`}
                  className="block p-4 border border-gray-200 rounded-lg hover:border-blue-500 transition-colors duration-200"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900 text-sm">
                      {job.title}
                    </h3>
                    <span
                      className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                        job.status === "Paid"
                          ? "bg-green-100 text-green-800"
                          : job.status === "Invoiced"
                          ? "bg-purple-100 text-purple-800"
                          : job.status === "Scheduled"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {job.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{job.description}</p>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No jobs for this customer</p>
          )}
        </div>
      </div>
    </div>
  );
}
