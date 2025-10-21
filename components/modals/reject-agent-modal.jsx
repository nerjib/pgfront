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
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import https from "@/services/https"
import Swal from "sweetalert2"

export function RejectAgentModal({ agent, onAgentRejected }) {
  const [open, setOpen] = useState(false)
  const [reason, setReason] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`${https.baseUrl}/admin/agents/${agent.id}/approval`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token,
        },
        body: JSON.stringify({ status: "rejected", reason }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.msg || "Failed to reject agent")
      }

      Swal.fire("Agent rejected successfully")
      if (onAgentRejected) {
        onAgentRejected()
      }
      setOpen(false)
      setReason("")
    } catch (error) {
      console.error("Error rejecting agent:", error)
      alert(error.message)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">Reject</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Reject Agent</DialogTitle>
          <DialogDescription>
            Provide a reason for rejecting this agent.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="reason" className="text-right pt-2">
                Reason
              </Label>
              <div className="col-span-3">
                <Textarea
                  id="reason"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Reason for rejection"
                  required
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Reject Agent</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}