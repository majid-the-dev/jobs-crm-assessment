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

interface PaymentFormProps {
  maxAmount: number;
  onSubmit: (amount: number) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

export default function PaymentForm({
  maxAmount,
  onSubmit,
  onCancel,
  isSubmitting,
}: PaymentFormProps) {
  const paymentSchema = z.object({
    amount: z
      .number({ invalid_type_error: "Amount must be a number" })
      .positive("Amount must be greater than 0")
      .max(maxAmount, `Amount cannot exceed ${maxAmount.toFixed(2)}`),
  });

  type PaymentFormValues = z.infer<typeof paymentSchema>;

  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      amount: 0,
    },
  });

  const handleSubmit = (data: PaymentFormValues) => {
    onSubmit(data.amount);
  };

  return (
    <div className="mt-6 p-6 bg-gray-50 rounded-lg">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Payment Amount (Max: {maxAmount.toFixed(2)})</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder={`Max: ${maxAmount.toFixed(2)}`}
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                    className="text-sm ring-0 outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-blue-600 transition-colors duration-200"
                  />
                </FormControl>
                <FormMessage className="text-sm" />
              </FormItem>
            )}
          />

          <div className="flex gap-2">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Recording..." : "Record Payment"}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
