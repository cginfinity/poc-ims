import { FormEvent, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getCompanies } from '../../api/companyApi';
import { getBeneficiaries } from '../../api/beneficiaryApi';
import { createCaseRecord } from '../../api/caseRecordApi';
import type { Beneficiary, Company } from '../../types';

interface FormState {
  companyId: string;
  beneficiaryId: string;
  caseName: string;
  caseNumber: string;
  status: string;
  caseType: string;
  caseCountry: string;
}

const initialForm: FormState = {
  companyId: '',
  beneficiaryId: '',
  caseName: '',
  caseNumber: '',
  status: '',
  caseType: '',
  caseCountry: ''
};

export function CaseCreatePage(): JSX.Element {
  const navigate = useNavigate();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);
  const [form, setForm] = useState<FormState>(initialForm);
  const [loadingFilters, setLoadingFilters] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async (): Promise<void> => {
      try {
        setLoadingFilters(true);
        setError(null);
        const [companyData, beneficiaryData] = await Promise.all([getCompanies(), getBeneficiaries()]);
        setCompanies(companyData);
        setBeneficiaries(beneficiaryData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load filters');
      } finally {
        setLoadingFilters(false);
      }
    };

    void load();
  }, []);

  const filteredBeneficiaries = useMemo(
    () => beneficiaries.filter((b) => b.companyId === Number(form.companyId)),
    [beneficiaries, form.companyId]
  );

  useEffect(() => {
    setForm((current) => ({ ...current, beneficiaryId: '' }));
  }, [form.companyId]);

  const onSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();

    if (!form.companyId || !form.beneficiaryId || !form.caseName.trim() || !form.caseNumber.trim() || !form.status.trim() || !form.caseType.trim() || !form.caseCountry.trim()) {
      setError('All fields are required.');
      return;
    }

    const beneficiaryId = Number(form.beneficiaryId);
    if (!Number.isInteger(beneficiaryId)) {
      setError('Select a valid beneficiary.');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      const created = await createCaseRecord({
        beneficiaryId,
        caseName: form.caseName,
        caseNumber: form.caseNumber,
        status: form.status,
        caseType: form.caseType,
        caseCountry: form.caseCountry
      });
      navigate(`/cases/${created.caseId}`, { state: { success: 'Case created successfully.' } });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create case');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section>
      <h1>Create Case</h1>
      <p><Link to="/cases">Back to Cases</Link></p>
      {error && <p className="status status-error">{error}</p>}

      <form onSubmit={onSubmit} className="form-grid">
        <label>
          Company
          <select
            value={form.companyId}
            onChange={(e) => setForm({ ...form, companyId: e.target.value })}
            disabled={loadingFilters}
          >
            <option value="">Select company</option>
            {companies.map((company) => (
              <option key={company.id} value={company.id}>{company.companyName}</option>
            ))}
          </select>
        </label>

        <label>
          Beneficiary
          <select
            value={form.beneficiaryId}
            onChange={(e) => setForm({ ...form, beneficiaryId: e.target.value })}
            disabled={!form.companyId || loadingFilters}
          >
            <option value="">Select beneficiary</option>
            {filteredBeneficiaries.map((beneficiary) => (
              <option key={beneficiary.id} value={beneficiary.id}>
                {beneficiary.firstName} {beneficiary.lastName}
              </option>
            ))}
          </select>
        </label>

        <label>
          Case Name
          <input value={form.caseName} onChange={(e) => setForm({ ...form, caseName: e.target.value })} />
        </label>

        <label>
          Case Number
          <input value={form.caseNumber} onChange={(e) => setForm({ ...form, caseNumber: e.target.value })} />
        </label>

        <label>
          Status
          <input value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} />
        </label>

        <label>
          Case Type
          <input value={form.caseType} onChange={(e) => setForm({ ...form, caseType: e.target.value })} />
        </label>

        <label>
          Case Country
          <input value={form.caseCountry} onChange={(e) => setForm({ ...form, caseCountry: e.target.value })} />
        </label>

        <button type="submit" disabled={submitting}>{submitting ? 'Creating...' : 'Create Case'}</button>
      </form>
    </section>
  );
}
