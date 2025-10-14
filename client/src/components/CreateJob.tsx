import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCustomers, useCreateCustomer } from "@/hooks/useCustomers";
import { useCreateJob } from "@/hooks/useJobs";
import type { Customer } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import CreateCustomerForm from "@/components/forms/CreateCustomerForm";
import CreateJobForm from "@/components/forms/CreateJobForm";

export default function CreateJob() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [showNewCustomerForm, setShowNewCustomerForm] = useState(false);

  const { data: customers = [] } = useCustomers();
  const createCustomerMutation = useCreateCustomer();
  const createJobMutation = useCreateJob();

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.phone?.includes(searchTerm)
  );

  const handleCustomerCreated = (customer: Customer) => {
    setSelectedCustomer(customer);
    setShowNewCustomerForm(false);
  };

  const handleJobCreated = (jobData: any) => {
    createJobMutation.mutate(
      { ...jobData, customer_id: selectedCustomer!.id },
      {
        onSuccess: (job) => {
          navigate(`/jobs/${job.id}`);
        },
      }
    );
  };

  return (
    <div className="max-w-3xl mx-auto">
      <Link to="/" className="text-blue-600 text-sm hover:underline mb-4 inline-block underline-offset-2">
        Back to Board
      </Link>

      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-xl font-bold mb-6">Create New Job</h1>

        {!selectedCustomer ? (
          <div className="space-y-6">
            <div>
              <h2 className="text-sm font-semibold mb-4">Select Customer</h2>

              {!showNewCustomerForm ? (
                <div className="space-y-4">
                  <Input
                    placeholder="Search customers by name, email, or phone..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="text-sm ring-0 outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-blue-600 transition-colors duration-200"
                  />

                  {searchTerm && (
                    <div className="border rounded-lg max-h-64 overflow-y-auto">
                      {filteredCustomers.map((customer) => (
                        <button
                          key={customer.id}
                          onClick={() => setSelectedCustomer(customer)}
                          className="w-full text-left p-4 hover:bg-gray-50 border-b last:border-b-0"
                        >
                          <p className="font-medium text-sm">{customer.name}</p>
                          <p className="text-sm text-gray-600">
                            {customer.email} • {customer.phone}
                          </p>
                        </button>
                      ))}
                      {filteredCustomers.length === 0 && (
                        <p className="p-4 text-gray-500">No customers found</p>
                      )}
                    </div>
                  )}

                  <div className="pt-4">
                    <p className="text-sm text-gray-600 mb-2">
                      Don't see the customer you're looking for?
                    </p>
                    <Button onClick={() => setShowNewCustomerForm(true)} variant="outline">
                      Create New Customer
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <CreateCustomerForm
                    onSubmit={(data) => {
                      createCustomerMutation.mutate(data, {
                        onSuccess: handleCustomerCreated,
                      });
                    }}
                    onCancel={() => setShowNewCustomerForm(false)}
                    isSubmitting={createCustomerMutation.isPending}
                  />
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm font-medium text-gray-700">Selected Customer:</p>
              <p className="font-semibold text-gray-900">{selectedCustomer.name}</p>
              <Button
                onClick={() => setSelectedCustomer(null)}
                variant="outline"
                size="sm"
                className="mt-2"
              >
                Change Customer
              </Button>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-4">Step 2: Job Details</h2>
              <CreateJobForm
                onSubmit={handleJobCreated}
                isSubmitting={createJobMutation.isPending}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
