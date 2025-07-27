"use client"

import * as React from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  className?: string
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children, className }) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className={cn(
        "relative z-10 max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden",
        className
      )}>
        {/* Close Button */}
        <Button
          onClick={onClose}
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4 z-20 h-10 w-10 rounded-full bg-black/50 text-white hover:bg-black/70"
        >
          <X className="h-5 w-5" />
          <span className="sr-only">Close</span>
        </Button>
        
        {children}
      </div>
    </div>
  )
}

export { Modal } 