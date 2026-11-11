import { apiRequest } from './client';
import type { Beneficiary, CreateBeneficiaryRequest } from '../types';

export function getBeneficiaries(): Promise<Beneficiary[]> {
  return apiRequest<Beneficiary[]>('/api/Beneficiary');
}

export function getBeneficiary(id: number): Promise<Beneficiary> {
  return apiRequest<Beneficiary>(`/api/Beneficiary/${id}`);
}

export function createBeneficiary(payload: CreateBeneficiaryRequest): Promise<Beneficiary> {
  return apiRequest<Beneficiary>('/api/Beneficiary', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}
