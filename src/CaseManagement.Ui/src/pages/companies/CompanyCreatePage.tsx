import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createCompany } from '../../api/companyApi';

interface FormState {
  companyName: string;
  phone: string;
  email: string;
  website: string;
}

const initialForm: FormState = {
  companyName: '',
  phone: '',
  email: '',
  website: ''
};

export function CompanyCreatePage(): JSX.Element {
  const navigate = useNavigate();
  const [form, setForm] = useState<FormState>(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();

    if (!form.companyName.trim() || !form.email.trim() || !form.phone.trim() || !form.website.trim()) {
      setError('All fields are required.');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setError('Enter a valid email address.');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      const created = await createCompany(form);
      navigate(`/companies/${created.id}`, { state: { success: 'Company created successfully.' } });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create company');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section>
      <h1>Create Company</h1>
      <p><Link to="/companies">Back to Companies</Link></p>
      {error && <p className="status status-error">{error}</p>}

      <form onSubmit={onSubmit} className="form-grid">
        <label>
          Company Name
          <input value={form.companyName} onChange={(e) => setForm({ ...form, companyName: e.target.value })} />
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
          Website
          <input value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} />
        </label>

        <button type="submit" disabled={submitting}>{submitting ? 'Creating...' : 'Create Company'}</button>
      </form>
    </section>
  );
}
