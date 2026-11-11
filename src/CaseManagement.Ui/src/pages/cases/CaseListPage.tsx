import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { getCompanies } from '../../api/companyApi';
import { getBeneficiaries } from '../../api/beneficiaryApi';
import { getCaseRecordsByBeneficiaryId } from '../../api/caseRecordApi';
import type { Beneficiary, CaseRecord, Company } from '../../types';
import { StatusView } from '../../components/StatusView';

export function CaseListPage(): JSX.Element {
  const [searchParams] = useSearchParams();
  const companyIdParam = Number(searchParams.get('companyId'));
  const beneficiaryIdParam = Number(searchParams.get('beneficiaryId'));
  const initialCompanyId = Number.isInteger(companyIdParam) ? companyIdParam : '';
  const initialBeneficiaryId = Number.isInteger(beneficiaryIdParam) ? beneficiaryIdParam : '';

  const [companies, setCompanies] = useState<Company[]>([]);
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState<number | ''>(initialCompanyId);
  const [selectedBeneficiaryId, setSelectedBeneficiaryId] = useState<number | ''>(initialBeneficiaryId);
  const [cases, setCases] = useState<CaseRecord[]>([]);
  const [loadingFilters, setLoadingFilters] = useState(true);
  const [loadingCases, setLoadingCases] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const hasInitialized = useRef(false);

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

  const beneficiaryOptions = useMemo(
    () => beneficiaries.filter((beneficiary) => beneficiary.companyId === selectedCompanyId),
    [beneficiaries, selectedCompanyId]
  );

  useEffect(() => {
    if (!hasInitialized.current) {
      hasInitialized.current = true;
      return;
    }

    setSelectedBeneficiaryId('');
    setCases([]);
  }, [selectedCompanyId]);

  useEffect(() => {
    if (selectedBeneficiaryId === '') {
      return;
    }

    const selectedExists = beneficiaryOptions.some((beneficiary) => beneficiary.id === selectedBeneficiaryId);
    if (!selectedExists) {
      setSelectedBeneficiaryId('');
      setCases([]);
    }
  }, [beneficiaryOptions, selectedBeneficiaryId]);

  useEffect(() => {
    const run = async (): Promise<void> => {
      if (selectedBeneficiaryId === '') {
        return;
      }

      try {
        setLoadingCases(true);
        setError(null);
        const data = await getCaseRecordsByBeneficiaryId(selectedBeneficiaryId);
        setCases(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load cases');
      } finally {
        setLoadingCases(false);
      }
    };

    void run();
  }, [selectedBeneficiaryId]);

  return (
    <section>
      <div className="page-title-row">
        <h1>Cases</h1>
        <Link to="/cases/new" className="btn-link">Create Case</Link>
      </div>

      <div className="filters-row">
        <label className="filter-label">
          Company
          <select
            value={selectedCompanyId}
            onChange={(e) => setSelectedCompanyId(e.target.value ? Number(e.target.value) : '')}
            disabled={loadingFilters}
          >
            <option value="">Select company</option>
            {companies.map((company) => (
              <option key={company.id} value={company.id}>{company.companyName}</option>
            ))}
          </select>
        </label>

        <label className="filter-label">
          Beneficiary
          <select
            value={selectedBeneficiaryId}
            onChange={(e) => setSelectedBeneficiaryId(e.target.value ? Number(e.target.value) : '')}
            disabled={selectedCompanyId === '' || loadingFilters}
          >
            <option value="">Select beneficiary</option>
            {beneficiaryOptions.map((beneficiary) => (
              <option key={beneficiary.id} value={beneficiary.id}>
                {beneficiary.firstName} {beneficiary.lastName}
              </option>
            ))}
          </select>
        </label>
      </div>

      {error && <StatusView text={error} tone="error" />}
      {loadingFilters && <StatusView text="Loading filters..." />}
      {!loadingFilters && selectedCompanyId === '' && <StatusView text="Select a company to continue." />}
      {!loadingFilters && selectedCompanyId !== '' && selectedBeneficiaryId === '' && (
        <StatusView text="Select a beneficiary to view cases." />
      )}
      {loadingCases && <StatusView text="Loading cases..." />}
      {!loadingCases && selectedBeneficiaryId !== '' && cases.length === 0 && <StatusView text="No cases found for selected beneficiary." />}

      {!loadingCases && selectedBeneficiaryId !== '' && cases.length > 0 && (
        <table className="data-table">
          <thead>
            <tr>
              <th>Case ID</th>
              <th>Case Name</th>
              <th>Case Number</th>
              <th>Status</th>
              <th>Type</th>
              <th>Country</th>
            </tr>
          </thead>
          <tbody>
            {cases.map((caseRecord) => (
              <tr key={caseRecord.caseId}>
                <td><Link to={`/cases/${caseRecord.caseId}`}>{caseRecord.caseId}</Link></td>
                <td>{caseRecord.caseName}</td>
                <td>{caseRecord.caseNumber}</td>
                <td>{caseRecord.status}</td>
                <td>{caseRecord.caseType}</td>
                <td>{caseRecord.caseCountry}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}
