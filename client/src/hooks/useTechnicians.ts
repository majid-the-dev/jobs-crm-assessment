import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { techniciansAPI } from '@/lib/api';
import type { CreateTechnicianDto } from '@/types';

export const useTechnicians = () => {
  return useQuery({
    queryKey: ['technicians'],
    queryFn: techniciansAPI.getAll,
  });
};

export const useTechnician = (id: number) => {
  return useQuery({
    queryKey: ['technician', id],
    queryFn: () => techniciansAPI.getById(id),
    enabled: !!id,
  });
};

export const useCreateTechnician = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTechnicianDto) => techniciansAPI.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['technicians'] });
      toast.success('Technician created successfully!');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};

