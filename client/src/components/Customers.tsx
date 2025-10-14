import { useState } from "react";
import { Link } from "react-router-dom";
import { useCustomers } from "@/hooks/useCustomers";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User, Mail, Phone, MapPin } from "lucide-react";

export default function Customers() {
  const [searchTerm, setSearchTerm] = useState("");

  const { data: customers = [], isLoading } = useCustomers();

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone?.includes(searchTerm)
  );

  if (isLoading) {
    return <div className="text-center py-8">Loading customers...</div>;
  }

  return (
    <div className="flex flex-col h-[calc(100vh-120px)]">
      <div className="mb-6">
        <h2 className="text-gray-800 text-2xl font-medium">Customers</h2>
        <p className="text-gray-500 text-sm mt-1">
          Manage your customer base
        </p>
      </div>

      <div className="bg-white border border-gray-200/70 rounded-xl p-6 shadow-xs flex flex-col flex-1">
        <div className="flex items-center justify-between mb-6">
          <Input
            placeholder="Search customers by name, email, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-[400px] text-sm ring-0 outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-blue-600 transition-colors duration-200"
          />
          <Button asChild className="text-sm h-fit w-fit rounded-lg">
            <Link to="/jobs/new">Add Customer</Link>
          </Button>
        </div>

        <div className="mb-4">
          <p className="text-sm text-gray-600">
            Showing {filteredCustomers.length} of {customers.length} customers
          </p>
        </div>

        <div className="overflow-y-auto flex-1">
          {filteredCustomers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-min">
              {filteredCustomers.map((customer) => (
                <Link
                  key={customer.id}
                  to={`/customers/${customer.id}`}
                  className="block p-5 border border-gray-200 rounded-lg hover:border-blue-500 transition-all duration-200 h-fit"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100">
                      <User size={18} className="text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-base">
                        {customer.name}
                      </h3>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {customer.email && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Mail size={14} className="text-gray-400" />
                        <span className="truncate">{customer.email}</span>
                      </div>
                    )}
                    {customer.phone && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Phone size={14} className="text-gray-400" />
                        <span>{customer.phone}</span>
                      </div>
                    )}
                    {customer.address && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin size={14} className="text-gray-400" />
                        <span className="truncate">{customer.address}</span>
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="col-span-full text-center py-12 text-gray-500">
              <User size={48} className="mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium mb-2">No customers found</p>
              <p className="text-sm mb-4">
                {searchTerm
                  ? "Try a different search term"
                  : "Get started by adding your first customer"}
              </p>
              <Button asChild className="text-sm h-fit w-fit rounded-lg">
                <Link to="/jobs/new">Add Customer</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
