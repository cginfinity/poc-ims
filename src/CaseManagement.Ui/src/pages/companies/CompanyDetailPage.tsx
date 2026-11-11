import { useEffect, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { ApiError } from '../../api/client';
import { getCompany } from '../../api/companyApi';
import type { Company } from '../../types';
import { StatusView } from '../../components/StatusView';

export function CompanyDetailPage(): JSX.Element {
  const { id } = useParams();
  const location = useLocation();
  const successMessage = (location.state as { success?: string } | null)?.success;
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const companyId = Number(id);
    if (!Number.isInteger(companyId)) {
      setLoading(false);
      setError('Invalid company id.');
      return;
    }

    const load = async (): Promise<void> => {
      try {
        setLoading(true);
        setError(null);
        setNotFound(false);
        const data = await getCompany(companyId);
        setCompany(data);
      } catch (err) {
        if (err instanceof ApiError && err.status === 404) {
          setNotFound(true);
          return;
        }

        setError(err instanceof Error ? err.message : 'Failed to load company');
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, [id]);

  return (
    <section>
      <h1>Company Details</h1>
      <p><Link to="/companies">Back to Companies</Link></p>
      {successMessage && <StatusView text={successMessage} />}

      {loading && <StatusView text="Loading company..." />}
      {!loading && notFound && <StatusView text="Company not found." tone="error" />}
      {error && <StatusView text={error} tone="error" />}

      {!loading && !error && company && (
        <dl className="detail-grid">
          <dt>ID</dt><dd>{company.id}</dd>
          <dt>Name</dt><dd>{company.companyName}</dd>
          <dt>Email</dt><dd>{company.email}</dd>
          <dt>Phone</dt><dd>{company.phone}</dd>
          <dt>Website</dt><dd>{company.website}</dd>
        </dl>
      )}
    </section>
  );
}
