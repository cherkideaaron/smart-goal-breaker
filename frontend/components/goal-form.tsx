"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2, Sparkles } from "lucide-react"

interface GoalFormProps {
  onSubmit: (goal: string) => void
  isLoading: boolean
}

export default function GoalForm({ onSubmit, isLoading }: GoalFormProps) {
  const [goal, setGoal] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (goal.trim()) {
      onSubmit(goal)
      setGoal("")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mb-8 animate-slide-up">
      <div className="relative bg-gradient-to-br from-card via-card to-blue/5 rounded-2xl shadow-2xl p-8 border border-blue/20">
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-pink/20 via-blue/20 to-pink/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

        <div className="relative z-10">
          <div className="mb-6">
            <label className="block text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-pink" />
              What's your goal?
            </label>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Input
              type="text"
              placeholder="e.g., Learn machine learning, launch my startup, master React..."
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              disabled={isLoading}
              className="flex-1 text-base bg-input border-blue/30 focus:border-pink text-foreground placeholder:text-muted-foreground"
            />
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-gradient-to-r from-pink to-blue hover:shadow-lg hover:shadow-pink/50 text-white font-bold px-8 py-6 rounded-xl transition-all duration-300 whitespace-nowrap transform hover:scale-105 active:scale-95"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Breaking...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Break it
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </form>
  )
}
