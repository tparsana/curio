"use client"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface ConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  description: string
}

export function ConfirmationModal({ isOpen, onClose, onConfirm, title, description }: ConfirmationModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-[#1f1f1f] border-[#272727]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription className="text-gray-400">{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex gap-2 sm:justify-end">
          <Button variant="outline" onClick={onClose} className="bg-transparent">
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              onConfirm()
              onClose()
            }}
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
