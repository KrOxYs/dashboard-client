'use client';
import { ColumnDef } from '@tanstack/react-table';
import { Checkbox } from '@/components/ui/checkbox';
import { DialogDemo } from '@/components/dialog/dialog';
import { cn } from '@/lib/utils';

// Define the shape of your event data
interface Event {
  _id: string;
  name: string;
  dateCreated: string; // ISO date string
  status: string;
  emailHr: string;
  emailVendor: string;
  ProposedDate: string[]; // Array of ISO date strings
  confirmedDate: string;
  postalCode: string;
  address: string;
  remarks: string;
  vendorCompanyName: string;
  __v: number;
}

export const columns: ColumnDef<Event>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false
  },
  {
    accessorKey: 'name',
    header: 'Event Name'
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ getValue }) => {
      const status = getValue() as string;
      const statusClass =
        status === 'pending'
          ? 'bg-yellow-100 text-yellow-800'
          : status === 'accept'
          ? 'bg-green-100 text-green-800'
          : status === 'rejected'
          ? 'bg-red-100 text-red-800'
          : '';

      return (
        <span className={cn('rounded px-2 py-1', statusClass)}>{status}</span>
      );
    }
  },
  {
    accessorKey: 'vendorCompanyName',
    header: 'Vendor Name'
  },
  {
    accessorKey: 'dateCreated',
    header: 'Date Created',
    cell: ({ getValue }) =>
      getValue() ? new Date(getValue() as string).toLocaleDateString() : 'N/A'
  },
  {
    accessorKey: 'confirmedDate',
    header: 'Confirmed Date',
    cell: ({ getValue }) =>
      getValue() ? new Date(getValue() as string).toLocaleDateString() : 'N/A'
  },
  {
    accessorKey: 'remarks',
    header: 'Remarks'
  },
  {
    id: 'actions',
    cell: ({ row }) => <DialogDemo data={row.original} />
  }
];
