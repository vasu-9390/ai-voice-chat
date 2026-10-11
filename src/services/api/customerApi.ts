import { apiClient } from './client';
import { CustomerProfile } from '@/types';
import { mockCustomers } from './mockData';

let customersStore = [...mockCustomers];

export const customerApi = {
  async getCustomers(): Promise<CustomerProfile[]> {
    try {
      const { data } = await apiClient.get<CustomerProfile[]>('/customers');
      return data;
    } catch {
      return [...customersStore];
    }
  },

  async getCustomerById(id: string): Promise<CustomerProfile> {
    try {
      const { data } = await apiClient.get<CustomerProfile>(`/customers/${id}`);
      return data;
    } catch {
      const cust = customersStore.find((c) => c.id === id || c.email === id);
      if (!cust) return customersStore[0];
      return cust;
    }
  },

  async updateCustomer(id: string, updates: Partial<CustomerProfile>): Promise<CustomerProfile> {
    try {
      const { data } = await apiClient.patch<CustomerProfile>(`/customers/${id}`, updates);
      return data;
    } catch {
      const idx = customersStore.findIndex((c) => c.id === id);
      if (idx !== -1) {
        customersStore[idx] = { ...customersStore[idx], ...updates };
        return customersStore[idx];
      }
      throw new Error('Customer not found');
    }
  },
};
