import { Suspense } from 'react';
import PaymentStatusContent from '../../../components/PaymentStatusContent';

export default function PaymentStatusPage() {
  return (
    <Suspense fallback={<div>Loading payment status...</div>}>
      <PaymentStatusContent />
    </Suspense>
  );
}
