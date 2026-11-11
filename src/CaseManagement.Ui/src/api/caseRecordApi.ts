import { apiRequest } from './client';
import type { CaseRecord, CreateCaseRecordRequest } from '../types';

export function getCaseRecords(): Promise<CaseRecord[]> {
  return apiRequest<CaseRecord[]>('/api/CaseRecord');
}

export function getCaseRecord(id: number): Promise<CaseRecord> {
  return apiRequest<CaseRecord>(`/api/CaseRecord/${id}`);
}

export function getCaseRecordsByBeneficiaryId(beneficiaryId: number): Promise<CaseRecord[]> {
  return apiRequest<CaseRecord[]>(`/api/CaseRecord/beneficiary/${beneficiaryId}`);
}

export function createCaseRecord(payload: CreateCaseRecordRequest): Promise<CaseRecord> {
  return apiRequest<CaseRecord>('/api/CaseRecord', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}
