import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { invoicesAPI } from '@/lib/api';
import type { CreateInvoiceDto } from '@/types';

export const useCreateInvoice = (jobId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateInvoiceDto) => invoicesAPI.create(jobId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['job', jobId] });
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      toast.success('Invoice created successfully!');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};

