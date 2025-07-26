import LoanDetailPage from "../../../components/loan-detail-page"

export default function LoanPage({ params }) {
  return <LoanDetailPage loanId={params.id} />
}
