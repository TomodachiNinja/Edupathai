import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Calendar, Clock, Target, Play } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { format } from "date-fns";

export default function PathCard({ path }) {
  const skillLevelColors = {
    beginner: "bg-green-100 text-green-800",
    intermediate: "bg-yellow-100 text-yellow-800",
    advanced: "bg-red-100 text-red-800"
  };

  const getStatusColor = (percentage) => {
    if (percentage === 0) return "text-gray-500";
    if (percentage < 30) return "text-red-500";
    if (percentage < 70) return "text-yellow-500";
    return "text-green-500";
  };

  const getStatusText = (percentage) => {
    if (percentage === 0) return "Not Started";
    if (percentage === 100) return "Completed";
    return "In Progress";
  };

  return (
    <Card className="bg-white/90 backdrop-blur-md border-0 shadow-lg hover:shadow-xl transition-all duration-200 group">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between mb-2">
          <Badge className={`${skillLevelColors[path.skill_level]} border-0 text-xs`}>
            {path.skill_level.charAt(0).toUpperCase() + path.skill_level.slice(1)}
          </Badge>
          <span className={`text-xs font-medium ${getStatusColor(path.completion_percentage)}`}>
            {getStatusText(path.completion_percentage)}
          </span>
        </div>
        <CardTitle className="text-lg leading-tight text-slate-800 group-hover:text-blue-600 transition-colors">
          {path.title}
        </CardTitle>
        <p className="text-sm text-slate-600 leading-relaxed line-clamp-2">
          {path.description}
        </p>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-3 text-xs">
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3 text-slate-400" />
            <span className="text-slate-600">{path.duration_days}d</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3 text-slate-400" />
            <span className="text-slate-600">{path.daily_time_hours}h/day</span>
          </div>
          <div className="flex items-center gap-1">
            <Target className="w-3 h-3 text-slate-400" />
            <span className="text-slate-600">{path.topic}</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs font-medium text-slate-600">Progress</span>
            <span className="text-xs font-semibold text-slate-800">
              {path.completion_percentage}%
            </span>
          </div>
          <Progress 
            value={path.completion_percentage} 
            className="h-2" 
          />
        </div>

        <div className="pt-2">
          <Link to={createPageUrl(`LearningPath?id=${path.id}`)}>
            <Button className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 group-hover:shadow-md transition-all">
              <Play className="w-4 h-4 mr-2" />
              {path.completion_percentage === 0 ? "Start Learning" : "Continue"}
            </Button>
          </Link>
        </div>

        <div className="flex justify-between items-center pt-2 border-t text-xs text-slate-500">
          <span>Created {format(new Date(path.created_date), "MMM d, yyyy")}</span>
          <span>{path.daily_modules?.length || 0} modules</span>
        </div>
      </CardContent>
    </Card>
  );
}