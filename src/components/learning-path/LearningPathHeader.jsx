import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Calendar, Clock, Target, BookOpen, TrendingUp } from "lucide-react";

export default function LearningPathHeader({ learningPath, progress = [] }) {
  const skillLevelColors = {
    beginner: "bg-green-100 text-green-800 border-green-200",
    intermediate: "bg-yellow-100 text-yellow-800 border-yellow-200", 
    advanced: "bg-red-100 text-red-800 border-red-200"
  };

  // Calculate overall progress
  const calculateOverallProgress = () => {
    const totalDays = learningPath.duration_days;
    if (totalDays === 0) return 0;
    
    const completedDays = progress.filter(p => {
      const completedTasks = [
        p.video_completed,
        p.reading_completed,
        p.exercise_completed,
        p.assessment_completed
      ].filter(Boolean).length;
      return completedTasks >= 3; // Consider day complete if 3+ tasks done
    }).length;
    
    return Math.round((completedDays / totalDays) * 100);
  };

  const overallProgress = calculateOverallProgress();

  return (
    <Card className="bg-white/90 backdrop-blur-md border-0 shadow-lg mb-8">
      <CardContent className="p-8">
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <div className="flex items-start gap-4 mb-4">
              <div>
                <h1 className="text-3xl font-bold text-slate-800 mb-2">
                  {learningPath.title}
                </h1>
                <p className="text-slate-600 text-lg leading-relaxed">
                  {learningPath.description}
                </p>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-blue-500" />
                  <span className="text-sm font-medium text-slate-700">Overall Progress</span>
                </div>
                <span className="text-sm font-semibold text-slate-800">{overallProgress}%</span>
              </div>
              <Progress value={overallProgress} className="h-3" />
            </div>
          </div>
          
          <Badge className={`${skillLevelColors[learningPath.skill_level]} border text-sm px-3 py-1 ml-6`}>
            {learningPath.skill_level.charAt(0).toUpperCase() + learningPath.skill_level.slice(1)} Level
          </Badge>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-6 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Duration</p>
              <p className="font-semibold text-slate-800">{learningPath.duration_days} days</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <Clock className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Daily Time</p>
              <p className="font-semibold text-slate-800">{learningPath.daily_time_hours}h per day</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
              <Target className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Completed</p>
              <p className="font-semibold text-slate-800">{progress.length}/{learningPath.duration_days} days</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Subject</p>
              <p className="font-semibold text-slate-800">{learningPath.topic}</p>
            </div>
          </div>
        </div>

        {/* Prerequisites and Objectives */}
        <div className="grid md:grid-cols-2 gap-6">
          {learningPath.prerequisites && learningPath.prerequisites.length > 0 && (
            <div>
              <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                <Target className="w-4 h-4 text-blue-500" />
                Prerequisites
              </h3>
              <div className="space-y-2">
                {learningPath.prerequisites.map((prereq, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                    <span className="text-slate-700 text-sm">{prereq}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {learningPath.learning_objectives && learningPath.learning_objectives.length > 0 && (
            <div>
              <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-green-500" />
                Learning Objectives
              </h3>
              <div className="space-y-2">
                {learningPath.learning_objectives.map((objective, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                    <span className="text-slate-700 text-sm">{objective}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}