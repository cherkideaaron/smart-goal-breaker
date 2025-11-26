"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, Trash2 } from "lucide-react"
import { useState } from "react"

interface HistoryItem {
  id?: string | number
  goal: string
  complexity?: number
  timestamp: string
}

interface GoalHistoryProps {
  history: HistoryItem[]
  onSelectGoal?: (item: HistoryItem) => void
  onDeleteHistory?: (id: string | number) => void
}

export default function GoalHistory({ history, onSelectGoal, onDeleteHistory }: GoalHistoryProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  const mapComplexity = (num?: number | string) => {
  const n = Number(num);  // ensure it's a number
  if (isNaN(n)) return "medium"; // fallback if undefined or not a number
  if (n <= 3) return "low";
  if (n <= 6) return "medium";
  return "high";
};


  return (
    <Card className="relative overflow-hidden bg-gradient-to-br from-card via-card to-card/50 border border-blue/20 p-6 sticky top-8 animate-fade-in shadow-xl">
      <div className="absolute inset-0 bg-gradient-to-br from-pink/5 via-transparent to-blue/5 pointer-events-none"></div>

      <div className="relative z-10">
        <h2 className="text-xl font-bold text-foreground mb-2">Recent Goals</h2>
        <p className="text-sm text-muted-foreground mb-6">Your goal-breaking history</p>

        <div className="space-y-3 max-h-96 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-pink/30 scrollbar-track-blue/10">
          {history.map((item, index) => {
            const complexityKey = mapComplexity(item.complexity)
            return (
              <div
                key={item.id ?? index}
                className="group relative p-4 rounded-xl bg-gradient-to-r from-blue/10 to-pink/10 border border-blue/20 hover:border-pink/40 transition-all duration-300 cursor-pointer"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                onClick={() => onSelectGoal && onSelectGoal(item)}
              >
                <p className="text-sm font-medium text-foreground line-clamp-2 mb-3 group-hover:text-pink transition-colors">
                  {item.goal}
                </p>
                <div className="flex items-center justify-between gap-2">
                  <Badge
                    className={`text-xs font-semibold ${
                      complexityKey === "low"
                        ? "bg-blue/30 text-blue border border-blue/50"
                        : complexityKey === "medium"
                        ? "bg-pink/30 text-pink border border-pink/50"
                        : "bg-gradient-to-r from-pink/30 to-blue/30 text-foreground border border-pink/30"
                    }`}
                  >
                    {complexityKey}
                  </Badge>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    <span className="line-clamp-1">{item.timestamp}</span>
                  </div>
                </div>
                {hoveredIndex === index && onDeleteHistory && (
                  <button
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 hover:bg-destructive/20 rounded-lg"
                    onClick={(e) => {
                      e.stopPropagation()
                      onDeleteHistory(item.id!)
                    }}
                  >
                    <Trash2 className="w-4 h-4 text-muted-foreground hover:text-destructive transition-colors" />
                  </button>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </Card>
  )
}
