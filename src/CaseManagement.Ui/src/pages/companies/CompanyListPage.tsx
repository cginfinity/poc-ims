import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getCompanies } from '../../api/companyApi';
import type { Company } from '../../types';
import { StatusView } from '../../components/StatusView';

export function CompanyListPage(): JSX.Element {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async (): Promise<void> => {
      try {
        setLoading(true);
        setError(null);
        const data = await getCompanies();
        setCompanies(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load companies');
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, []);

  return (
    <section>
      <div className="page-title-row">
        <h1>Companies</h1>
        <Link to="/companies/new" className="btn-link">Create Company</Link>
      </div>

      {loading && <StatusView text="Loading companies..." />}
      {error && <StatusView text={error} tone="error" />}
      {!loading && !error && companies.length === 0 && <StatusView text="No companies found." />}

      {!loading && !error && companies.length > 0 && (
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Website</th>
            </tr>
          </thead>
          <tbody>
            {companies.map((company) => (
              <tr key={company.id}>
                <td>
                  <Link to={`/companies/${company.id}`}>{company.id}</Link>
                </td>
                <td>{company.companyName}</td>
                <td>{company.email}</td>
                <td>{company.phone}</td>
                <td>{company.website}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}
