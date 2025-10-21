'use client'

import { useState, useEffect } from "react";
import https from "@/services/https";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { RoleFormModal } from "./modals/role-form-modal";
import { DeleteRoleAlert } from "./alerts/delete-role-alert";

export default function RolesPage() {
  const [roles, setRoles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchRoles = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${https.baseUrl}/admin/roles`, {
        headers: {
          "x-auth-token": token,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch roles");
      }
      const data = await response.json();
      setRoles(data);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching roles:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  if (isLoading) {
    return <div>Loading roles...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Roles and Permissions</h1>
          <p className="text-muted-foreground">Manage user roles and their permissions.</p>
        </div>
        <RoleFormModal onSave={fetchRoles} />
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Roles</CardTitle>
          <CardDescription>A list of all the roles in your organization.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {roles?.filter(e => e.name !== 'Agent' && e.name !== 'Super Agent' && e.name !== 'Customer' && e.name !== 'Business Admin').map((role) => (
                <TableRow key={role.id}>
                  <TableCell>{role.name}</TableCell>
                  <TableCell>{role.description}</TableCell>
                  <TableCell>
                    <RoleFormModal role={role} onSave={fetchRoles} />
                    <DeleteRoleAlert roleId={role.id} onDeleted={fetchRoles} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
