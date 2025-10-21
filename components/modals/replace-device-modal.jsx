"use client"

import { useState } from "react"
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
import https from "@/services/https"
import { Recycle } from "lucide-react"

export function ReplaceDeviceModal({ oldDeviceId, onDeviceReplaced }) {
  const [open, setOpen] = useState(false)
  const [newDeviceSerialNumber, setNewDeviceSerialNumber] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    const payload = {
      old_device_id: oldDeviceId,
      new_device_serial_number: newDeviceSerialNumber,
    }

    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`${https.baseUrl}/devices/replace`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token,
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.msg || "Failed to replace device")
      }

      alert("Device replaced successfully!")
      if (onDeviceReplaced) {
        onDeviceReplaced()
      }
      setOpen(false)
      setNewDeviceSerialNumber("")
    } catch (error) {
      console.error("Error replacing device:", error)
      alert(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Recycle className="mr-2 h-4 w-4" />
          Replace Device
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Replace Device</DialogTitle>
          <DialogDescription>
            Enter the serial number of the new device to replace the old one.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="old_device_id" className="text-right">
                Old Device ID
              </Label>
              <Input id="old_device_id" value={oldDeviceId} className="col-span-3" disabled />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="new_serial_number" className="text-right">
                New Serial Number
              </Label>
              <Input
                id="new_serial_number"
                value={newDeviceSerialNumber}
                onChange={(e) => setNewDeviceSerialNumber(e.target.value)}
                className="col-span-3"
                placeholder="Enter new device serial number"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Replacing..." : "Replace Device"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
