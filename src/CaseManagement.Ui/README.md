# CaseManagement.Ui

Lightweight React + Vite + TypeScript UI for the Case Management API.

## Implemented scope
- App shell with persistent header title: `Case Management App`
- Persistent left navigation with routes for Companies, Beneficiaries, and Cases
- Companies: list, detail, create
- Beneficiaries: list (company-filtered), detail, create
- Cases: list (company -> beneficiary dependent filters), detail, create
- API integration against existing endpoints:
  - `/api/Company`
  - `/api/Beneficiary`
  - `/api/CaseRecord`
  - `/api/CaseRecord/beneficiary/{beneficiaryId}`

## UX behavior
- Loading, empty, error, and not-found states
- Client-side validation for required fields and email/ID checks
- Success feedback after create flows

## Configuration
Create `.env` from `.env.example`:

`VITE_API_BASE_URL=http://localhost:5152`

## Run
1. `npm install`
2. `npm run dev`

## Out of scope
- Authentication and authorization
- Edit and delete UI workflows
- Advanced filtering/paging/sorting/search
- Backend API contract changes

## Visual Studio solution visibility fallback
If the JavaScript project system is not installed in Visual Studio, the `.esproj` may not load. In that case, add `src/CaseManagement.Ui` as a solution folder/content-only node for visibility, and run the UI using terminal commands (`npm install`, `npm run dev`).
