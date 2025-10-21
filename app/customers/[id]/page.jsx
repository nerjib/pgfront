import CustomerDetailPage from "../../../components/customer-detail-page"

export default function CustomerPage({ params }) {
  return <CustomerDetailPage customerId={params.id} />
}
