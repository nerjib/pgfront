'use client'

import { useState, useEffect } from "react";
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
import { Checkbox } from "@/components/ui/checkbox";
import https from "@/services/https";
import { useToast } from "@/hooks/use-toast";
import { PlusCircle } from "lucide-react";
import { formatPermissionName } from "@/lib/utils";


export function RoleFormModal({ role, onSave }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [permissions, setPermissions] = useState([]);
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      if (role) {
        setName(role.name);
        setDescription(role.description);
      } else {
        setName("");
        setDescription("");
        setSelectedPermissions([]);
      }

      const fetchPermissions = async () => {
        try {
          const token = localStorage.getItem("token");
          const response = await fetch(`${https.baseUrl}/admin/roles/permissions`, {
            headers: { "x-auth-token": token },
          });
          if (!response.ok) {
            throw new Error("Failed to fetch permissions");
          }
          const data = await response.json();
          setPermissions(data);
        } catch (err) {
          console.error("Error fetching permissions:", err);
        }
      };

      const fetchRoleDetails = async () => {
        if (role) {
          try {
            const token = localStorage.getItem("token");
            const response = await fetch(`${https.baseUrl}/admin/roles/${role.id}`, {
              headers: { "x-auth-token": token },
            });
            if (!response.ok) {
              throw new Error("Failed to fetch role details");
            }
            const data = await response.json();
            setSelectedPermissions(data.permissions);
          } catch (err) {
            console.error("Error fetching role details:", err);
          }
        }
      };

      fetchPermissions();
      fetchRoleDetails();
    }
  }, [isOpen, role]);

  const handlePermissionChange = (permissionId) => {
    setSelectedPermissions((prev) =>
      prev.includes(permissionId)
        ? prev.filter((id) => id !== permissionId)
        : [...prev, permissionId]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const roleData = {
      name,
      description,
      permissions: selectedPermissions,
    };

    try {
      const token = localStorage.getItem("token");
      const url = role
        ? `${https.baseUrl}/admin/roles/${role.id}`
        : `${https.baseUrl}/admin/roles`;
      const method = role ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token,
        },
        body: JSON.stringify(roleData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to ${role ? 'update' : 'create'} role`);
      }

      toast({
        title: `Role ${role ? 'Updated' : 'Created'}`,
        description: `The role has been successfully ${role ? 'updated' : 'created'}.`,
      });
      setIsOpen(false);
      onSave();
    } catch (err) {
      setError(err.message);
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {role ? (
          <Button variant="outline" size="sm" className="mr-2">Edit</Button>
        ) : (
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Role
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{role ? "Edit Role" : "Create Role"}</DialogTitle>
          <DialogDescription>
            {role ? "Edit the role details below." : "Create a new role by filling out the details below."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">Name</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="col-span-3" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">Description</Label>
              <Input id="description" value={description} onChange={(e) => setDescription(e.target.value)} className="col-span-3" required />
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label className="text-right pt-2">Permissions</Label>
              <div className="col-span-3 space-y-2 max-h-60 overflow-y-auto">
                {permissions.map((permission) => (
                  <div key={permission.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`perm-${permission.id}`}
                      checked={selectedPermissions.includes(permission.id)}
                      onCheckedChange={() => handlePermissionChange(permission.id)}
                    />
                    <label htmlFor={`perm-${permission.id}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      {formatPermissionName(permission.name)}<br />
                      <label className="text-xs text-gray-500 italic ml-2">{permission.description}</label>
                    </label>
                    <br/>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <DialogFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}