import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Clock, BookOpen, Play } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function RecentPaths({ paths }) {
  return (
    <Card className="bg-white/90 backdrop-blur-md border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-blue-500" />
          Recent Learning Paths
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {paths.slice(0, 6).map(path => (
            <Card key={path.id} className="bg-gradient-to-br from-slate-50 to-slate-100 hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="mb-3">
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="outline" className="text-xs">
                      {path.skill_level}
                    </Badge>
                    <span className="text-xs text-slate-500">
                      {path.completion_percentage}%
                    </span>
                  </div>
                  <h3 className="font-semibold text-slate-800 line-clamp-2 mb-2">
                    {path.title}
                  </h3>
                  <div className="flex items-center gap-4 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {path.duration_days}d
                    </span>
                    <span>{path.daily_time_hours}h/day</span>
                  </div>
                </div>
                
                <div className="mb-4">
                  <Progress value={path.completion_percentage} className="h-2" />
                </div>

                <Link to={createPageUrl(`LearningPath?id=${path.id}`)}>
                  <Button size="sm" className="w-full">
                    <Play className="w-3 h-3 mr-1" />
                    {path.completion_percentage === 0 ? "Start" : "Continue"}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}