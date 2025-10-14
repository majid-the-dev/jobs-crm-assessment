import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { appointmentsAPI } from '@/lib/api';
import type { CreateAppointmentDto } from '@/types';

export const useCreateAppointment = (jobId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateAppointmentDto) => appointmentsAPI.create(jobId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['job', jobId] });
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      toast.success('Appointment created successfully!');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};

