import { useState } from "react";
import moment from "moment";
import type { JobDetail } from "@/types";
import { Button } from "@/components/ui/button";
import InvoiceForm from "@/components/forms/InvoiceForm";
import PaymentForm from "@/components/forms/PaymentForm";

interface InvoiceTabProps {
  job: JobDetail;
  onCreateInvoice: (data: any) => void;
  onCreatePayment: (amount: number) => void;
  isCreatingInvoice: boolean;
  isCreatingPayment: boolean;
}

export default function InvoiceTab({
  job,
  onCreateInvoice,
  onCreatePayment,
  isCreatingInvoice,
  isCreatingPayment,
}: InvoiceTabProps) {
  const [showInvoiceForm, setShowInvoiceForm] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);

  return (
    <div className="p-8">
      {job.invoice ? (
        <div className="space-y-6">
          {}
          <div>
            <h3 className="text-sm font-semibold mb-4">Invoice #{job.invoice.id}</h3>
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left p-3 text-sm font-semibold text-gray-700">
                      Description
                    </th>
                    <th className="text-right p-3 text-sm font-semibold text-gray-700">
                      Quantity
                    </th>
                    <th className="text-right p-3 text-sm font-semibold text-gray-700">
                      Rate
                    </th>
                    <th className="text-right p-3 text-sm font-semibold text-gray-700">
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {job.invoice.line_items.map((item, index) => (
                    <tr key={index} className="border-t">
                      <td className="text-sm p-3">{item.description}</td>
                      <td className="text-right text-sm p-3">{item.quantity}</td>
                      <td className="text-right text-sm p-3">{item.rate.toFixed(2)}</td>
                      <td className="text-right text-sm p-3">{item.amount.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-50">
                  <tr className="border-t border-gray-300">
                    <td colSpan={3} className="text-right text-sm p-3 font-semibold">
                      Total:
                    </td>
                    <td className="text-right text-sm p-3 font-semibold">
                      {job.invoice.total.toFixed(2)}
                    </td>
                  </tr>
                  <tr className="border-t">
                    <td colSpan={3} className="text-right text-sm p-3 font-semibold text-blue-600">
                      Balance Due:
                    </td>
                    <td className="text-right text-sm p-3 font-semibold text-blue-600">
                      {job.invoice.balance.toFixed(2)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {}
          <div>
            <h3 className="text-sm font-semibold mb-4">Payments</h3>
            {job.invoice.payments && job.invoice.payments.length > 0 ? (
              <div className="border rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left p-3 text-sm font-semibold text-gray-700">
                        Date
                      </th>
                      <th className="text-right p-3 text-sm font-semibold text-gray-700">
                        Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {job.invoice.payments.map((payment) => (
                      <tr key={payment.id} className="border-t">
                        <td className="text-sm p-3">
                          {moment(payment.payment_date).format('MMM DD, YYYY • h:mm A')}
                        </td>
                        <td className="text-right text-sm p-3 font-medium">
                          {payment.amount.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-600 text-sm">No payments recorded</p>
            )}

            {job.invoice.balance > 0 && (
              <>
                {!showPaymentForm ? (
                  <Button onClick={() => setShowPaymentForm(true)} className="mt-4 text-sm h-fit w-fit rounded-lg">
                    Record Payment
                  </Button>
                ) : (
                  <PaymentForm
                    maxAmount={job.invoice.balance}
                    onSubmit={(amount) => {
                      onCreatePayment(amount);
                      setShowPaymentForm(false);
                    }}
                    onCancel={() => setShowPaymentForm(false)}
                    isSubmitting={isCreatingPayment}
                  />
                )}
              </>
            )}
          </div>
        </div>
      ) : (
        <div>
          {job.status !== 'Done' ? (
            <p className="text-gray-600 text-sm">
              Job must be marked as Done before creating an invoice.
            </p>
          ) : !showInvoiceForm ? (
            <div>
              <p className="text-gray-600 mb-4 text-sm">No invoice created yet</p>
              <Button onClick={() => setShowInvoiceForm(true)} className="text-sm h-fit w-fit rounded-lg">Create Invoice</Button>
            </div>
          ) : (
            <InvoiceForm
              onSubmit={(data) => {
                onCreateInvoice(data);
                setShowInvoiceForm(false);
              }}
              onCancel={() => setShowInvoiceForm(false)}
              isSubmitting={isCreatingInvoice}
            />
          )}
        </div>
      )}
    </div>
  );
}

