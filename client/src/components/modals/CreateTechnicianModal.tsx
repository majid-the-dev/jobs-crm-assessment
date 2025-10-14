import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useCreateTechnician } from "@/hooks/useTechnicians";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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

const technicianSchema = z.object({
  name: z.string().min(1, "Name is required"),
  phone: z.string().min(1, "Phone is required"),
  email: z.string().min(1, "Email is required").email("Invalid email address"),
});

type TechnicianFormValues = z.infer<typeof technicianSchema>;

interface CreateTechnicianModalProps {
  open: boolean;
  onClose: () => void;
}

export default function CreateTechnicianModal({ open, onClose }: CreateTechnicianModalProps) {
  const createMutation = useCreateTechnician();

  const form = useForm<TechnicianFormValues>({
    resolver: zodResolver(technicianSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
    },
  });

  const handleSubmit = (data: TechnicianFormValues) => {
    createMutation.mutate(data, {
      onSuccess: () => {
        form.reset();
        onClose();
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Technician</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm">Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="Taylor" className="text-sm" {...field} />
                  </FormControl>
                  <FormMessage className="text-sm" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm">Phone *</FormLabel>
                  <FormControl>
                    <Input placeholder="555-123-4567" className="text-sm" {...field} />
                  </FormControl>
                  <FormMessage className="text-sm" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm">Email *</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="taylor@company.com" className="text-sm" {...field} />
                  </FormControl>
                  <FormMessage className="text-sm" />
                </FormItem>
              )}
            />

            <div className="flex gap-2 pt-4">
              <Button type="submit" disabled={createMutation.isPending} className="text-sm h-fit w-fit rounded-lg">
                {createMutation.isPending ? "Adding..." : "Add Technician"}
              </Button>
              <Button type="button" variant="outline" onClick={onClose} className="text-sm h-fit w-fit rounded-lg">
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
