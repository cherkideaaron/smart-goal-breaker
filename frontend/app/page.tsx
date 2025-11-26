"use client"

import { useState } from "react"
import GoalForm from "../components/goal-form"
import TaskCards from "../components/task-cards"
import GoalHistory from "../components/goal-history"

export default function Home() {
  const [tasks, setTasks] = useState<any[]>([])
  const [currentGoalComplexity, setCurrentGoalComplexity] = useState<number | string | undefined>()
  const [history, setHistory] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmitGoal = async (goal: string) => {
    if (!goal.trim()) return
    setIsLoading(true)

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/goals`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ goal }),
      })

      if (!res.ok) throw new Error("Failed to fetch API")

      const data = await res.json()

      setTasks(data.tasks || [])
      setCurrentGoalComplexity(data.complexity) // ← Save it here!

      // Add to history
      const historyItem = {
        id: data.id || Date.now(),
        goal,
        complexity: data.complexity || 1,
        timestamp: new Date().toLocaleString(),
        tasks: data.tasks || [],
      }

      setHistory((prev) => [historyItem, ...prev])
    } catch (err) {
      console.error(err)
      alert("Error calling API")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSelectHistory = (item: any) => {
    setTasks(item.tasks || [])
    setCurrentGoalComplexity(item.complexity) // ← Restore complexity when loading from history!
  }

  const handleDeleteHistory = (id: string | number) => {
    setHistory((prev) => prev.filter((h) => h.id !== id))
  }

  return (
    <main className="min-h-screen bg-background relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-pink/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/3 -left-32 w-64 h-64 bg-blue/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div>
        <div className="absolute bottom-10 right-1/3 w-72 h-72 bg-pink/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }}></div>
      </div>

      <div className="relative z-10 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16 animate-fade-in">
            <div className="inline-block mb-4">
              <span className="text-sm font-semibold text-pink uppercase tracking-widest">AI-Powered Goal Breaker</span>
            </div>
            <h1 className="text-5xl sm:text-6xl font-black text-foreground mb-4 bg-clip-text text-transparent bg-gradient-to-r from-pink via-foreground to-blue">
              Smart Goal Breaker
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Transform ambitious goals into actionable steps powered by artificial intelligence
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <GoalForm onSubmit={handleSubmitGoal} isLoading={isLoading} />
              
              {tasks.length > 0 && (
                <TaskCards 
                  tasks={tasks} 
                  goalComplexity={currentGoalComplexity} // ← Fixed!
                />
              )}
            </div>

            {/* History Sidebar */}
            <div className="lg:col-span-1">
              <GoalHistory
                history={history}
                onSelectGoal={handleSelectHistory}
                onDeleteHistory={handleDeleteHistory}
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}