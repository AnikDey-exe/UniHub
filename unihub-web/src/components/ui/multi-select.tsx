"use client"

import * as React from "react"
import { Check, ChevronDown } from "lucide-react"
import { cn } from "@/utils/cn"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

export interface MultiSelectOption<T = string> {
  label: string
  value: T
}

interface MultiSelectProps<T = string> {
  options: MultiSelectOption<T>[]
  selected: T[]
  onChange: (selected: T[]) => void
  placeholder?: string
  className?: string
  disabled?: boolean
}

export function MultiSelect<T = string>({
  options,
  selected,
  onChange,
  placeholder = "Select items...",
  className,
  disabled = false,
}: MultiSelectProps<T>) {
  const [open, setOpen] = React.useState(false)

  const handleToggle = (value: T) => {
    if (selected.includes(value)) {
      const newSelected = selected.filter(item => item !== value)
      onChange(newSelected)
    } else {
      const newSelected = [...selected, value]
      onChange(newSelected)
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full justify-between",
            selected.length > 0 && "text-muted-foreground",
            className
          )}
          disabled={disabled}
        >
          <div className="flex gap-1 items-center min-w-0 flex-1">
            {selected.length > 0 ? (
              <>
                {selected.slice(0, 1).map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-1 px-2 py-1 bg-primary text-primary-foreground rounded-md text-xs flex-shrink-0"
                  >
                    {options.find((option) => option.value === item)?.label}
                    <button
                      className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          onChange(selected.filter((i) => i !== item))
                        }
                      }}
                      onMouseDown={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                      }}
                      onClick={() => {
                        const newSelected = selected.filter((i) => i !== item)
                        onChange(newSelected)
                      }}
                    >
                      <Check className="h-3 w-3" />
                    </button>
                  </div>
                ))}
                {selected.length > 1 && (
                  <div className="flex items-center px-2 py-1 bg-muted text-muted-foreground rounded-md text-xs flex-shrink-0">
                    +{selected.length - 1} more
                  </div>
                )}
              </>
            ) : (
              <span className="truncate text-muted-foreground">{placeholder}</span>
            )}
          </div>
          <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <div className="max-h-60 overflow-auto">
          {options.length === 0 ? (
            <div className="py-6 text-center text-sm text-muted-foreground">
              No options available
            </div>
          ) : (
            <div className="p-1">
              {selected.length > 0 && (
                <div className="flex justify-end p-2 border-b">
                  <button
                    className="text-xs px-3 py-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      onChange([])
                    }}
                  >
                    Clear all
                  </button>
                </div>
              )}
              {options.map((option, index) => (
                <div
                  key={index}
                  className={cn(
                    "flex items-center space-x-3 rounded-sm px-3 py-2 text-sm cursor-pointer transition-colors",
                    "hover:bg-accent hover:text-accent-foreground"
                  )}
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    handleToggle(option.value)
                  }}
                >
                  <div className={cn(
                    "flex items-center justify-center w-4 h-4 border rounded-sm transition-colors",
                    selected.includes(option.value)
                      ? "bg-primary border-primary text-primary-foreground"
                      : "border-input"
                  )}>
                    {selected.includes(option.value) && (
                      <Check className="h-3 w-3" />
                    )}
                  </div>
                  <span className="flex-1">{option.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}
