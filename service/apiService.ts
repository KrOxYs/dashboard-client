// services/apiService.ts
import axios from 'axios';

const BASE_URL = 'http://localhost:3000';

export const fetchEvents = async (userEmail: string) => {
  try {
    const response = await axios.get(`${BASE_URL}/event/${userEmail}`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch events:', error);
    throw error;
  }
};

export const fetchVendorCompanyName = async (vendorEmail: string) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/event/vendors/${vendorEmail}`
    );
    return response.data.companyName;
  } catch (error) {
    console.error(
      `Failed to fetch company name for vendor ${vendorEmail}:`,
      error
    );
    throw error;
  }
};
