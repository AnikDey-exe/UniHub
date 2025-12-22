import { Card } from "@/components/ui/card"
import { College } from "@/types/responses"
import { cn } from "@/utils/cn"
import Link from "next/link"

interface CollegeCardProps {
  college: College
  className?: string
}

export function CollegeCard({ college, className }: CollegeCardProps) {
  const initials = college.name
    .split(" ")
    .map(word => word[0])
    .join("")
    .toUpperCase()

  return (
    <Link href={`/colleges/${college.id}`}>
      <Card className={cn("p-4 hover:shadow-lg transition-shadow cursor-pointer", className)}>
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 overflow-hidden">
            {college.thumbnail ? (
              <img 
                src={college.thumbnail} 
                alt={college.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-sm font-bold text-primary">{initials}</span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-base mb-1 text-foreground line-clamp-1">
              {college.name}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-1">
              {college.location}
            </p>
          </div>
        </div>
      </Card>
    </Link>
  )
}

