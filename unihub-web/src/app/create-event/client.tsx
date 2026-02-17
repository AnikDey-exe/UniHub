"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useCurrentUser } from "@/context/user-context"
import { useCreateEvent } from "@/hooks/use-create-event"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { ImageIcon, X, HelpCircle } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { PageLoading } from "@/components/ui/loading"
import { EventCreateRequest, QuestionRequest } from "@/types/requests"
import { EVENT_TYPE_OPTIONS } from "@/types/event-types"
import { QuestionsModal } from "./components/questions-modal"
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

  const [formData, setFormData] = useState<Omit<EventCreateRequest, 'eventStartDateUtc' | 'eventEndDateUtc' | 'creatorId' | 'image' | 'maxTickets'> & {
    startDate: Date | null
    endDate: Date | null
    image: File | null
    maxTickets: string
  }>({
    name: "",
    type: "",
    description: "",
    location: "",
    capacity: 0,
    eventTimezone: "EST",
    startDate: null,
    endDate: null,
    image: null,
    maxTickets: "1",
    requiresApproval: false,
    approvalSuccessMessage: ""
  })

  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [questions, setQuestions] = useState<QuestionRequest[]>([])
  const [questionsModalOpen, setQuestionsModalOpen] = useState(false)

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

  const handleInputChange = (field: keyof typeof formData, value: string | number | Date | null | File | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field as keyof EventCreateRequest]) {
      setErrors((prev) => ({ ...prev, [field as keyof EventCreateRequest]: undefined }))
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleInputChange("image", file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveImage = () => {
    handleInputChange("image", null)
    setImagePreview(null)
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

    // Create FormData
    const formDataToSend = new FormData()
    formDataToSend.append('name', formData.name)
    formDataToSend.append('type', formData.type)
    if (formData.description) {
      formDataToSend.append('description', formData.description)
    }
    formDataToSend.append('location', formData.location)
    formDataToSend.append('capacity', formData.capacity.toString())
    formDataToSend.append('eventTimezone', formData.eventTimezone)
    formDataToSend.append('eventStartDateUtc', dayjs(formData.startDate).utc().toISOString())
    formDataToSend.append('eventEndDateUtc', dayjs(formData.endDate).utc().toISOString())
    formDataToSend.append('creatorId', user.id.toString())
    formDataToSend.append('maxTickets', (Number(formData.maxTickets) || 1).toString())
    formDataToSend.append('requiresApproval', formData.requiresApproval.toString())
    if (formData.approvalSuccessMessage) {
      formDataToSend.append('approvalSuccessMessage', formData.approvalSuccessMessage)
    }
    if (questions.length > 0) {
      formDataToSend.append('questionsJson', JSON.stringify(questions))
    }
    
    if (formData.image) {
      formDataToSend.append('image', formData.image)
    }

    try {
      const createdEvent = await createEventMutation.mutateAsync({
        formData: formDataToSend,
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

              <div className="space-y-2">
                <Label htmlFor="image">Event Image</Label>
                <div className="relative">
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  {imagePreview ? (
                    <div className="relative w-full h-64 rounded-lg overflow-hidden border border-border">
                      <img 
                        src={imagePreview} 
                        alt="Preview" 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <Label
                          htmlFor="image"
                          className="cursor-pointer"
                        >
                          <Button
                            type="button"
                            variant="secondary"
                            size="sm"
                            onClick={(e) => e.stopPropagation()}
                          >
                            Change Image
                          </Button>
                        </Label>
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={handleRemoveImage}
                        >
                          <X className="h-4 w-4 mr-1" />
                          Remove
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <Label
                      htmlFor="image"
                      className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <ImageIcon className="w-10 h-10 mb-3 text-muted-foreground" />
                        <p className="mb-2 text-sm text-muted-foreground">
                          <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-muted-foreground">PNG, JPG, GIF up to 10MB</p>
                      </div>
                    </Label>
                  )}
                </div>
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="maxTickets">Max Tickets per Registration</Label>
                  <Input
                    id="maxTickets"
                    type="number"
                    min="1"
                    placeholder="1"
                    value={formData.maxTickets}
                    onChange={(e) => {
                      const inputValue = e.target.value
                      // Allow empty string while typing
                      if (inputValue === "") {
                        handleInputChange("maxTickets", "")
                        return
                      }
                      // Only allow positive integers
                      const numValue = parseInt(inputValue, 10)
                      if (!isNaN(numValue) && numValue > 0) {
                        handleInputChange("maxTickets", inputValue)
                      }
                    }}
                    onBlur={(e) => {
                      // Ensure we have a valid value on blur
                      const numValue = parseInt(e.target.value, 10)
                      if (isNaN(numValue) || numValue < 1) {
                        handleInputChange("maxTickets", "1")
                      }
                    }}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="requiresApproval">Require Approval</Label>
                    <Switch
                      id="requiresApproval"
                      checked={formData.requiresApproval}
                      onCheckedChange={(checked) => handleInputChange("requiresApproval", checked)}
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    When enabled, registrations require approval before being confirmed
                  </p>
                </div>
              </div>

              {formData.requiresApproval && (
                <div className="space-y-2">
                  <Label htmlFor="approvalSuccessMessage">Approval Success Message</Label>
                  <Textarea
                    id="approvalSuccessMessage"
                    placeholder="Message to show when registration is approved (optional)"
                    value={formData.approvalSuccessMessage}
                    onChange={(e) => handleInputChange("approvalSuccessMessage", e.target.value)}
                    className="min-h-[100px]"
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label>Registration Questions</Label>
                <Card
                  className="cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => setQuestionsModalOpen(true)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <HelpCircle className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">
                            {questions.length === 0
                              ? "No questions added"
                              : `${questions.length} question${questions.length === 1 ? "" : "s"} added`}
                          </p>
                          {questions.length > 0 && (
                            <p className="text-sm text-muted-foreground mt-1">
                              {questions.slice(0, 3).map((q, i) => (
                                <span key={i}>
                                  {q.question || "Untitled question"}
                                  {i < Math.min(questions.length, 3) - 1 && ", "}
                                </span>
                              ))}
                              {questions.length > 3 && ` and ${questions.length - 3} more...`}
                            </p>
                          )}
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          setQuestionsModalOpen(true)
                        }}
                      >
                        {questions.length === 0 ? "Add Questions" : "Edit Questions"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <QuestionsModal
                open={questionsModalOpen}
                onOpenChange={setQuestionsModalOpen}
                questions={questions}
                onQuestionsChange={setQuestions}
              />

              <div className="flex justify-end pt-4">
                <Button
                  type="submit"
                  disabled={createEventMutation.isPending}
                  size="lg"
                >
                  {createEventMutation.isPending ? "Creating..." : "Create Event"}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground text-center pt-2">Powered by Formiq</p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

