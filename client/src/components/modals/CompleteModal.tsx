import { useUpdateJobStatus } from '@/hooks/useJobs';
import type { Job } from '@/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CheckCircle2 } from 'lucide-react';

interface CompleteModalProps {
  open: boolean;
  job: Job;
  onClose: () => void;
}

export default function CompleteModal({ open, job, onClose }: CompleteModalProps) {
  const updateStatusMutation = useUpdateJobStatus();

  const handleComplete = () => {
    updateStatusMutation.mutate(
      { jobId: job.id, status: 'Done' },
      {
        onSuccess: () => {
          onClose();
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Mark Job as Done</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg border border-green-200">
            <CheckCircle2 className="text-green-600 mt-0.5" size={20} />
            <div>
              <p className="font-medium text-sm text-gray-900">{job.title}</p>
              <p className="text-xs text-gray-600 mt-1">Customer: {job.customer.name}</p>
            </div>
          </div>
          <p className="text-sm text-gray-600">
            Are you sure you want to mark this job as done? This will allow invoices to be created for this job.
          </p>
          <div className="flex gap-2 pt-2">
            <Button onClick={handleComplete} disabled={updateStatusMutation.isPending}>
              {updateStatusMutation.isPending ? 'Updating...' : 'Mark as Done'}
            </Button>
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
