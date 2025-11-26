"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, Zap, Target } from "lucide-react"

interface Task {
  id?: string | number
  title: string
  description: string
  estimated_minutes: number
  complexity?: "low" | "medium" | "high" | number | string // flexible
}

interface TaskCardsProps {
  tasks: Task[]
  goalComplexity?: number | string // ← NEW: receive from parent
}

const complexityConfig = {
  low: { label: "Simple", bg: "bg-gradient-to-r from-blue to-blue/80 text-white", icon: Target },
  medium: { label: "Moderate", bg: "bg-gradient-to-r from-pink to-pink/80 text-white", icon: Zap },
  high: { label: "Complex", bg: "bg-gradient-to-r from-pink via-purple to-blue text-white", icon: Zap },
}

// Unified normalization that works with task.complexity OR goalComplexity fallback
const normalizeComplexity = (
  taskComplexity?: string | number,
  goalComplexityFallback?: number | string
): "low" | "medium" | "high" => {
  const resolve = (value?: string | number): "low" | "medium" | "high" => {
    if (value === undefined || value === null || value === "") return "low"

    // Handle strings
    if (typeof value === "string") {
      const lower = value.toLowerCase().trim()
      if (["low", "simple", "easy"].includes(lower)) return "low"
      if (["medium", "moderate"].includes(lower)) return "medium"
      if (["high", "hard", "complex"].includes(lower)) return "high"
    }

    // Handle numbers
    const num = Number(value)
    if (!isNaN(num)) {
      if (num <= 3) return "low"
      if (num <= 6) return "medium"
      return "high"
    }

    return "low"
  }

  // Prefer task-level complexity, fall back to goal-level
  return resolve(taskComplexity) !== "low" && taskComplexity != null
    ? resolve(taskComplexity)
    : resolve(goalComplexityFallback)
}

export default function TaskCards({ tasks, goalComplexity }: TaskCardsProps) {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Your Breakdown</h2>
        <p className="text-muted-foreground">Follow these steps to achieve your goal</p>
      </div>

      <div className="space-y-4">
        {tasks.map((task, index) => {
          const complexityKey = normalizeComplexity(task.complexity, goalComplexity)
          const ComplexityIcon = complexityConfig[complexityKey].icon
          const complexityBg = complexityConfig[complexityKey].bg
          const complexityLabel = complexityConfig[complexityKey].label

          return (
            <Card
              key={task.id ?? `${index}-${task.title}`}
              className="relative overflow-hidden bg-gradient-to-br from-card via-card to-card/50 border border-blue/20 hover:border-pink/50 p-6 transition-all duration-300 hover:shadow-2xl hover:shadow-pink/10 hover:-translate-y-1 cursor-pointer group animate-slide-up"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-pink/0 via-pink/5 to-blue/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

              <div className="relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink to-blue flex items-center justify-center text-white font-black text-lg transform group-hover:scale-110 transition-transform duration-300">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-foreground group-hover:text-pink transition-colors">
                        {task.title}
                      </h3>
                      <p className="text-muted-foreground text-sm mt-1">{task.description}</p>
                    </div>
                  </div>
                  <Badge className={`${complexityBg} whitespace-nowrap flex items-center gap-1.5 font-medium`}>
                    <ComplexityIcon className="w-4 h-4" />
                    {complexityLabel}
                  </Badge>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-blue/20">
                  <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                    <span className="text-pink">Time</span>
                    <span>{task.estimated_minutes ?? "?"} minutes</span>
                  </div>
                  <Check className="w-5 h-5 text-muted-foreground group-hover:text-pink group-hover:scale-125 transition-all duration-300" />
                </div>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}