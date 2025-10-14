import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Link } from "react-router-dom";
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

const jobSchema = z.object({
  title: z.string().min(1, "Job title is required"),
  description: z.string().optional(),
});

type JobFormValues = z.infer<typeof jobSchema>;

interface CreateJobFormProps {
  customerId?: number;
  onSubmit: (data: JobFormValues) => void;
  isSubmitting: boolean;
}

export default function CreateJobForm({
  onSubmit,
  isSubmitting,
}: CreateJobFormProps) {
  const form = useForm<JobFormValues>({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <h2 className="text-sm font-semibold">Job Details</h2>

        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm">Job Title *</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g., Fix AC Unit"
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
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm">Description</FormLabel>
              <FormControl>
                <textarea
                  className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-ring focus-visible:ring-offset-0 focus-visible:border-blue-600 transition-colors duration-200 resize-none"
                  rows={4}
                  placeholder="Describe the work to be done..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-2">
          <Button type="submit" disabled={isSubmitting} className="text-sm h-fit w-fit rounded-lg">
            {isSubmitting ? "Creating..." : "Create Job"}
          </Button>
          <Button type="button" variant="outline" asChild className="text-sm h-fit w-fit rounded-lg">
            <Link to="/">Cancel</Link>
          </Button>
        </div>
      </form>
    </Form>
  );
}

