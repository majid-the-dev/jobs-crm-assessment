import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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

const customerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  phone: z.string().min(1, "Phone is required"),
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  address: z.string().min(1, "Address is required"),
});

type CustomerFormValues = z.infer<typeof customerSchema>;

interface CreateCustomerFormProps {
  onSubmit: (data: CustomerFormValues) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

export default function CreateCustomerForm({
  onSubmit,
  onCancel,
  isSubmitting,
}: CreateCustomerFormProps) {
  const form = useForm<CustomerFormValues>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      address: "",
    },
  });

  return (
    <div className="mt-4 p-4 bg-gray-50 rounded space-y-3">
      <h3 className="font-semibold text-sm">New Customer</h3>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm">Name *</FormLabel>
                <FormControl>
                  <Input placeholder="John Smith" className="text-sm ring-0 outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-blue-600 transition-colors duration-200" {...field} />
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
                  <Input placeholder="555-123-4567" className="text-sm ring-0 outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-blue-600 transition-colors duration-200" {...field} />
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
                  <Input
                    type="email"
                    placeholder="john@example.com"
                    className="text-sm ring-0 outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-blue-600 transition-colors duration-200"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-sm" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm">Address *</FormLabel>
                <FormControl>
                  <Input
                    placeholder="123 Main St, City, State"
                    className="text-sm ring-0 outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-blue-600 transition-colors duration-200"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-sm" />
              </FormItem>
            )}
          />

          <div className="flex gap-2 pt-2">
            <Button type="submit" disabled={isSubmitting} className="text-sm h-fit w-fit rounded-lg">
              {isSubmitting ? "Adding..." : "Add Customer"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="text-sm h-fit w-fit rounded-lg"
            >
              Cancel
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

