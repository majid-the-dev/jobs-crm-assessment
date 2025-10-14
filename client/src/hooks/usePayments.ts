import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { paymentsAPI } from '@/lib/api';
import type { CreatePaymentDto } from '@/types';

export const useCreatePayment = (invoiceId: number, jobId?: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePaymentDto) => paymentsAPI.create(invoiceId, data),
    onSuccess: () => {
      if (jobId) {
        queryClient.invalidateQueries({ queryKey: ['job', jobId] });
      }
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      toast.success('Payment recorded successfully!');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};

