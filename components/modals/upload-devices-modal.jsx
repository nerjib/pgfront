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
import { UploadCloud, File } from "lucide-react";
import https from "@/services/https";
import { toast } from "@/hooks/use-toast";

export function UploadDevicesModal({ onUploadComplete }) {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      toast({ title: "No file selected", description: "Please select an Excel or CSV file to upload.", variant: "destructive" });
      return;
    }

    setIsLoading(true);
    const formData = new FormData();
    formData.append("excelFile", file);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${https.baseUrl}/devices/upload-excel`, {
        method: "POST",
        headers: {
          // Note: Content-Type is not set here, the browser will set it automatically for multipart/form-data
          "x-auth-token": token,
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.msg || "Failed to upload devices");
      }

      toast({ title: "Upload Successful", description: data.msg || "Devices have been uploaded successfully." });
      setOpen(false);
      if (onUploadComplete) {
        onUploadComplete();
      }
    } catch (error) {
      console.error("Error uploading devices:", error);
      toast({ title: "Upload Failed", description: error.message, variant: "destructive" });
    } finally {
      setIsLoading(false);
      setFile(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <UploadCloud className="mr-2 h-4 w-4" />
          Upload Excel
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Upload Devices from Excel</DialogTitle>
          <DialogDescription>
            Select an Excel (.xlsx) or CSV (.csv) file to bulk upload devices.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="file-upload">File</Label>
              <Input id="file-upload" type="file" onChange={handleFileChange} accept=".xlsx, .xls, .csv" />
            </div>
            <div className="text-sm text-muted-foreground">
              <a href="/device_upload_template.xls" download className="underline flex items-center">
                <File className="mr-2 h-4 w-4" />
                Download Template File
              </a>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={isLoading || !file}>
              {isLoading ? "Uploading..." : "Upload"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
