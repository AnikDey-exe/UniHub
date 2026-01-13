"use client"

import { useState, useEffect } from "react"
import { Modal } from "@/components/ui/modal"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { User } from "@/types/responses"

interface RegistrationModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user: User | undefined | null
  onSubmit: (displayName: string, tickets: number) => void
  isPending: boolean
}

export function RegistrationModal({
  open,
  onOpenChange,
  user,
  onSubmit,
  isPending,
}: RegistrationModalProps) {
  const [displayName, setDisplayName] = useState("")
  const [tickets, setTickets] = useState("1")

  // Set default display name when modal opens or user changes
  useEffect(() => {
    if (open && user) {
      const defaultName = `${user.firstName} ${user.lastName}`.trim()
      setDisplayName(defaultName)
    }
  }, [open, user])

  // Reset form when modal closes
  useEffect(() => {
    if (!open) {
      setDisplayName("")
      setTickets("1")
    }
  }, [open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const ticketsNumber = Number(tickets) || 1
    if (displayName.trim() && ticketsNumber > 0) {
      onSubmit(displayName.trim(), ticketsNumber)
    }
  }

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Register for Event"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="displayName">Display Name</Label>
          <Input
            id="displayName"
            type="text"
            placeholder="Enter your display name"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            required
            disabled={isPending}
          />
          <p className="text-sm text-muted-foreground">
            This name will be shown to event organizers
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="tickets">Number of Tickets</Label>
          <Input
            id="tickets"
            type="number"
            min="1"
            placeholder="1"
            value={tickets}
            onChange={(e) => {
              const inputValue = e.target.value
              // Allow empty string while typing
              if (inputValue === "") {
                setTickets("")
                return
              }
              // Only allow positive integers
              const numValue = parseInt(inputValue, 10)
              if (!isNaN(numValue) && numValue > 0) {
                setTickets(inputValue)
              }
            }}
            onBlur={(e) => {
              // Ensure we have a valid value on blur
              const numValue = parseInt(e.target.value, 10)
              if (isNaN(numValue) || numValue < 1) {
                setTickets("1")
              }
            }}
            required
            disabled={isPending}
          />
        </div>

        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isPending || !displayName.trim() || !tickets || parseInt(tickets, 10) < 1}
          >
            {isPending ? "Registering..." : "Register"}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
