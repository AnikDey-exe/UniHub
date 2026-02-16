"use client"

import { useState, useEffect, useRef } from "react"
import * as React from "react"
import { Modal } from "@/components/ui/modal"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { QuestionRequest } from "@/types/requests"
import { QuestionType } from "@/types/responses"
import { GripVertical, Plus, X, Trash2 } from "lucide-react"
import { cn } from "@/utils/cn"

interface QuestionsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  questions: QuestionRequest[]
  onQuestionsChange: (questions: QuestionRequest[]) => void
}

export function QuestionsModal({
  open,
  onOpenChange,
  questions,
  onQuestionsChange,
}: QuestionsModalProps) {
  const [localQuestions, setLocalQuestions] = useState<QuestionRequest[]>(questions)
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)
  const [insertPosition, setInsertPosition] = useState<"above" | "below" | null>(null)
  const [activeTab, setActiveTab] = useState("editor")
  const [previewAnswers, setPreviewAnswers] = useState<Record<number, string | string[]>>({})
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const scrollIntervalRef = useRef<number | null>(null)

  useEffect(() => {
    if (open) {
      setLocalQuestions(questions)
    }
  }, [open, questions])

  // Auto-scroll during drag
  useEffect(() => {
    if (draggedIndex === null) {
      if (scrollIntervalRef.current !== null) {
        cancelAnimationFrame(scrollIntervalRef.current)
        scrollIntervalRef.current = null
      }
      return
    }

    const handleDrag = (e: DragEvent) => {
      if (!scrollContainerRef.current) return

      const container = scrollContainerRef.current
      const rect = container.getBoundingClientRect()
      const mouseY = e.clientY
      const scrollThreshold = 80 // Distance from edge to start scrolling
      const maxScrollSpeed = 15 // Maximum pixels per frame

      // Check if mouse is within the container bounds
      if (mouseY < rect.top || mouseY > rect.bottom) {
        if (scrollIntervalRef.current !== null) {
          cancelAnimationFrame(scrollIntervalRef.current)
          scrollIntervalRef.current = null
        }
        return
      }

      // Check if mouse is near top edge
      if (mouseY - rect.top < scrollThreshold) {
        const distance = mouseY - rect.top
        const speed = Math.max(2, ((scrollThreshold - distance) / scrollThreshold) * maxScrollSpeed)
        
        if (scrollIntervalRef.current !== null) {
          cancelAnimationFrame(scrollIntervalRef.current)
        }

        const scroll = () => {
          if (container.scrollTop > 0) {
            container.scrollTop = Math.max(0, container.scrollTop - speed)
            scrollIntervalRef.current = requestAnimationFrame(scroll)
          } else {
            if (scrollIntervalRef.current !== null) {
              cancelAnimationFrame(scrollIntervalRef.current)
              scrollIntervalRef.current = null
            }
          }
        }
        scrollIntervalRef.current = requestAnimationFrame(scroll)
      }
      // Check if mouse is near bottom edge
      else if (rect.bottom - mouseY < scrollThreshold) {
        const distance = rect.bottom - mouseY
        const speed = Math.max(2, ((scrollThreshold - distance) / scrollThreshold) * maxScrollSpeed)
        
        if (scrollIntervalRef.current !== null) {
          cancelAnimationFrame(scrollIntervalRef.current)
        }

        const scroll = () => {
          const maxScroll = container.scrollHeight - container.clientHeight
          if (container.scrollTop < maxScroll) {
            container.scrollTop = Math.min(maxScroll, container.scrollTop + speed)
            scrollIntervalRef.current = requestAnimationFrame(scroll)
          } else {
            if (scrollIntervalRef.current !== null) {
              cancelAnimationFrame(scrollIntervalRef.current)
              scrollIntervalRef.current = null
            }
          }
        }
        scrollIntervalRef.current = requestAnimationFrame(scroll)
      }
      // Stop scrolling if mouse is in middle area
      else {
        if (scrollIntervalRef.current !== null) {
          cancelAnimationFrame(scrollIntervalRef.current)
          scrollIntervalRef.current = null
        }
      }
    }

    document.addEventListener("dragover", handleDrag)
    return () => {
      document.removeEventListener("dragover", handleDrag)
      if (scrollIntervalRef.current !== null) {
        cancelAnimationFrame(scrollIntervalRef.current)
        scrollIntervalRef.current = null
      }
    }
  }, [draggedIndex])

  const handleAddQuestion = () => {
    const newQuestion: QuestionRequest = {
      question: "",
      type: QuestionType.TYPED,
      choices: [],
      required: false,
    }
    setLocalQuestions([...localQuestions, newQuestion])
  }

  const handleUpdateQuestion = (index: number, field: keyof QuestionRequest, value: string | QuestionType | string[] | boolean) => {
    const updated = [...localQuestions]
    updated[index] = { ...updated[index], [field]: value }
    setLocalQuestions(updated)
  }

  const handleDeleteQuestion = (index: number) => {
    setLocalQuestions(localQuestions.filter((_, i) => i !== index))
  }

  const handleAddChoice = (questionIndex: number) => {
    const updated = [...localQuestions]
    updated[questionIndex].choices = [...(updated[questionIndex].choices || []), ""]
    setLocalQuestions(updated)
  }

  const handleUpdateChoice = (questionIndex: number, choiceIndex: number, value: string) => {
    const updated = [...localQuestions]
    if (!updated[questionIndex].choices) {
      updated[questionIndex].choices = []
    }
    updated[questionIndex].choices[choiceIndex] = value
    setLocalQuestions(updated)
  }

  const handleDeleteChoice = (questionIndex: number, choiceIndex: number) => {
    const updated = [...localQuestions]
    if (updated[questionIndex].choices) {
      updated[questionIndex].choices = updated[questionIndex].choices.filter((_, i) => i !== choiceIndex)
    }
    setLocalQuestions(updated)
  }

  const handleDragStart = (index: number) => {
    setDraggedIndex(index)
  }

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    
    if (draggedIndex === null || draggedIndex === index) {
      setDragOverIndex(null)
      setInsertPosition(null)
      return
    }

    const rect = e.currentTarget.getBoundingClientRect()
    const mouseY = e.clientY
    const elementMiddle = rect.top + rect.height / 2
    
    // Determine if inserting above or below based on mouse position
    const position = mouseY < elementMiddle ? "above" : "below"
    
    setDragOverIndex(index)
    setInsertPosition(position)
  }

  const handleDragLeave = () => {
    setDragOverIndex(null)
    setInsertPosition(null)
  }

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault()
    if (draggedIndex === null) {
      setDraggedIndex(null)
      setDragOverIndex(null)
      setInsertPosition(null)
      return
    }

    if (draggedIndex === dropIndex) {
      setDraggedIndex(null)
      setDragOverIndex(null)
      setInsertPosition(null)
      return
    }

    const updated = [...localQuestions]
    const [draggedItem] = updated.splice(draggedIndex, 1)
    
    // Calculate the actual drop index based on insert position
    let actualDropIndex = dropIndex
    if (draggedIndex < dropIndex && insertPosition === "above") {
      actualDropIndex = dropIndex - 1
    } else if (draggedIndex > dropIndex && insertPosition === "below") {
      actualDropIndex = dropIndex + 1
    } else if (insertPosition === "below") {
      actualDropIndex = dropIndex + 1
    }
    
    // Ensure we don't go out of bounds
    actualDropIndex = Math.max(0, Math.min(actualDropIndex, updated.length))
    
    updated.splice(actualDropIndex, 0, draggedItem)
    setLocalQuestions(updated)
    setDraggedIndex(null)
    setDragOverIndex(null)
    setInsertPosition(null)
  }

  const handleDragEnd = () => {
    setDraggedIndex(null)
    setDragOverIndex(null)
    setInsertPosition(null)
  }

  const handleSave = () => {
    // Filter out questions with empty question text
    const validQuestions = localQuestions.filter((q) => q.question.trim() !== "")
    onQuestionsChange(validQuestions)
    onOpenChange(false)
  }

  const handleCancel = () => {
    setLocalQuestions(questions)
    onOpenChange(false)
  }

  const handlePreviewAnswerChange = (questionIndex: number, value: string | string[]) => {
    setPreviewAnswers((prev) => ({ ...prev, [questionIndex]: value }))
  }

  const validQuestions = localQuestions.filter((q) => q.question.trim() !== "")

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Event Questions"
      className="max-w-4xl max-h-[90vh] overflow-y-auto"
    >
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-transparent p-0 h-auto gap-2">
          <TabsTrigger 
            value="editor"
            className={cn(
              "bg-transparent data-[state=active]:bg-muted data-[state=active]:text-foreground",
              "data-[state=inactive]:text-muted-foreground hover:text-foreground"
            )}
          >
            Editor
          </TabsTrigger>
          <TabsTrigger 
            value="preview"
            className={cn(
              "bg-transparent data-[state=active]:bg-muted data-[state=active]:text-foreground",
              "data-[state=inactive]:text-muted-foreground hover:text-foreground"
            )}
          >
            Preview
          </TabsTrigger>
        </TabsList>

        <TabsContent value="editor" className="space-y-6">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Add questions that attendees will answer when registering for your event
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddQuestion}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Question
            </Button>
          </div>

        {localQuestions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 border border-dashed border-border rounded-lg bg-muted/30">
            <p className="text-muted-foreground text-lg mb-2">No questions added</p>
            <p className="text-sm text-muted-foreground">Click &quot;Add Question&quot; to get started</p>
          </div>
        ) : (
          <div ref={scrollContainerRef} className="max-h-[60vh] overflow-y-auto pr-2">
            <div className="space-y-4">
              {localQuestions.map((question, index) => (
                <React.Fragment key={index}>
                  {/* Insertion indicator above */}
                  {dragOverIndex === index && insertPosition === "above" && draggedIndex !== index && (
                    <div className="relative -my-2 z-10">
                      <div className="flex items-center">
                        <div className="flex-1 h-0.5 bg-primary" />
                        <div className="mx-2 h-3 w-3 rounded-full bg-primary border-2 border-background" />
                        <div className="flex-1 h-0.5 bg-primary" />
                      </div>
                    </div>
                  )}
                  
                  <div
                    draggable
                    onDragStart={() => handleDragStart(index)}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, index)}
                    onDragEnd={handleDragEnd}
                    className={cn(
                      "border rounded-lg p-4 bg-card space-y-4 transition-all",
                      draggedIndex === index && "opacity-40 cursor-grabbing scale-95",
                      dragOverIndex === index && draggedIndex !== index && "border-primary/30"
                    )}
                  >
                <div className="flex items-start gap-3">
                  <div className="flex items-center gap-2 flex-shrink-0 pt-2">
                    <GripVertical className="h-5 w-5 text-muted-foreground cursor-move" />
                    <span className="text-sm font-medium text-muted-foreground">#{index + 1}</span>
                  </div>

                  <div className="flex-1 space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor={`question-${index}`}>Question</Label>
                      <Input
                        id={`question-${index}`}
                        placeholder="Enter your question"
                        value={question.question}
                        onChange={(e) => handleUpdateQuestion(index, "question", e.target.value)}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor={`type-${index}`}>Question Type</Label>
                        <Select
                          value={question.type}
                          onValueChange={(value) => handleUpdateQuestion(index, "type", value as QuestionType)}
                        >
                          <SelectTrigger id={`type-${index}`}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value={QuestionType.TYPED}>Typed Response</SelectItem>
                            <SelectItem value={QuestionType.CHOICE}>Single Choice</SelectItem>
                            <SelectItem value={QuestionType.MULTISELECT}>Multiple Choice</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between pt-6">
                          <Label htmlFor={`required-${index}`}>Required</Label>
                          <Switch
                            id={`required-${index}`}
                            checked={question.required}
                            onCheckedChange={(checked) => handleUpdateQuestion(index, "required", checked)}
                          />
                        </div>
                      </div>
                    </div>

                    {(question.type === QuestionType.CHOICE || question.type === QuestionType.MULTISELECT) && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label>Choices</Label>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => handleAddChoice(index)}
                          >
                            <Plus className="h-4 w-4 mr-1" />
                            Add Choice
                          </Button>
                        </div>
                        {question.choices && question.choices.length > 0 ? (
                          <div className="space-y-2">
                            {question.choices.map((choice, choiceIndex) => (
                              <div key={choiceIndex} className="flex items-center gap-2">
                                <Input
                                  placeholder={`Choice ${choiceIndex + 1}`}
                                  value={choice}
                                  onChange={(e) => handleUpdateChoice(index, choiceIndex, e.target.value)}
                                />
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDeleteChoice(index, choiceIndex)}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-muted-foreground">No choices added yet</p>
                        )}
                      </div>
                    )}

                    <div className="flex justify-end">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteQuestion(index)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Question
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
                  
                  {/* Insertion indicator below */}
                  {dragOverIndex === index && insertPosition === "below" && draggedIndex !== index && (
                    <div className="relative -my-2 z-10">
                      <div className="flex items-center">
                        <div className="flex-1 h-0.5 bg-primary" />
                        <div className="mx-2 h-3 w-3 rounded-full bg-primary border-2 border-background" />
                        <div className="flex-1 h-0.5 bg-primary" />
                      </div>
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        )}
        </TabsContent>

        <TabsContent value="preview" className="space-y-6">
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Preview how your questions will appear to attendees
            </p>
            {validQuestions.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 border border-dashed border-border rounded-lg bg-muted/30">
                <p className="text-muted-foreground text-lg mb-2">No questions to preview</p>
                <p className="text-sm text-muted-foreground">Add questions in the Editor tab to see a preview</p>
              </div>
            ) : (
              <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2">
                {validQuestions.map((question, index) => (
                  <div key={index} className="border rounded-lg p-4 bg-card space-y-3">
                    <Label className="text-base">
                      {question.question}
                      {question.required && <span className="text-destructive ml-1">*</span>}
                    </Label>

                    {question.type === QuestionType.TYPED && (
                      <Textarea
                        placeholder="Type your answer..."
                        value={(previewAnswers[index] as string) || ""}
                        onChange={(e) => handlePreviewAnswerChange(index, e.target.value)}
                        rows={3}
                      />
                    )}

                    {question.type === QuestionType.CHOICE && (
                      <div className="space-y-2">
                        {question.choices && question.choices.length > 0 ? (
                          question.choices.map((choice, choiceIndex) => {
                            const isSelected = (previewAnswers[index] as string) === choice
                            return (
                              <label
                                key={choiceIndex}
                                className="flex items-center space-x-3 cursor-pointer p-3 rounded-md border border-input hover:bg-muted/50 transition-colors"
                              >
                                <div className="relative flex items-center justify-center">
                                  <input
                                    type="radio"
                                    name={`question-${index}`}
                                    value={choice}
                                    checked={isSelected}
                                    onChange={(e) => handlePreviewAnswerChange(index, e.target.value)}
                                    className="sr-only"
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
                          <p className="text-sm text-muted-foreground">No choices added yet</p>
                        )}
                      </div>
                    )}

                    {question.type === QuestionType.MULTISELECT && (
                      <div className="space-y-2">
                        {question.choices && question.choices.length > 0 ? (
                          question.choices.map((choice, choiceIndex) => {
                            const currentAnswers = (previewAnswers[index] as string[]) || []
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
                                      const currentAnswers = (previewAnswers[index] as string[]) || []
                                      if (e.target.checked) {
                                        handlePreviewAnswerChange(index, [...currentAnswers, choice])
                                      } else {
                                        handlePreviewAnswerChange(
                                          index,
                                          currentAnswers.filter((c) => c !== choice)
                                        )
                                      }
                                    }}
                                    className="sr-only"
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
                          <p className="text-sm text-muted-foreground">No choices added yet</p>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end gap-3 pt-4 border-t mt-6">
        <Button
          type="button"
          variant="outline"
          onClick={handleCancel}
        >
          Cancel
        </Button>
        <Button
          type="button"
          onClick={handleSave}
        >
          Save Questions
        </Button>
      </div>
    </Modal>
  )
}
