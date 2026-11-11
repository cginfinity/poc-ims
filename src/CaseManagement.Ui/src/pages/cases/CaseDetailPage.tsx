import { useEffect, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { ApiError } from '../../api/client';
import { getCaseRecord } from '../../api/caseRecordApi';
import type { CaseRecord } from '../../types';
import { StatusView } from '../../components/StatusView';

export function CaseDetailPage(): JSX.Element {
  const { id } = useParams();
  const location = useLocation();
  const successMessage = (location.state as { success?: string } | null)?.success;
  const [caseRecord, setCaseRecord] = useState<CaseRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const caseId = Number(id);
    if (!Number.isInteger(caseId)) {
      setLoading(false);
      setError('Invalid case id.');
      return;
    }

    const load = async (): Promise<void> => {
      try {
        setLoading(true);
        setError(null);
        setNotFound(false);
        const data = await getCaseRecord(caseId);
        setCaseRecord(data);
      } catch (err) {
        if (err instanceof ApiError && err.status === 404) {
          setNotFound(true);
          return;
        }

        setError(err instanceof Error ? err.message : 'Failed to load case');
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, [id]);

  return (
    <section>
      <h1>Case Details</h1>
      <p><Link to="/cases">Back to Cases</Link></p>
      {successMessage && <StatusView text={successMessage} />}

      {loading && <StatusView text="Loading case..." />}
      {!loading && notFound && <StatusView text="Case not found." tone="error" />}
      {error && <StatusView text={error} tone="error" />}

      {!loading && !error && caseRecord && (
        <dl className="detail-grid">
          <dt>Case ID</dt><dd>{caseRecord.caseId}</dd>
          <dt>Beneficiary ID</dt><dd>{caseRecord.beneficiaryId}</dd>
          <dt>Case Name</dt><dd>{caseRecord.caseName}</dd>
          <dt>Case Number</dt><dd>{caseRecord.caseNumber}</dd>
          <dt>Status</dt><dd>{caseRecord.status}</dd>
          <dt>Type</dt><dd>{caseRecord.caseType}</dd>
          <dt>Country</dt><dd>{caseRecord.caseCountry}</dd>
        </dl>
      )}
    </section>
  );
}
