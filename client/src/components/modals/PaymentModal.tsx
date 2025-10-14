import { useJob } from '@/hooks/useJobs';
import { useCreatePayment } from '@/hooks/usePayments';
import type { Job } from '@/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import PaymentForm from '@/components/forms/PaymentForm';

interface PaymentModalProps {
  open: boolean;
  job: Job;
  onClose: () => void;
}

export default function PaymentModal({ open, job, onClose }: PaymentModalProps) {
  const { data: fullJob, isLoading } = useJob(job.id);
  const createPaymentMutation = useCreatePayment(
    fullJob?.invoice?.id || 0,
    job.id
  );

  const handleSubmit = (amount: number) => {
    createPaymentMutation.mutate(
      { amount },
      {
        onSuccess: () => {
          onClose();
        },
      }
    );
  };

  if (isLoading) {
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent>
          <p className="text-center py-4">Loading...</p>
        </DialogContent>
      </Dialog>
    );
  }

  if (!fullJob?.invoice) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Record Payment</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-sm font-medium text-gray-900">Job: {job.title}</p>
            <p className="text-xs text-gray-600 mt-1">Customer: {job.customer.name}</p>
            <p className="text-xs text-gray-600 mt-1">
              Outstanding Balance: {fullJob.invoice.balance.toFixed(2)}
            </p>
          </div>
          
          <PaymentForm
            maxAmount={fullJob.invoice.balance}
            onSubmit={handleSubmit}
            onCancel={onClose}
            isSubmitting={createPaymentMutation.isPending}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
