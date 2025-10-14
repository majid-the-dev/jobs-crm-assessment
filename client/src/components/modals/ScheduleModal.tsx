import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useTechnicians } from '@/hooks/useTechnicians';
import { useCreateAppointment } from '@/hooks/useAppointments';
import type { Job, Technician } from '@/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

const scheduleSchema = z.object({
  technician_id: z.number({ invalid_type_error: "Please select a technician" }).min(1, "Technician is required"),
  start_time: z.string().min(1, "Start time is required"),
  end_time: z.string().min(1, "End time is required"),
}).refine(
  (data) => new Date(data.start_time) < new Date(data.end_time),
  {
    message: "End time must be after start time",
    path: ["end_time"],
  }
);

type ScheduleFormValues = z.infer<typeof scheduleSchema>;

interface ScheduleModalProps {
  open: boolean;
  job: Job;
  onClose: () => void;
}

export default function ScheduleModal({ open, job, onClose }: ScheduleModalProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTechnician, setSelectedTechnician] = useState<Technician | null>(null);

  const { data: technicians = [] } = useTechnicians();
  const createAppointmentMutation = useCreateAppointment(job.id);

  const form = useForm<ScheduleFormValues>({
    resolver: zodResolver(scheduleSchema),
    defaultValues: {
      technician_id: 0,
      start_time: '',
      end_time: '',
    },
  });

  const filteredTechnicians = technicians.filter((tech) =>
    tech.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleTechnicianSelect = (technician: Technician) => {
    setSelectedTechnician(technician);
    form.setValue('technician_id', technician.id);
    setSearchTerm('');
  };

  const handleSubmit = (data: ScheduleFormValues) => {
    createAppointmentMutation.mutate(data, {
      onSuccess: () => {
        form.reset();
        setSelectedTechnician(null);
        setSearchTerm('');
        onClose();
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Schedule Appointment</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-sm font-medium text-gray-900">Job: {job.title}</p>
              <p className="text-xs text-gray-600 mt-1">Customer: {job.customer.name}</p>
            </div>

            <FormField
              control={form.control}
              name="technician_id"
              render={() => (
                <FormItem>
                  <FormLabel className="text-sm">Technician *</FormLabel>
                  <FormControl>
                    <div>
                      {selectedTechnician ? (
                        <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                          <div>
                            <p className="text-sm font-medium">{selectedTechnician.name}</p>
                            <p className="text-xs text-gray-600">{selectedTechnician.email}</p>
                          </div>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedTechnician(null);
                              form.setValue('technician_id', 0);
                              setSearchTerm('');
                            }}
                          >
                            Change
                          </Button>
                        </div>
                      ) : (
                        <div>
                          <Input
                            placeholder="Search technicians..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="text-sm"
                          />
                          {searchTerm && (
                            <div className="mt-2 border rounded-lg max-h-48 overflow-y-auto">
                              {filteredTechnicians.map((tech) => (
                                <button
                                  key={tech.id}
                                  type="button"
                                  onClick={() => handleTechnicianSelect(tech)}
                                  className="w-full text-left p-3 hover:bg-gray-50 border-b last:border-b-0"
                                >
                                  <p className="font-medium text-sm">{tech.name}</p>
                                  <p className="text-xs text-gray-600">{tech.email}</p>
                                </button>
                              ))}
                              {filteredTechnicians.length === 0 && (
                                <p className="p-3 text-gray-500 text-sm">No technicians found</p>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage className="text-sm" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="start_time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm">Start Time *</FormLabel>
                  <FormControl>
                    <Input type="datetime-local" className="text-sm" {...field} />
                  </FormControl>
                  <FormMessage className="text-sm" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="end_time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm">End Time *</FormLabel>
                  <FormControl>
                    <Input type="datetime-local" className="text-sm" {...field} />
                  </FormControl>
                  <FormMessage className="text-sm" />
                </FormItem>
              )}
            />

            <div className="flex gap-2 pt-4">
              <Button type="submit" disabled={createAppointmentMutation.isPending}>
                {createAppointmentMutation.isPending ? 'Scheduling...' : 'Schedule'}
              </Button>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
