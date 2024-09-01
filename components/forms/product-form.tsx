'use client';
import * as z from 'zod';
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from 'react-hook-form';
import { Trash } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Separator } from '@/components/ui/separator';
import { Heading } from '@/components/ui/heading';
import { useToast } from '../ui/use-toast';
import { DatePickerDemo } from '@/components/calendar/calendar';
import { formatISO, parseISO } from 'date-fns';
import { useUserData } from '@/hooks/userData';

const formSchema = z.object({
  name: z
    .string()
    .min(3, { message: 'Event name must be at least 3 characters' }),
  ProposedDate: z
    .array(z.string())
    .length(3, { message: 'You must provide exactly 3 proposed dates' }),
  postalCode: z.string().min(5, { message: 'Postal code is too short' }),
  address: z.string().min(3, { message: 'Address is too short' }),
  emailVendor: z
    .string()
    .email({ message: 'Please enter a valid email address' })
});

type ProductFormValues = z.infer<typeof formSchema>;

interface ProductFormProps {
  initialData: any | null;
  categories: any;
}

export const ProductForm: React.FC<ProductFormProps> = ({
  initialData,
  categories
}) => {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const title = initialData ? 'Edit Event' : 'Create Event';
  const description = initialData ? 'Edit an event.' : 'Add a new event';
  const toastMessage = initialData ? 'Event updated.' : 'Event created.';
  const action = initialData ? 'Save changes' : 'Create';

  const defaultValues = initialData
    ? initialData
    : {
        name: '',
        ProposedDate: ['', '', ''], // Defaulting to empty strings for date placeholders
        postalCode: '',
        address: '',
        emailVendor: ''
      };

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues
  });

  const { email } = useUserData();

  const onSubmit = async (data: ProductFormValues) => {
    try {
      setLoading(true);
      const formattedDates = data.ProposedDate.map((date) => {
        const parsedDate = date ? new Date(date) : new Date();
        return formatISO(parsedDate);
      });

      const eventData = {
        ...data,
        ProposedDate: formattedDates,
        status: 'pending', // Manually set status
        emailHr: email, // Manually set email HR
        confirmedDate: '', // Manually set confirmed date
        remarks: '' // Manually set remarks
      };
      const response = await fetch('http://localhost:3000/event/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(eventData)
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      // const result = await response.json();
      // console.log('Event created:', result);
      router.refresh();
      router.push('/dashboard');
      toast({
        variant: 'default',
        title: 'Success',
        description: 'Event created successfully.'
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: 'There was a problem with your request.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
      /> */}
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        {initialData && (
          <Button
            disabled={loading}
            variant="destructive"
            size="sm"
            onClick={() => setOpen(true)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        )}
      </div>
      <Separator />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-8"
        >
          <div className="flex flex-wrap gap-3">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Event name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="ProposedDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Proposed Dates</FormLabel>
                  <FormControl>
                    <div className="flex flex-wrap gap-3">
                      {field.value.map((date, index) => (
                        <Controller
                          key={index}
                          name={`ProposedDate.${index}`}
                          control={form.control}
                          render={({ field: fieldProps }) => (
                            <DatePickerDemo
                              date={date ? new Date(date) : undefined}
                              onDateChange={(selectedDate) => {
                                const updatedDates = [...field.value];
                                updatedDates[index] = selectedDate
                                  ? selectedDate.toISOString()
                                  : '';
                                field.onChange(updatedDates);
                              }}
                            />
                          )}
                        />
                      ))}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="emailVendor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>email Vendor</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="email Vendor"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="postalCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Postal Code</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Postal Code"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Address"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button disabled={loading} className="ml-auto" type="submit">
            {action}
          </Button>
        </form>
      </Form>
    </>
  );
};
