'use client'

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import https from "@/services/https";
import { ReconcileCreditModal } from './modals/reconcile-credit-modal';

export default function CreditSummary({ userId, userType }) {
  const [summary, setSummary] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCreditSummary = useCallback(async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${https.baseUrl}/admin/agent/${userId}/credit-summary`, {
        headers: {
          "x-auth-token": token,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch credit summary");
      }
      const data = await response.json();
      setSummary(data);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching credit summary:", err);
    } finally {
      setIsLoading(false);
    }
  }, [userId, userType]);

  useEffect(() => {
    if (userId) {
      fetchCreditSummary();
    }
  }, [userId, fetchCreditSummary]);

  if (isLoading) {
    return <div>Loading credit summary...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!summary) {
    return <p>No credit summary available.</p>;
  }

  const totalOutstanding = summary.total_credit_spent_on_payments - summary.total_credit_reconciled;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Credit Summary</CardTitle>
        <ReconcileCreditModal userId={userId} onReconciled={fetchCreditSummary} />
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="border p-4 rounded-lg">
            <p className="text-muted-foreground">Total Credit Added</p>
            <p className="text-2xl font-bold">NGN {summary.total_credit_added?.toLocaleString() || '0.00'}</p>
          </div>
          <div className="border p-4 rounded-lg">
            <p className="text-muted-foreground">Total Credit Spent on Payments</p>
            <p className="text-2xl font-bold">NGN {summary.total_credit_spent_on_payments?.toLocaleString() || '0.00'}</p>
          </div>
          <div className="border p-4 rounded-lg">
            <p className="text-muted-foreground">Total Credit Reconciled</p>
            <p className="text-2xl font-bold">NGN {summary.total_credit_reconciled?.toLocaleString() || '0.00'}</p>
          </div>
          <div className="border p-4 rounded-lg">
            <p className="text-muted-foreground">Current Credit Balance</p>
            <p className="text-2xl font-bold">NGN {summary.current_credit_balance?.toLocaleString() || '0.00'}</p>
          </div>
          {/* <div className="border p-4 rounded-lg">
            <p className="text-muted-foreground">Total Outstanding</p>
            <p className="text-2xl font-bold">NGN {totalOutstanding?.toLocaleString() || '0.00'}</p>
          </div> */}
        </div>
      </CardContent>
    </Card>
  );
}