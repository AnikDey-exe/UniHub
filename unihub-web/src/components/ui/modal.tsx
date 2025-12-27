"use client"

import * as React from "react"
import * as VisuallyHidden from "@radix-ui/react-visually-hidden"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"

interface ModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  children: React.ReactNode
  className?: string
  title?: string
}

export function Modal({ open, onOpenChange, children, className, title }: ModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={className}>
        {title ? (
          <DialogTitle>{title}</DialogTitle>
        ) : (
          <VisuallyHidden.Root asChild>
            <DialogTitle>Modal</DialogTitle>
          </VisuallyHidden.Root>
        )}
        {children}
      </DialogContent>
    </Dialog>
  )
}

