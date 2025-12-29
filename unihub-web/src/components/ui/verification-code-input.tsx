'use client'

import { useRef, useState, KeyboardEvent, ChangeEvent } from 'react'
import { Input } from './input'
import { cn } from '@/utils/cn'

interface VerificationCodeInputProps {
  length?: number
  onComplete: (code: string) => void
  error?: boolean
  className?: string
}

export function VerificationCodeInput({ 
  length = 6, 
  onComplete, 
  error = false,
  className 
}: VerificationCodeInputProps) {
  const [codes, setCodes] = useState<string[]>(Array(length).fill(''))
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  const handleChange = (index: number, value: string) => {
    // Only allow numbers
    const numericValue = value.replace(/\D/g, '')
    
    if (numericValue.length > 1) {
      // Handle paste
      const pastedCodes = numericValue.slice(0, length).split('')
      const newCodes = [...codes]
      
      pastedCodes.forEach((code, i) => {
        if (index + i < length) {
          newCodes[index + i] = code
        }
      })
      
      setCodes(newCodes)
      
      // Focus the last filled input or the next empty one
      const nextIndex = Math.min(index + pastedCodes.length, length - 1)
      inputRefs.current[nextIndex]?.focus()
      
      // Check if all codes are filled
      if (newCodes.every(code => code !== '')) {
        onComplete(newCodes.join(''))
      }
      return
    }

    const newCodes = [...codes]
    newCodes[index] = numericValue
    setCodes(newCodes)

    // Auto-advance to next input
    if (numericValue && index < length - 1) {
      inputRefs.current[index + 1]?.focus()
    }

    // Check if all codes are filled
    if (newCodes.every(code => code !== '')) {
      onComplete(newCodes.join(''))
    }
  }

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !codes[index] && index > 0) {
      // Move to previous input on backspace if current is empty
      inputRefs.current[index - 1]?.focus()
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus()
    } else if (e.key === 'ArrowRight' && index < length - 1) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '')
    
    if (pastedData.length > 0) {
      const pastedCodes = pastedData.slice(0, length).split('')
      const newCodes = [...codes]
      
      pastedCodes.forEach((code, i) => {
        if (i < length) {
          newCodes[i] = code
        }
      })
      
      setCodes(newCodes)
      
      // Focus the last filled input
      const lastIndex = Math.min(pastedCodes.length - 1, length - 1)
      inputRefs.current[lastIndex]?.focus()
      
      // Check if all codes are filled
      if (newCodes.every(code => code !== '')) {
        onComplete(newCodes.join(''))
      }
    }
  }

  return (
    <div className={cn("flex gap-2 justify-center", className)}>
      {Array.from({ length }).map((_, index) => (
        <Input
          key={index}
          ref={(el) => { inputRefs.current[index] = el }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={codes[index]}
          onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange(index, e.target.value)}
          onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          className={cn(
            "w-12 h-14 text-center text-2xl font-semibold p-0",
            error && "border-destructive focus-visible:ring-destructive"
          )}
        />
      ))}
    </div>
  )
}

