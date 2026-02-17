"use client"

import { Card, CardContent } from "@/components/ui/card"
import { EventSummary, Event } from "@/types/responses"
import { Settings2, HelpCircle } from "lucide-react"

interface EventDetailViewProps {
  event: EventSummary
  fullEvent: Event | null
}

export function EventDetailView({ event, fullEvent }: EventDetailViewProps) {
  const questions = fullEvent?.questions ?? []

  return (
    <Card className="border border-border/80 bg-card shadow-sm">
      <CardContent className="p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-foreground">{event.name}</h2>
          <p className="text-sm text-muted-foreground mt-1">
            {event.type} · {event.numAttendees} attendees ·{" "}
            {new Date(event.eventStartDateUtc).toLocaleDateString()}
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-4">
            <h4 className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <Settings2 className="h-4 w-4" />
              Customization & settings
            </h4>
            <dl className="grid gap-2 text-sm">
              <div className="flex justify-between gap-2">
                <dt className="text-muted-foreground">Location</dt>
                <dd className="font-medium text-foreground">{event.location}</dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt className="text-muted-foreground">Capacity</dt>
                <dd className="font-medium text-foreground">{event.capacity}</dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt className="text-muted-foreground">Max tickets per registration</dt>
                <dd className="font-medium text-foreground">{event.maxTickets}</dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt className="text-muted-foreground">Requires approval</dt>
                <dd className="font-medium text-foreground">
                  {event.requiresApproval ? "Yes" : "No"}
                </dd>
              </div>
              {event.approvalSuccessMessage && (
                <div className="col-span-2">
                  <dt className="text-muted-foreground mb-1">Approval success message</dt>
                  <dd className="rounded-md border border-border/80 bg-background p-2 text-foreground">
                    {event.approvalSuccessMessage}
                  </dd>
                </div>
              )}
              {event.description && (
                <div className="col-span-2">
                  <dt className="text-muted-foreground mb-1">Description</dt>
                  <dd className="rounded-md border border-border/80 bg-background p-2 text-foreground">
                    {event.description}
                  </dd>
                </div>
              )}
            </dl>
          </div>
          <div className="space-y-4">
            <h4 className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <HelpCircle className="h-4 w-4" />
              Registration questions
            </h4>
            {questions.length === 0 ? (
              <p className="text-sm text-muted-foreground">No custom questions.</p>
            ) : (
              <ul className="space-y-2">
                {questions.map((q) => (
                  <li
                    key={q.id}
                    className="rounded-md border border-border/80 bg-background p-3 text-sm"
                  >
                    <p className="font-medium text-foreground">{q.question}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Type: {q.type}
                      {q.required && " · Required"}
                      {q.choices?.length ? ` · ${q.choices.length} choices` : ""}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
