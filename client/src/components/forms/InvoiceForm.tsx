import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import type { InvoiceLineItem } from "@/types";
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

const lineItemSchema = z.object({
  description: z.string().min(1, "Description is required"),
  quantity: z.number().positive("Quantity must be greater than 0"),
  rate: z.number().positive("Rate must be greater than 0"),
});

const invoiceSchema = z.object({
  line_items: z.array(lineItemSchema).min(1, "At least one line item is required"),
});

type InvoiceFormValues = z.infer<typeof invoiceSchema>;

interface InvoiceFormProps {
  onSubmit: (data: { line_items: Omit<InvoiceLineItem, "amount">[] }) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

export default function InvoiceForm({ onSubmit, onCancel, isSubmitting }: InvoiceFormProps) {
  const form = useForm<InvoiceFormValues>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      line_items: [{ description: "", quantity: 1, rate: 0 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "line_items",
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <h3 className="text-xl font-semibold">Create Invoice</h3>

        <div className="space-y-3">
          {fields.map((field, index) => (
            <div key={field.id} className="grid grid-cols-[2fr_1fr_1fr_auto] gap-3">
              <FormField
                control={form.control}
                name={`line_items.${index}.description`}
                render={({ field }) => (
                  <FormItem>
                    {index === 0 && <FormLabel>Description</FormLabel>}
                    <FormControl>
                      <Input placeholder="Service description" {...field} className="text-sm ring-0 outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-blue-600 transition-colors duration-200" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`line_items.${index}.quantity`}
                render={({ field }) => (
                  <FormItem>
                    {index === 0 && <FormLabel>Quantity</FormLabel>}
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="Qty"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value))}
                        className="text-sm ring-0 outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-blue-600 transition-colors duration-200"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`line_items.${index}.rate`}
                render={({ field }) => (
                  <FormItem>
                    {index === 0 && <FormLabel>Rate</FormLabel>}
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="Rate"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value))}
                        className="text-sm ring-0 outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-blue-600 transition-colors duration-200"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className={index === 0 ? "pt-8" : ""}>
                {fields.length > 1 && (
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => remove(index)}
                  >
                    Remove
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={() => append({ description: "", quantity: 1, rate: 0 })}
        >
          Add Item
        </Button>

        <div className="flex gap-2 pt-4 border-t">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create Invoice"}
          </Button>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
}
