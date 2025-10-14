import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { customersAPI } from '@/lib/api';
import type { CreateCustomerDto } from '@/types';

export const useCustomers = () => {
  return useQuery({
    queryKey: ['customers'],
    queryFn: customersAPI.getAll,
  });
};

export const useCustomer = (id: number) => {
  return useQuery({
    queryKey: ['customer', id],
    queryFn: () => customersAPI.getById(id),
    enabled: !!id,
  });
};

export const useCreateCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCustomerDto) => customersAPI.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      toast.success('Customer created successfully!');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};

