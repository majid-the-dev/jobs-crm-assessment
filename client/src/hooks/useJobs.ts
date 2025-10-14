import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { jobsAPI } from '@/lib/api';
import type { CreateJobDto, JobStatus } from '@/types';

export const useJobs = (status?: JobStatus) => {
  return useQuery({
    queryKey: ['jobs', status],
    queryFn: () => jobsAPI.getAll(status),
  });
};

export const useJob = (id: number) => {
  return useQuery({
    queryKey: ['job', id],
    queryFn: () => jobsAPI.getById(id),
    enabled: !!id,
  });
};

export const useCreateJob = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateJobDto) => jobsAPI.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      toast.success('Job created successfully!');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};

export const useUpdateJobStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ jobId, status }: { jobId: number; status: JobStatus }) =>
      jobsAPI.updateStatus(jobId, status),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      queryClient.invalidateQueries({ queryKey: ['job', variables.jobId] });
      toast.success('Job status updated!');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};
