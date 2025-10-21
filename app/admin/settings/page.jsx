"use client";

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import https from '@/services/https';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import FirstTimeCommissionSettings from "@/components/FirstTimeCommissionSettings";

const CommissionSettings = () => {
  const [commissionRates, setCommissionRates] = useState({
    general_agent_commission_rate: '',
    general_super_agent_commission_rate: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchCommissionRates = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${https.baseUrl}/admin/settings/commission`, {
          headers: { 'x-auth-token': token },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch commission rates');
        }
        const data = await response.json();
        setCommissionRates(data);
      } catch (error) {
        console.error('Error fetching commission rates:', error);
        toast({
          title: 'Error',
          description: 'Failed to load commission rates.',
          variant: 'destructive',
        });
      }
    };

    fetchCommissionRates();
  }, []);

  const handleInputChange = (field, value) => {
    setCommissionRates((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${https.baseUrl}/admin/settings/commission`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token,
        },
        body: JSON.stringify({
          agent_rate: parseFloat(commissionRates.general_agent_commission_rate),
          super_agent_rate: parseFloat(commissionRates.general_super_agent_commission_rate),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.msg || 'Failed to update commission rates');
      }

      toast({
        title: 'Success',
        description: 'General commission rates have been updated successfully.',
      });
    } catch (error) {
      console.error('Error updating commission rates:', error);
      toast({
        title: 'Failed to Update',
        description: error.message || 'There was an error updating the rates. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">General Commission Rate Settings</h2>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        <div className="space-y-2">
          <Label htmlFor="agent_rate">Agent Commission Rate (%)</Label>
          <Input
            id="agent_rate"
            type="number"
            value={commissionRates.general_agent_commission_rate}
            onChange={(e) => handleInputChange('general_agent_commission_rate', e.target.value)}
            placeholder="e.g., 5"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="super_agent_rate">Super Agent Commission Rate (%)</Label>
          <Input
            id="super_agent_rate"
            type="number"
            value={commissionRates.general_super_agent_commission_rate}
            onChange={(e) => handleInputChange('general_super_agent_commission_rate', e.target.value)}
            placeholder="e.g., 2"
          />
        </div>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Save Settings'}
        </Button>
      </form>
    </div>
  );
};

const CreateAdminUserForm = ({ onFinished }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role_id: '',
    phone_number: '',
    state: '',
    city: '',
    address: '',
    landmark: '',
    gps: '',
    name: '',
  });
  const [roles, setRoles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${https.baseUrl}/admin/roles`, {
          headers: { 'x-auth-token': token },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch roles');
        }
        const data = await response.json();
        setRoles(data); // Assuming the API returns an array of role objects
      } catch (error) {
        console.error('Error fetching roles:', error);
        toast({
          title: 'Error',
          description: 'Failed to load roles. Please try again.',
          variant: 'destructive',
        });
      }
    };

    fetchRoles();
  }, []);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleRoleChange = (value) => {
    setFormData((prev) => ({ ...prev, role_id: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${https.baseUrl}/auth/register-admin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.msg || 'Failed to create admin user');
      }

      toast({
        title: 'Success',
        description: 'Admin user has been created successfully.',
      });
      onFinished(); // Close the dialog
    } catch (error) {
      toast({
        title: 'Failed to Create User',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {Object.keys(formData).map((key) => (
        key !== 'role_id' ? (
          <div className="space-y-2" key={key}>
            <Label htmlFor={key}>{key.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</Label>
            <Input
              id={key}
              type={key === 'password' ? 'password' : 'text'}
              value={formData[key]}
              onChange={handleInputChange}
              required
            />
          </div>
        ) : null
      ))}
      <div className="space-y-2 md:col-span-2">
        <Label htmlFor="role_id">Role</Label>
        <Select onValueChange={handleRoleChange} value={formData.role_id} required>
          <SelectTrigger>
            <SelectValue placeholder="Select a role" />
          </SelectTrigger>
          <SelectContent>
            {roles.map(role => (
              <SelectItem key={role.id} value={role.id}>{role.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <DialogFooter className="md:col-span-2">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Creating...' : 'Create User'}
        </Button>
      </DialogFooter>
    </form>
  );
};

const AdminUsersTable = ({ users }) => {
  if (users.length === 0) {
    return <p>No web users found.</p>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Username</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Phone</TableHead>
          <TableHead>Role</TableHead>

        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id}>
            <TableCell>{user.name}</TableCell>
            <TableCell>{user.username}</TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell>{user.phone_number}</TableCell>
            <TableCell>{user.rolename}</TableCell>

          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

const AdminUsersTab = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAdminUsers = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${https.baseUrl}/users/admin`, {
          headers: { 'x-auth-token': token },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch web users');
        }
        const data = await response.json();
        setUsers(data);
      } catch (err) {
        setError(err.message);
        toast({
          title: 'Error',
          description: 'Failed to load web users.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchAdminUsers();
  }, [isDialogOpen]); // Refetch when dialog is closed

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Web Users</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>Create New Web User</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Create New Web User</DialogTitle>
              <DialogDescription>
                Fill in the details below to create a new admin user.
              </DialogDescription>
            </DialogHeader>
            <CreateAdminUserForm onFinished={() => setIsDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>
      {isLoading ? (
        <p>Loading users...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <AdminUsersTable users={users} />
      )}
    </div>
  );
};

export default function SettingsPage() {
  const router = useRouter();

  const handleTabChange = (value) => {
    if (value === 'roles') {
      router.push('/admin/roles');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Settings</h1>
      <Tabs defaultValue="commission" className="w-full" onValueChange={handleTabChange}>
        <TabsList>
          <TabsTrigger value="commission">Commission</TabsTrigger>
          <TabsTrigger value="first-time-commission">First-Time Commission</TabsTrigger>
          <TabsTrigger value="roles">Roles & Permissions</TabsTrigger>
          <TabsTrigger value="admins">Web Users</TabsTrigger>
        </TabsList>
        <TabsContent value="commission">
          <CommissionSettings />
        </TabsContent>
        <TabsContent value="first-time-commission">
          <FirstTimeCommissionSettings />
        </TabsContent>
        <TabsContent value="admins">
          <AdminUsersTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}