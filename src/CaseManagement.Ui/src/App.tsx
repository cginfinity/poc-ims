import { Navigate, Route, Routes } from 'react-router-dom';
import { AppLayout } from './components/AppLayout';
import { CompanyListPage } from './pages/companies/CompanyListPage';
import { CompanyDetailPage } from './pages/companies/CompanyDetailPage';
import { CompanyCreatePage } from './pages/companies/CompanyCreatePage';
import { BeneficiaryListPage } from './pages/beneficiaries/BeneficiaryListPage';
import { BeneficiaryDetailPage } from './pages/beneficiaries/BeneficiaryDetailPage';
import { BeneficiaryCreatePage } from './pages/beneficiaries/BeneficiaryCreatePage';
import { CaseListPage } from './pages/cases/CaseListPage';
import { CaseDetailPage } from './pages/cases/CaseDetailPage';
import { CaseCreatePage } from './pages/cases/CaseCreatePage';

export default function App(): JSX.Element {
  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        <Route index element={<Navigate to="/companies" replace />} />

        <Route path="companies">
          <Route index element={<CompanyListPage />} />
          <Route path=":id" element={<CompanyDetailPage />} />
          <Route path="new" element={<CompanyCreatePage />} />
        </Route>

        <Route path="beneficiaries">
          <Route index element={<BeneficiaryListPage />} />
          <Route path=":id" element={<BeneficiaryDetailPage />} />
          <Route path="new" element={<BeneficiaryCreatePage />} />
        </Route>

        <Route path="cases">
          <Route index element={<CaseListPage />} />
          <Route path=":id" element={<CaseDetailPage />} />
          <Route path="new" element={<CaseCreatePage />} />
        </Route>
      </Route>
    </Routes>
  );
}
