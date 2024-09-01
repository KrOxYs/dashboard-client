// hooks/useUserData.ts
import { useEffect, useState } from 'react';
import axios from 'axios';
import cookies from 'js-cookie';
import { fetchEvents, fetchVendorCompanyName } from '@/service/apiService';

interface UseUserDataResult {
  data: any[];
  name: string | undefined;
  email: string | null;
  loading: boolean;
  error: string | null;
  role: string | undefined;
}

export const useUserData = (): UseUserDataResult => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [name, setName] = useState<string | undefined>();
  const [role, setRole] = useState<string | undefined>();

  useEffect(() => {
    const fetchUserData = async (userEmail: string) => {
      try {
        const events = await fetchEvents(userEmail);
        const eventsWithCompanyNames = await Promise.all(
          events.map(async (event: any) => {
            try {
              const companyName = await fetchVendorCompanyName(
                event.emailVendor
              );
              return { ...event, vendorCompanyName: companyName };
            } catch (vendorError) {
              console.error(
                `Failed to fetch company name for vendor ${event.emailVendor}`,
                vendorError
              );
              return { ...event, vendorCompanyName: 'Unknown' };
            }
          })
        );
        setData(eventsWithCompanyNames);
      } catch (error) {
        setError('Failed to fetch events');
        console.error('Failed to fetch events:', error);
      }
    };

    const fetchProfileData = async () => {
      const token = cookies.get('custom-auth-token');
      try {
        const profileResponse = await axios.get(
          'http://localhost:3000/auth/profile',
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        const {
          email: userEmail,
          companyName,
          role: userRole
        } = profileResponse.data;

        setRole(userRole);
        setName(companyName);
        setEmail(userEmail);

        if (userEmail) {
          await fetchUserData(userEmail);
        }
      } catch (error) {
        setError('Failed to fetch profile data');
        console.error('Failed to fetch profile data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  return { data, name, email, loading, error, role };
};
