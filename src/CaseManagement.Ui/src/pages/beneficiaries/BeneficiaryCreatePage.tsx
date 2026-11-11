import { FormEvent, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getCompanies } from '../../api/companyApi';
import { createBeneficiary } from '../../api/beneficiaryApi';
import type { Company } from '../../types';

interface FormState {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  externalId: string;
  companyId: string;
  isActive: boolean;
}

const initialForm: FormState = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  externalId: '',
  companyId: '',
  isActive: true
};

export function BeneficiaryCreatePage(): JSX.Element {
  const navigate = useNavigate();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [form, setForm] = useState<FormState>(initialForm);
  const [loadingCompanies, setLoadingCompanies] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async (): Promise<void> => {
      try {
        setLoadingCompanies(true);
        const data = await getCompanies();
        setCompanies(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load companies');
      } finally {
        setLoadingCompanies(false);
      }
    };

    void load();
  }, []);

  const onSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();

    if (!form.firstName.trim() || !form.lastName.trim() || !form.email.trim() || !form.phone.trim() || !form.externalId.trim() || !form.companyId) {
      setError('All fields are required.');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setError('Enter a valid email address.');
      return;
    }

    const companyId = Number(form.companyId);
    if (!Number.isInteger(companyId)) {
      setError('Select a valid company.');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      const created = await createBeneficiary({
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        phone: form.phone,
        externalId: form.externalId,
        companyId,
        isActive: form.isActive
      });
      navigate(`/beneficiaries/${created.id}`, { state: { success: 'Beneficiary created successfully.' } });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create beneficiary');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section>
      <h1>Create Beneficiary</h1>
      <p><Link to="/beneficiaries">Back to Beneficiaries</Link></p>

      {error && <p className="status status-error">{error}</p>}

      <form onSubmit={onSubmit} className="form-grid">
        <label>
          First Name
          <input value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} />
        </label>
        <label>
          Last Name
          <input value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} />
        </label>
        <label>
          Email
          <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        </label>
        <label>
          Phone
          <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        </label>
        <label>
          External ID
          <input value={form.externalId} onChange={(e) => setForm({ ...form, externalId: e.target.value })} />
        </label>
        <label>
          Company
          <select
            value={form.companyId}
            onChange={(e) => setForm({ ...form, companyId: e.target.value })}
            disabled={loadingCompanies}
          >
            <option value="">Select company</option>
            {companies.map((company) => (
              <option key={company.id} value={company.id}>{company.companyName}</option>
            ))}
          </select>
        </label>
        <label className="checkbox-row">
          <input
            type="checkbox"
            checked={form.isActive}
            onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
          />
          Active
        </label>

        <button type="submit" disabled={submitting}>{submitting ? 'Creating...' : 'Create Beneficiary'}</button>
      </form>
    </section>
  );
}
