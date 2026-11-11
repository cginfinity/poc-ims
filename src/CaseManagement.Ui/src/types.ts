export interface Company {
  id: number;
  companyName: string;
  phone: string;
  email: string;
  website: string;
}

export interface Beneficiary {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  externalId: string;
  companyId: number;
  isActive: boolean;
}

export interface CaseRecord {
  caseId: number;
  beneficiaryId: number;
  caseName: string;
  caseNumber: string;
  status: string;
  caseType: string;
  caseCountry: string;
}

export interface CreateCompanyRequest {
  companyName: string;
  phone: string;
  email: string;
  website: string;
}

export interface CreateBeneficiaryRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  externalId: string;
  companyId: number;
  isActive: boolean;
}

export interface CreateCaseRecordRequest {
  beneficiaryId: number;
  caseName: string;
  caseNumber: string;
  status: string;
  caseType: string;
  caseCountry: string;
}
