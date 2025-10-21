import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import https from "@/services/https";

const FirstTimeCommissionSettings = () => {
  const [commissionRate, setCommissionRate] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchCommissionRate = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `${https.baseUrl}/admin/settings/first-time-commission`,
          {
            headers: { "x-auth-token": token },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch commission rate");
        }
        const data = await response.json();
        setCommissionRate(data.commission_amount);
      } catch (error) {
        console.error("Error fetching commission rate:", error);
        toast({
          title: "Error",
          description: "Failed to load commission rate.",
          variant: "destructive",
        });
      }
    };

    fetchCommissionRate();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${https.baseUrl}/admin/settings/first-time-commission`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": token,
          },
          body: JSON.stringify({
            commission_rate: parseFloat(commissionRate),
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.msg || "Failed to update commission rate");
      }

      toast({
        title: "Success",
        description: "First-time commission rate has been updated successfully.",
      });
    } catch (error) {
      console.error("Error updating commission rate:", error);
      toast({
        title: "Failed to Update",
        description:
          error.message ||
          "There was an error updating the rate. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">
        First-Time Commission Rate Settings
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        <div className="space-y-2">
          <Label htmlFor="commission_rate">Commission Rate (%)</Label>
          <Input
            id="commission_rate"
            type="number"
            value={commissionRate}
            onChange={(e) => setCommissionRate(e.target.value)}
            placeholder="e.g., 10"
          />
        </div>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : "Save Settings"}
        </Button>
      </form>
    </div>
  );
};

export default FirstTimeCommissionSettings;
