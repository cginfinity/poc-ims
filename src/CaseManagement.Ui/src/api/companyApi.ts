import { apiRequest } from './client';
import type { Company, CreateCompanyRequest } from '../types';

export function getCompanies(): Promise<Company[]> {
  return apiRequest<Company[]>('/api/Company');
}

export function getCompany(id: number): Promise<Company> {
  return apiRequest<Company>(`/api/Company/${id}`);
}

export function createCompany(payload: CreateCompanyRequest): Promise<Company> {
  return apiRequest<Company>('/api/Company', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}
