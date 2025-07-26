"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Command, CommandInput, CommandEmpty, CommandGroup, CommandItem } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Check, ChevronsUpDown, Plus } from "lucide-react"
import { cn } from "@/lib/utils"
import https from "@/services/https";
import { toast } from "@/hooks/use-toast";

export function AddLoanModal({ onLoanAdded }) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [devices, setDevices] = useState([]);
  const [agents, setAgents] = useState([]);
  const [formData, setFormData] = useState({
    customer_id: "",
    device_id: "",
    device_price: "",
    term_months: "",
    down_payment: "0",
    guarantor_details: "",
    agent_id: "",
  });

  useEffect(() => {
    const selectedDevice = devices.find(device => device.id === formData.device_id);
    if (selectedDevice) {
      setFormData(prev => ({ ...prev, device_price: selectedDevice.price }));
    }
  }, [formData.device_id, devices]);

  useEffect(() => {
    const fetchCustomersAndDevices = async () => {
      try {
        const token = localStorage.getItem("token");
        const [customersRes, devicesRes, agentsRes] = await Promise.all([
          fetch(`${https.baseUrl}/customers`, { headers: { "x-auth-token": token } }),
          fetch(`${https.baseUrl}/devices`, { headers: { "x-auth-token": token } }),
          fetch(`${https.baseUrl}/agents`, { headers: { "x-auth-token": token } }),
        ]);

        if (!customersRes.ok) throw new Error("Failed to fetch customers");
        if (!devicesRes.ok) throw new Error("Failed to fetch devices");
        if (!agentsRes.ok) throw new Error("Failed to fetch agents");

        const customersData = await customersRes.json();
        const devicesData = await devicesRes.json();
        const agentsData = await agentsRes.json();

        setCustomers(customersData);
        setDevices(devicesData);
        setAgents(agentsData);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast({
          title: "Error",
          description: "Failed to load customers, devices, or agents.",
          variant: "destructive",
        });
      }
    };

    if (open) {
      fetchCustomersAndDevices();
    }
  }, [open]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${https.baseUrl}/loans`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token,
        },
        body: JSON.stringify({
          ...formData,
          device_price: parseFloat(formData.device_price),
          term_months: parseInt(formData.term_months),
          down_payment: parseFloat(formData.down_payment),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.msg || "Failed to add loan");
      }

      toast({
        title: "Loan Added",
        description: "New loan has been added successfully.",
      });
      setOpen(false);
      setFormData({
        customer_id: "",
        device_id: "",
        device_price: "",
        term_months: "",
        down_payment: "0",
        guarantor_details: "",
      });
      if (onLoanAdded) {
        onLoanAdded();
      }
    } catch (error) {
      console.error("Error adding loan:", error);
      toast({
        title: "Failed to Add Loan",
        description: error.message || "There was an error adding the loan. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Loan
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add New Loan</DialogTitle>
          <DialogDescription>Fill in the details for the new loan.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4 max-h-[500px] overflow-y-auto">
            <div className="space-y-2">
              <Label htmlFor="customer_id">Customer *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    className="w-full justify-between"
                  >
                    {formData.customer_id
                      ? customers.find((customer) => customer.id === formData.customer_id)?.name
                      : "Select customer..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                  <Command>
                    <CommandInput placeholder="Search customer..." />
                    <CommandEmpty>No customer found.</CommandEmpty>
                    <CommandGroup>
                      {customers.map((customer) => (
                        <CommandItem
                          key={customer.id}
                          value={customer.name}
                          onSelect={() => {
                            handleInputChange("customer_id", customer.id);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              formData.customer_id === customer.id
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          {customer.name} ({customer.id})
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="device_id">Device *</Label>
              <Select
                value={formData.device_id}
                onValueChange={(value) => handleInputChange("device_id", value)}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a device" />
                </SelectTrigger>
                <SelectContent>
                  {devices.map((device) => (
                    <SelectItem key={device.id} value={device.id}>
                      {device.serialNumber} ({device.type} - {device.model})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="device_price">Device Price (NGN) *</Label>
                <Input
                  id="device_price"
                  type="number"
                  value={formData.device_price}
                  onChange={(e) => handleInputChange("device_price", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="term_months">Term (Months) *</Label>
                <Input
                  id="term_months"
                  type="number"
                  value={formData.term_months}
                  onChange={(e) => handleInputChange("term_months", e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="down_payment">Down Payment (NGN)</Label>
              <Input
                id="down_payment"
                type="number"
                value={formData.down_payment}
                onChange={(e) => handleInputChange("down_payment", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="guarantor_details">Guarantor Details</Label>
              <Input
                id="guarantor_details"
                value={formData.guarantor_details}
                onChange={(e) => handleInputChange("guarantor_details", e.target.value)}
                placeholder="Name, Phone, etc."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="agent_id">Assigned Agent</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    className="w-full justify-between"
                  >
                    {formData.agent_id
                      ? agents.find((agent) => agent.id === formData.agent_id)?.username
                      : "Select an agent"}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                  <Command>
                    <CommandInput placeholder="Search agent..." />
                    <CommandEmpty>No agent found.</CommandEmpty>
                    <CommandGroup>
                      {agents.map((agent) => (
                        <CommandItem
                          key={agent.id}
                          value={agent.username}
                          onSelect={() => {
                            handleInputChange("agent_id", agent.id);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              formData.agent_id === agent.id
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          {agent.name}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Adding..." : "Add Loan"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
