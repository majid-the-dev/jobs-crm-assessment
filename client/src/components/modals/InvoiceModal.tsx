import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useCreateInvoice } from '@/hooks/useInvoices';
import type { Job } from '@/types';
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
import { Plus, Trash2 } from 'lucide-react';

const lineItemSchema = z.object({
  description: z.string().min(1, "Description is required"),
  quantity: z.number().min(0.01, "Quantity must be greater than 0"),
  rate: z.number().min(0.01, "Rate must be greater than 0"),
});

const invoiceSchema = z.object({
  line_items: z.array(lineItemSchema).min(1, "At least one line item is required"),
});

type InvoiceFormValues = z.infer<typeof invoiceSchema>;

interface InvoiceModalProps {
  open: boolean;
  job: Job;
  onClose: () => void;
}

export default function InvoiceModal({ open, job, onClose }: InvoiceModalProps) {
  const createInvoiceMutation = useCreateInvoice(job.id);

  const form = useForm<InvoiceFormValues>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      line_items: [{ description: '', quantity: 1, rate: 0 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "line_items",
  });

  const handleSubmit = (data: InvoiceFormValues) => {
    createInvoiceMutation.mutate(data, {
      onSuccess: () => {
        form.reset();
        onClose();
      },
    });
  };

  const calculateLineItemAmount = (quantity: number, rate: number) => {
    return (quantity * rate).toFixed(2);
  };

  const calculateTotal = () => {
    const items = form.watch('line_items');
    return items.reduce((sum, item) => sum + (item.quantity * item.rate), 0).toFixed(2);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Invoice</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-sm font-medium text-gray-900">Job: {job.title}</p>
              <p className="text-xs text-gray-600 mt-1">Customer: {job.customer.name}</p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold">Line Items</p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => append({ description: '', quantity: 1, rate: 0 })}
                >
                  <Plus size={16} className="mr-1" />
                  Add Item
                </Button>
              </div>

              {fields.map((field, index) => (
                <div key={field.id} className="p-3 bg-gray-50 rounded-lg border border-gray-200 space-y-3">
                  <div className="flex items-start justify-between">
                    <p className="text-xs font-medium text-gray-600">Item {index + 1}</p>
                    {fields.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => remove(index)}
                        className="h-6 w-6 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 size={14} />
                      </Button>
                    )}
                  </div>

                  <FormField
                    control={form.control}
                    name={`line_items.${index}.description`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs text-gray-600">Description *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., AC Repair Service"
                            className="text-sm"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-3 gap-2">
                    <FormField
                      control={form.control}
                      name={`line_items.${index}.quantity`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs text-gray-600">Quantity *</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="0.01"
                              min="0.01"
                              className="text-sm"
                              {...field}
                              onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                            />
                          </FormControl>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`line_items.${index}.rate`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs text-gray-600">Rate *</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="0.01"
                              min="0.01"
                              className="text-sm"
                              {...field}
                              onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                            />
                          </FormControl>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )}
                    />

                    <div>
                      <p className="text-xs text-gray-600 mb-2">Amount</p>
                      <div className="h-10 flex items-center px-3 bg-white border border-gray-300 rounded-md text-sm font-medium">
                        {calculateLineItemAmount(
                          form.watch(`line_items.${index}.quantity`),
                          form.watch(`line_items.${index}.rate`)
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          <div className="flex justify-between items-center p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <span className="font-semibold text-gray-900">Total:</span>
            <span className="text-xl font-bold text-blue-600">{calculateTotal()}</span>
          </div>

            <div className="flex gap-2 pt-4 border-t">
              <Button type="submit" disabled={createInvoiceMutation.isPending}>
                {createInvoiceMutation.isPending ? 'Creating...' : 'Create Invoice'}
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
