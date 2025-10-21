"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DollarSign } from "lucide-react";
import https from "@/services/https";
import { toast } from "@/hooks/use-toast";

export function AddCreditModal({ userId, userType, onCreditAdded }) {
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const endpoint = `/admin/add-credit`;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${https.baseUrl}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token,
        },
        body: JSON.stringify({ amount: parseFloat(amount), user_id: userId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.msg || `Failed to add credit to ${userType}`);
      }

      toast({ title: "Success", description: `Credit added successfully to ${userType}.` });
      setOpen(false);
      setAmount("");
      if (onCreditAdded) {
        onCreditAdded();
      }
    } catch (error) {
      console.error(`Error adding credit to ${userType}:`, error);
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <DollarSign className="mr-2 h-4 w-4" />
          Add Credit
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Credit</DialogTitle>
          <DialogDescription>
            Enter the amount of credit to add to this {userType}.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount (NGN)</Label>
              <Input 
                id="amount" 
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="e.g., 50000"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={isLoading || !amount}>
              {isLoading ? "Adding..." : "Add Credit"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
