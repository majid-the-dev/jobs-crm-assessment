import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import * as z from "zod";
import { techniciansAPI } from "@/lib/api";
import type { Technician } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const appointmentSchema = z.object({
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

type AppointmentFormValues = z.infer<typeof appointmentSchema>;

interface AppointmentFormProps {
  onSubmit: (data: AppointmentFormValues) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

export default function AppointmentForm({
  onSubmit,
  onCancel,
  isSubmitting,
}: AppointmentFormProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTechnician, setSelectedTechnician] = useState<Technician | null>(null);

  const { data: technicians = [] } = useQuery({
    queryKey: ["technicians"],
    queryFn: techniciansAPI.getAll,
  });

  const form = useForm<AppointmentFormValues>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      technician_id: 0,
      start_time: "",
      end_time: "",
    },
  });

  const filteredTechnicians = technicians.filter((tech) =>
    tech.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleTechnicianSelect = (technician: Technician) => {
    setSelectedTechnician(technician);
    form.setValue("technician_id", technician.id);
    setSearchTerm("");
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <h3 className="text-sm font-semibold">Schedule Appointment</h3>

        {}
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
                      <span className="text-sm font-medium">{selectedTechnician.name}</span>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedTechnician(null);
                          form.setValue("technician_id", 0);
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
                        className="text-sm ring-0 outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-blue-600 transition-colors duration-200"
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
                <Input type="datetime-local" className="text-sm ring-0 outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-blue-600 transition-colors duration-200" {...field} />
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
                <Input type="datetime-local" className="text-sm ring-0 outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-blue-600 transition-colors duration-200" {...field} />
              </FormControl>
              <FormMessage className="text-sm" />
            </FormItem>
          )}
        />

        <div className="flex gap-2 pt-4">
          <Button type="submit" disabled={isSubmitting} className="text-sm h-fit w-fit rounded-lg">
            {isSubmitting ? "Creating..." : "Create Appointment"}
          </Button>
          <Button type="button" variant="outline" onClick={onCancel} className="text-sm h-fit w-fit rounded-lg">
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
}
