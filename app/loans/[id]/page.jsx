import LoanDetailPage from "../../../components/loan-detail-page"


export default async function LoanPage({ params }) {
  const resolvedParams = await params; // Await params as suggested by the error
  return <LoanDetailPage loanId={resolvedParams.id} />;
}
