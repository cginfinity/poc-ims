import { useEffect, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { ApiError } from '../../api/client';
import { getBeneficiary } from '../../api/beneficiaryApi';
import { getCaseRecordsByBeneficiaryId } from '../../api/caseRecordApi';
import type { Beneficiary, CaseRecord } from '../../types';
import { StatusView } from '../../components/StatusView';

export function BeneficiaryDetailPage(): JSX.Element {
  const { id } = useParams();
  const location = useLocation();
  const successMessage = (location.state as { success?: string } | null)?.success;
  const [beneficiary, setBeneficiary] = useState<Beneficiary | null>(null);
  const [cases, setCases] = useState<CaseRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [casesLoading, setCasesLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [casesError, setCasesError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const beneficiaryId = Number(id);
    if (!Number.isInteger(beneficiaryId)) {
      setLoading(false);
      setError('Invalid beneficiary id.');
      return;
    }

    const load = async (): Promise<void> => {
      try {
        setLoading(true);
        setCasesLoading(true);
        setError(null);
        setCasesError(null);
        setNotFound(false);

        const data = await getBeneficiary(beneficiaryId);
        setBeneficiary(data);

        try {
          const caseData = await getCaseRecordsByBeneficiaryId(beneficiaryId);
          setCases(caseData);
        } catch (caseErr) {
          setCasesError(caseErr instanceof Error ? caseErr.message : 'Failed to load cases');
          setCases([]);
        } finally {
          setCasesLoading(false);
        }
      } catch (err) {
        if (err instanceof ApiError && err.status === 404) {
          setNotFound(true);
          return;
        }

        setError(err instanceof Error ? err.message : 'Failed to load beneficiary');
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, [id]);

  return (
    <section>
      <h1>Beneficiary Details</h1>
      <p><Link to="/beneficiaries">Back to Beneficiaries</Link></p>
      {successMessage && <StatusView text={successMessage} />}

      {loading && <StatusView text="Loading beneficiary..." />}
      {!loading && notFound && <StatusView text="Beneficiary not found." tone="error" />}
      {error && <StatusView text={error} tone="error" />}

      {!loading && !error && beneficiary && (
        <>
          <dl className="detail-grid">
            <dt>ID</dt><dd>{beneficiary.id}</dd>
            <dt>Name</dt><dd>{beneficiary.firstName} {beneficiary.lastName}</dd>
            <dt>Email</dt><dd>{beneficiary.email}</dd>
            <dt>Phone</dt><dd>{beneficiary.phone}</dd>
            <dt>External ID</dt><dd>{beneficiary.externalId}</dd>
            <dt>Company ID</dt><dd>{beneficiary.companyId}</dd>
            <dt>Active</dt><dd>{beneficiary.isActive ? 'Yes' : 'No'}</dd>
          </dl>
          <h2>Cases</h2>
          {casesLoading && <StatusView text="Loading cases..." />}
          {casesError && <StatusView text={casesError} tone="error" />}
          {!casesLoading && !casesError && cases.length === 0 && <StatusView text="No cases found for this beneficiary." />}

          {!casesLoading && !casesError && cases.length > 0 && (
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


        </>
      )}
    </section>
  );
}
