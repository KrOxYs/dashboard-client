'use client';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { columns } from './columns';
import { useUserData } from '@/hooks/userData';

export const UserClient: React.FC = () => {
  const router = useRouter();
  const { data, name, loading, error, role } = useUserData();

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <>
      <div className="flex items-start justify-between">
        <Heading
          title={`Hello ${name ?? 'User'}`}
          description="Manage Event (Client-side table functionalities.)"
        />
        {role === 'HR' && (
          <Button
            className="text-xs md:text-sm"
            onClick={() => router.push(`/dashboard/user/new`)}
          >
            <Plus className="mr-2 h-4 w-4" /> Add New
          </Button>
        )}
      </div>
      <Separator />
      {data.length > 0 ? (
        <DataTable searchKey="name" columns={columns} data={data} />
      ) : (
        <p>No events available.</p>
      )}
    </>
  );
};
