"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useCurrentUser } from "@/context/user-context"
import { useCreateEvent } from "@/hooks/use-create-event"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { PageLoading } from "@/components/ui/loading"
import { EventCreateRequest } from "@/types/requests"
import { EVENT_TYPE_OPTIONS } from "@/types/event-types"
import { DateTimePicker } from '@mantine/dates'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import '@mantine/core/styles.css'
import '@mantine/dates/styles.css'

dayjs.extend(utc)

const TIMEZONE_OPTIONS = [
  { value: 'EST', label: 'EST' },
  { value: 'PST', label: 'PST' },
  { value: 'CST', label: 'CST' },
  { value: 'MST', label: 'MST' },
  { value: 'UTC', label: 'UTC' },
  { value: 'America/New_York', label: 'America/New_York' },
  { value: 'America/Los_Angeles', label: 'America/Los_Angeles' },
  { value: 'America/Chicago', label: 'America/Chicago' },
  { value: 'America/Denver', label: 'America/Denver' },
]

export function CreateEventClient() {
  const { user, isLoading } = useCurrentUser()
  const router = useRouter()
  const createEventMutation = useCreateEvent()

  const [formData, setFormData] = useState<Omit<EventCreateRequest, 'eventStartDateUtc' | 'eventEndDateUtc'> & {
    startDate: Date | null
    endDate: Date | null
  }>({
    name: "",
    type: "",
    description: "",
    location: "",
    capacity: 0,
    eventTimezone: "EST",
    startDate: null,
    endDate: null,
  })

  const [errors, setErrors] = useState<Partial<Record<keyof EventCreateRequest, string>>>({})

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return <PageLoading text="Loading..." />
  }

  if (!user) {
    return null
  }

  const handleInputChange = (field: keyof typeof formData, value: string | number | Date | null) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field as keyof EventCreateRequest]) {
      setErrors((prev) => ({ ...prev, [field as keyof EventCreateRequest]: undefined }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof EventCreateRequest, string>> = {}

    if (!formData.name.trim()) {
      newErrors.name = "Name is required"
    }

    if (!formData.type) {
      newErrors.type = "Type is required"
    }

    if (!formData.location.trim()) {
      newErrors.location = "Location is required"
    }

    if (!formData.capacity || formData.capacity <= 0) {
      newErrors.capacity = "Capacity must be greater than 0"
    }

    if (!formData.startDate) {
      newErrors.eventStartDateUtc = "Start date is required"
    }

    if (!formData.endDate) {
      newErrors.eventEndDateUtc = "End date is required"
    }

    if (formData.startDate && formData.endDate && formData.endDate <= formData.startDate) {
      newErrors.eventEndDateUtc = "End date must be after start date"
    }

    if (!formData.eventTimezone) {
      newErrors.eventTimezone = "Timezone is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    if (!formData.startDate || !formData.endDate) {
      return
    }

    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login')
      return
    }

    // Convert dates to UTC ISO strings
    const eventData: EventCreateRequest = {
      name: formData.name,
      type: formData.type,
      description: formData.description || undefined,
      location: formData.location,
      capacity: formData.capacity,
      eventTimezone: formData.eventTimezone,
      eventStartDateUtc: dayjs(formData.startDate).utc().toISOString(),
      eventEndDateUtc: dayjs(formData.endDate).utc().toISOString(),
    }

    try {
      const createdEvent = await createEventMutation.mutateAsync({
        eventData,
        token,
      })
      router.push(`/events/${createdEvent.id}`)
    } catch (error) {
      console.error("Failed to create event:", error)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 md:px-6 py-8 md:py-12 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8">Event Info</h1>

        <Card>
          <CardContent className="p-6 md:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    placeholder="Event name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className={errors.name ? "border-destructive" : ""}
                  />
                  {errors.name && (
                    <p className="text-sm text-destructive">{errors.name}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">Type</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) => handleInputChange("type", value)}
                  >
                    <SelectTrigger id="type" className={errors.type ? "border-destructive" : ""}>
                      <SelectValue placeholder="Select event type" />
                    </SelectTrigger>
                    <SelectContent>
                      {EVENT_TYPE_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.type && (
                    <p className="text-sm text-destructive">{errors.type}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Event description"
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  className="min-h-[120px]"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    placeholder="Event location"
                    value={formData.location}
                    onChange={(e) => handleInputChange("location", e.target.value)}
                    className={errors.location ? "border-destructive" : ""}
                  />
                  {errors.location && (
                    <p className="text-sm text-destructive">{errors.location}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="capacity">Capacity</Label>
                  <Input
                    id="capacity"
                    type="number"
                    placeholder="Event capacity"
                    value={formData.capacity || ""}
                    onChange={(e) => handleInputChange("capacity", parseInt(e.target.value) || 0)}
                    className={errors.capacity ? "border-destructive" : ""}
                    min="1"
                  />
                  {errors.capacity && (
                    <p className="text-sm text-destructive">{errors.capacity}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="start">Start</Label>
                  <DateTimePicker
                    placeholder="Start date & time"
                    value={formData.startDate}
                    onChange={(value) => handleInputChange("startDate", value ? new Date(value) : null)}
                    clearable
                    size="sm"
                    valueFormat="MM/DD/YYYY HH:mm:ss"
                  />
                  {errors.eventStartDateUtc && (
                    <p className="text-sm text-destructive">{errors.eventStartDateUtc}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="end">End</Label>
                  <DateTimePicker
                    placeholder="End date & time"
                    value={formData.endDate}
                    onChange={(value) => handleInputChange("endDate", value ? new Date(value) : null)}
                    clearable
                    size="sm"
                    valueFormat="MM/DD/YYYY HH:mm:ss"
                  />
                  {errors.eventEndDateUtc && (
                    <p className="text-sm text-destructive">{errors.eventEndDateUtc}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="timezone">Timezone</Label>
                <Select
                  value={formData.eventTimezone}
                  onValueChange={(value) => handleInputChange("eventTimezone", value)}
                >
                  <SelectTrigger id="timezone" className={errors.eventTimezone ? "border-destructive" : ""}>
                    <SelectValue placeholder="Select timezone" />
                  </SelectTrigger>
                  <SelectContent>
                    {TIMEZONE_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.eventTimezone && (
                  <p className="text-sm text-destructive">{errors.eventTimezone}</p>
                )}
              </div>

              <div className="flex justify-end pt-4">
                <Button
                  type="submit"
                  disabled={createEventMutation.isPending}
                  size="lg"
                >
                  {createEventMutation.isPending ? "Creating..." : "Create Event"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

