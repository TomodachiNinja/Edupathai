
import React, { useState, useEffect, useCallback } from "react";
import { LearningPath } from "@/api/entities";
import { DailyProgress } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Plus, BookOpen } from "lucide-react";
import PathCard from "../components/my-paths/PathCard";

export default function MyPathsPage() {
  const [learningPaths, setLearningPaths] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const calculateCompletion = useCallback((path, progress) => {
    if (!progress || progress.length === 0) return 0;
    const totalDays = path.duration_days;
    if (totalDays === 0) return 0;

    const completedDays = progress.filter(p => {
        return [p.video_completed, p.reading_completed, p.exercise_completed, p.assessment_completed]
          .filter(Boolean).length >= 3;
    }).length;

    return Math.round((completedDays / totalDays) * 100);
  }, []);

  const loadPaths = useCallback(async () => {
    setIsLoading(true);
    try {
      const [paths, allProgress] = await Promise.all([
        LearningPath.list("-created_date"),
        DailyProgress.list()
      ]);

      const progressByPathId = allProgress.reduce((acc, p) => {
        if (!acc[p.learning_path_id]) {
          acc[p.learning_path_id] = [];
        }
        acc[p.learning_path_id].push(p);
        return acc;
      }, {});
      
      const pathsWithProgress = paths.map(path => {
        const progress = progressByPathId[path.id] || [];
        const completionPercentage = calculateCompletion(path, progress);
        
        return {
          ...path,
          completion_percentage: completionPercentage, // calculateCompletion already rounds
          progress_data: progress
        };
      });
      
      setLearningPaths(pathsWithProgress);
    } catch (error) {
      console.error("Error loading learning paths:", error);
    } finally {
      setIsLoading(false);
    }
  }, [calculateCompletion]);

  useEffect(() => {
    loadPaths();
  }, [loadPaths]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-green-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 mb-2">My Learning Paths</h1>
            <p className="text-slate-600">Continue your learning journey or create a new path</p>
          </div>
          <Link to={createPageUrl("Generator")}>
            <Button className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700">
              <Plus className="w-5 h-5 mr-2" />
              Create New Path
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-xl p-6 shadow-lg animate-pulse">
                <div className="h-4 bg-gray-200 rounded mb-4"></div>
                <div className="h-3 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded mb-4"></div>
                <div className="h-2 bg-gray-200 rounded mb-4"></div>
                <div className="flex gap-2">
                  <div className="h-6 bg-gray-200 rounded px-2"></div>
                  <div className="h-6 bg-gray-200 rounded px-2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : learningPaths.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <BookOpen className="w-12 h-12 text-blue-500" />
            </div>
            <h2 className="text-xl font-semibold text-slate-800 mb-4">No Learning Paths Yet</h2>
            <p className="text-slate-600 mb-8 max-w-md mx-auto">
              Create your first AI-powered learning path to start your educational journey with personalized daily modules and progress tracking.
            </p>
            <Link to={createPageUrl("Generator")}>
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700">
                <Plus className="w-5 h-5 mr-2" />
                Create Your First Path
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {learningPaths.map((path) => (
              <PathCard key={path.id} path={path} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
