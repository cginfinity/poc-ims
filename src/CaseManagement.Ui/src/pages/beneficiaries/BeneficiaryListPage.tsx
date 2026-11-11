import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { getBeneficiaries } from '../../api/beneficiaryApi';
import { getCompanies } from '../../api/companyApi';
import type { Beneficiary, Company } from '../../types';
import { StatusView } from '../../components/StatusView';

interface CompanyOption {
  id: number;
  name: string;
}

function toCompanyOption(company: Company, index: number): CompanyOption {
  const rawId = (company as Company & { Id?: number }).id
    ?? (company as Company & { Id?: number }).Id
    ?? index + 1;

  const rawName = (company as Company & { CompanyName?: string }).companyName
    ?? (company as Company & { CompanyName?: string }).CompanyName
    ?? '';

  const id = Number(rawId);
  const name = typeof rawName === 'string' && rawName.trim().length > 0
    ? rawName.trim()
    : `Company ${id}`;

  return { id, name };
}

export function BeneficiaryListPage(): JSX.Element {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async (): Promise<void> => {
      try {
        setLoading(true);
        setError(null);
        const [companyData, beneficiaryData] = await Promise.all([getCompanies(), getBeneficiaries()]);
        setCompanies(companyData);
        setBeneficiaries(beneficiaryData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load beneficiaries');
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, []);

  const companyOptions = useMemo(
    () => companies.map((company, index) => toCompanyOption(company, index)),
    [companies]
  );

  const filteredBeneficiaries = useMemo(() => {
    if (!selectedCompanyId) {
      return [];
    }

    const selectedId = Number(selectedCompanyId);
    return beneficiaries.filter((beneficiary) => Number(beneficiary.companyId) === selectedId);
  }, [beneficiaries, selectedCompanyId]);

  return (
    <section>
      <div className="page-title-row">
        <h1>Beneficiaries</h1>
        <Link to="/beneficiaries/new" className="btn-link">Create Beneficiary</Link>
      </div>

      <label className="filter-label">
        Company
        <select
          className="company-select"
          value={selectedCompanyId}
          onChange={(e) => setSelectedCompanyId(e.target.value)}
        >
          <option value="">Select company</option>
          {companyOptions.map((company) => (
            <option key={company.id} value={company.id}>{company.id} - {company.name}</option>
          ))}
        </select>
      </label>

      {loading && <StatusView text="Loading beneficiaries..." />}
      {error && <StatusView text={error} tone="error" />}
      {!loading && !error && selectedCompanyId === '' && <StatusView text="Select a company to view beneficiaries." />}
      {!loading && !error && selectedCompanyId !== '' && filteredBeneficiaries.length === 0 && (
        <StatusView text="No beneficiaries found for the selected company." />
      )}

      {!loading && !error && selectedCompanyId !== '' && filteredBeneficiaries.length > 0 && (
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>External ID</th>
              <th>Active</th>
            </tr>
          </thead>
          <tbody>
            {filteredBeneficiaries.map((beneficiary) => (
              <tr key={beneficiary.id}>
                <td><Link to={`/beneficiaries/${beneficiary.id}`}>{beneficiary.id}</Link></td>
                <td>{beneficiary.firstName} {beneficiary.lastName}</td>
                <td>{beneficiary.email}</td>
                <td>{beneficiary.phone}</td>
                <td>{beneficiary.externalId}</td>
                <td>{beneficiary.isActive ? 'Yes' : 'No'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}
