"use client"

import { useState, useEffect } from "react"
import { Modal } from "@/components/ui/modal"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { User, Question, QuestionType } from "@/types/responses"
import { AnswerRequest } from "@/types/requests"
import { cn } from "@/utils/cn"

interface RegistrationModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user: User | undefined | null
  questions?: Question[]
  onSubmit: (displayName: string, tickets: number, answers?: AnswerRequest[]) => void
  isPending: boolean
}

export function RegistrationModal({
  open,
  onOpenChange,
  user,
  questions = [],
  onSubmit,
  isPending,
}: RegistrationModalProps) {
  const [displayName, setDisplayName] = useState("")
  const [tickets, setTickets] = useState("1")
  const [questionAnswers, setQuestionAnswers] = useState<(string | string[])[]>([])

  useEffect(() => {
    if (open && user) {
      const defaultName = `${user.firstName} ${user.lastName}`.trim()
      setDisplayName(defaultName)
    }
  }, [open, user])

  useEffect(() => {
    if (!open) {
      setDisplayName("")
      setTickets("1")
      setQuestionAnswers([])
    } else {
      setQuestionAnswers(Array(questions.length).fill(null))
    }
  }, [open, questions.length])

  const handleQuestionAnswerChange = (index: number, value: string | string[]) => {
    setQuestionAnswers((prev) => {
      const newAnswers = [...prev]
      newAnswers[index] = value
      return newAnswers
    })
  }

  const areRequiredQuestionsAnswered = questions.every((question, index) => {
    if (!question.required) return true
    const answer = questionAnswers[index]
    if (question.type === QuestionType.MULTISELECT) {
      return Array.isArray(answer) && answer.length > 0
    }
    return answer && (typeof answer === 'string' ? answer.trim() !== '' : true)
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const ticketsNumber = Number(tickets) || 1
    if (displayName.trim() && ticketsNumber > 0 && areRequiredQuestionsAnswered) {
      let answers: AnswerRequest[] | undefined
      if (questions.length > 0) {
        answers = questions
          .map((question, index) => {
            const answer = questionAnswers[index]
            if (answer === null || answer === undefined) {
              return null
            }

            const answerRequest: AnswerRequest = {
              questionId: question.id,
            }

            if (question.type === QuestionType.MULTISELECT) {
              answerRequest.multiAnswer = Array.isArray(answer) ? answer : []
            } else {
              answerRequest.singleAnswer = typeof answer === 'string' ? answer : String(answer)
            }

            return answerRequest
          })
          .filter((answer): answer is AnswerRequest => answer !== null)
        
        if (answers.length === 0) {
          answers = undefined
        }
      }

      onSubmit(displayName.trim(), ticketsNumber, answers)
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
              if (inputValue === "") {
                setTickets("")
                return
              }
              const numValue = parseInt(inputValue, 10)
              if (!isNaN(numValue) && numValue > 0) {
                setTickets(inputValue)
              }
            }}
            onBlur={(e) => {
              const numValue = parseInt(e.target.value, 10)
              if (isNaN(numValue) || numValue < 1) {
                setTickets("1")
              }
            }}
            required
            disabled={isPending}
          />
        </div>

        {questions && questions.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-md font-semibold">Questions</h3>
            <div className="space-y-4 max-h-[40vh] overflow-y-auto px-0.5 pb-2">
              {questions.map((question, index) => (
                <div key={question.id} className="bg-card space-y-3">
                  <Label className="text-base">
                    {question.question}
                    {question.required && <span className="text-destructive ml-1">*</span>}
                  </Label>

                  {question.type === QuestionType.TYPED && (
                    <Textarea
                      placeholder="Type your answer..."
                      value={(questionAnswers[index] as string) || ""}
                      onChange={(e) => handleQuestionAnswerChange(index, e.target.value)}
                      required={question.required}
                      disabled={isPending}
                      rows={3}
                    />
                  )}

                  {question.type === QuestionType.CHOICE && (
                    <div className="space-y-2">
                      {question.choices && question.choices.length > 0 ? (
                        question.choices.map((choice, choiceIndex) => {
                          const isSelected = (questionAnswers[index] as string) === choice
                          return (
                            <label
                              key={choiceIndex}
                              className="flex items-center space-x-3 cursor-pointer p-3 rounded-md border border-input hover:bg-muted/50 transition-colors"
                            >
                              <div className="relative flex items-center justify-center">
                                <input
                                  type="radio"
                                  name={`question-${question.id}`}
                                  value={choice}
                                  checked={isSelected}
                                  onChange={(e) => handleQuestionAnswerChange(index, e.target.value)}
                                  className="sr-only"
                                  required={question.required}
                                  disabled={isPending}
                                />
                                <div
                                  className={cn(
                                    "h-4 w-4 rounded-full border-2 transition-all",
                                    isSelected
                                      ? "border-primary bg-primary"
                                      : "border-input bg-background"
                                  )}
                                >
                                  {isSelected && (
                                    <div className="h-full w-full rounded-full bg-primary-foreground scale-50" />
                                  )}
                                </div>
                              </div>
                              <span className="text-sm flex-1">{choice || `Choice ${choiceIndex + 1}`}</span>
                            </label>
                          )
                        })
                      ) : (
                        <p className="text-sm text-muted-foreground">No choices available</p>
                      )}
                    </div>
                  )}

                  {question.type === QuestionType.MULTISELECT && (
                    <div className="space-y-2">
                      {question.choices && question.choices.length > 0 ? (
                        question.choices.map((choice, choiceIndex) => {
                          const currentAnswers = (questionAnswers[index] as string[]) || []
                          const isChecked = currentAnswers.includes(choice)
                          return (
                            <label
                              key={choiceIndex}
                              className="flex items-center space-x-3 cursor-pointer p-3 rounded-md border border-input hover:bg-muted/50 transition-colors"
                            >
                              <div className="relative flex items-center justify-center">
                                <input
                                  type="checkbox"
                                  value={choice}
                                  checked={isChecked}
                                  onChange={(e) => {
                                    const currentAnswers = (questionAnswers[index] as string[]) || []
                                    if (e.target.checked) {
                                      handleQuestionAnswerChange(index, [...currentAnswers, choice])
                                    } else {
                                      handleQuestionAnswerChange(
                                        index,
                                        currentAnswers.filter((c) => c !== choice)
                                      )
                                    }
                                  }}
                                  className="sr-only"
                                  disabled={isPending}
                                />
                                <div
                                  className={cn(
                                    "h-4 w-4 rounded border-2 transition-all flex items-center justify-center",
                                    isChecked
                                      ? "border-primary bg-primary"
                                      : "border-input bg-background"
                                  )}
                                >
                                  {isChecked && (
                                    <svg
                                      className="h-3 w-3 text-primary-foreground"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      stroke="currentColor"
                                      strokeWidth={3}
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M5 13l4 4L19 7"
                                      />
                                    </svg>
                                  )}
                                </div>
                              </div>
                              <span className="text-sm flex-1">{choice || `Choice ${choiceIndex + 1}`}</span>
                            </label>
                          )
                        })
                      ) : (
                        <p className="text-sm text-muted-foreground">No choices available</p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

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
            disabled={isPending || !displayName.trim() || !tickets || parseInt(tickets, 10) < 1 || !areRequiredQuestionsAnswered}
          >
            {isPending ? "Registering..." : "Register"}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
