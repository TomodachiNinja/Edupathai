import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Circle, Calendar } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export default function ProgressOverview({ learningPath, progress, activeDay, onDaySelect }) {
  const getDayCompletion = (day) => {
    const dayProgress = progress.find(p => p.day === day);
    if (!dayProgress) return 0;
    
    const completedTasks = [
      dayProgress.video_completed,
      dayProgress.reading_completed,
      dayProgress.exercise_completed,
      dayProgress.assessment_completed
    ].filter(Boolean).length;
    
    return (completedTasks / 4) * 100;
  };

  const overallProgress = () => {
    const totalDays = learningPath.duration_days;
    const totalCompletion = Array.from({ length: totalDays }, (_, i) => 
      getDayCompletion(i + 1)
    ).reduce((sum, completion) => sum + completion, 0);
    
    return totalCompletion / totalDays;
  };

  return (
    <div className="space-y-6">
      <Card className="bg-white/90 backdrop-blur-md border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Learning Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Overall Progress</span>
              <span className="text-sm text-slate-600">{Math.round(overallProgress())}%</span>
            </div>
            <Progress value={overallProgress()} className="h-2" />
          </div>

          <div className="space-y-2 max-h-96 overflow-y-auto">
            {Array.from({ length: learningPath.duration_days }, (_, i) => {
              const day = i + 1;
              const completion = getDayCompletion(day);
              const isActive = day === activeDay;
              const module = learningPath.daily_modules?.find(m => m.day === day);

              return (
                <Button
                  key={day}
                  variant={isActive ? "default" : "ghost"}
                  onClick={() => onDaySelect(day)}
                  className={`w-full justify-start p-3 h-auto ${
                    isActive ? "bg-blue-600 hover:bg-blue-700" : "hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center gap-3 w-full">
                    <div className={`flex-shrink-0 ${isActive ? "text-white" : ""}`}>
                      {completion === 100 ? (
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                      ) : (
                        <Circle className="w-5 h-5" />
                      )}
                    </div>
                    <div className="flex-1 text-left">
                      <div className={`font-medium ${isActive ? "text-white" : "text-slate-800"}`}>
                        Day {day}
                      </div>
                      {module && (
                        <div className={`text-xs ${isActive ? "text-blue-100" : "text-slate-500"}`}>
                          {module.title}
                        </div>
                      )}
                    </div>
                    <div className={`text-xs ${isActive ? "text-blue-100" : "text-slate-500"}`}>
                      {Math.round(completion)}%
                    </div>
                  </div>
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}