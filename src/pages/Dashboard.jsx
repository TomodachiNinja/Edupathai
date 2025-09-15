
import React, { useState, useEffect, useCallback } from "react";
import { LearningPath } from "@/api/entities";
import { Subject } from "@/api/entities";
import { DailyProgress } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import {
  Search,
  Plus,
  BookOpen,
  TrendingUp,
  Clock,
  Target,
  Star,
  Code,
  Smartphone,
  Database,
  Globe,
  Palette,
  Briefcase,
  Languages
} from "lucide-react";
import PopularSubjects from "../components/dashboard/PopularSubjects";
import RecentPaths from "../components/dashboard/RecentPaths";
import SearchResults from "../components/dashboard/SearchResults";
import QuickStats from "../components/dashboard/QuickStats";

export default function DashboardPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [recentPaths, setRecentPaths] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [userStats, setUserStats] = useState({
    totalPaths: 0,
    completedPaths: 0,
    inProgress: 0,
    totalHours: 0
  });

  const calculateCompletion = useCallback((path, progress) => {
    if (!progress || progress.length === 0) return 0;
    const totalDays = path.duration_days;
    if (totalDays === 0) return 0;

    const completedDays = progress.filter(p => {
      const tasksCompleted = [
        p.video_completed,
        p.reading_completed,
        p.exercise_completed,
        p.assessment_completed
      ].filter(Boolean).length;
      return tasksCompleted >= 3;
    }).length;
    return Math.round((completedDays / totalDays) * 100);
  }, []);

  const loadDashboardData = useCallback(async () => {
    try {
      const [subjectData, allPaths, allProgress] = await Promise.all([
        Subject.list(),
        LearningPath.list(),
        DailyProgress.list()
      ]);

      setSubjects(subjectData);

      const progressByPathId = allProgress.reduce((acc, p) => {
        if (!acc[p.learning_path_id]) {
          acc[p.learning_path_id] = [];
        }
        acc[p.learning_path_id].push(p);
        return acc;
      }, {});

      const allPathsWithProgress = allPaths.map(path => {
        const progress = progressByPathId[path.id] || [];
        const completionPercentage = calculateCompletion(path, progress);
        return { ...path, completion_percentage: completionPercentage };
      });

      // Set recent paths by sorting and slicing
      const sortedPaths = [...allPathsWithProgress].sort((a, b) => new Date(b.created_date) - new Date(a.created_date));
      setRecentPaths(sortedPaths.slice(0, 6));

      // Calculate user stats
      const completed = allPathsWithProgress.filter(p => p.completion_percentage === 100).length;
      const inProgress = allPathsWithProgress.filter(p => p.completion_percentage > 0 && p.completion_percentage < 100).length;
      const totalHours = allPaths.reduce((sum, path) => sum + (path.duration_days * path.daily_time_hours), 0);

      setUserStats({
        totalPaths: allPaths.length,
        completedPaths: completed,
        inProgress,
        totalHours
      });
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    }
  }, [calculateCompletion]);

  const handleSearch = useCallback(async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    try {
      // Search in existing paths
      const paths = await LearningPath.list(); // This call is still made as per the outline
      const pathResults = paths.filter(path =>
        path.title.toLowerCase().includes(query.toLowerCase()) ||
        path.topic.toLowerCase().includes(query.toLowerCase()) ||
        path.description?.toLowerCase().includes(query.toLowerCase())
      );

      // Search in subjects - depends on the 'subjects' state
      const subjectResults = subjects.filter(subject =>
        subject.name.toLowerCase().includes(query.toLowerCase()) ||
        subject.description?.toLowerCase().includes(query.toLowerCase())
      );

      setSearchResults([
        ...pathResults.map(p => ({ ...p, type: 'path' })),
        ...subjectResults.map(s => ({ ...s, type: 'subject' }))
      ]);
    } catch (error) {
      console.error("Search error:", error);
    }
    setIsSearching(false);
  }, [subjects]);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      handleSearch(searchQuery);
    }, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery, handleSearch]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-green-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
            Welcome to EduPath AI
          </h1>
          <p className="text-slate-600 text-lg mb-6">
            Your personalized learning journey starts here. Search for any topic or browse popular subjects.
          </p>

          {/* Search Bar */}
          <div className="relative max-w-2xl">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <Input
              placeholder="Search for any subject: Python, Web Development, Data Science..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-3 text-lg bg-white/90 backdrop-blur-md border-0 shadow-lg"
            />
          </div>
        </div>

        {searchQuery ? (
          <SearchResults
            results={searchResults}
            isSearching={isSearching}
            searchQuery={searchQuery}
          />
        ) : (
          <div className="space-y-8">
            {/* Quick Stats */}
            <QuickStats stats={userStats} />

            {/* Popular Subjects */}
            <PopularSubjects subjects={subjects} />

            {/* Recent Learning Paths */}
            {recentPaths.length > 0 && (
              <RecentPaths paths={recentPaths} />
            )}

            {/* Quick Actions */}
            <Card className="bg-white/90 backdrop-blur-md border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="w-5 h-5 text-blue-500" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <Link to={createPageUrl("Generator")}>
                    <Button className="w-full h-16 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-lg">
                      <Plus className="w-5 h-5 mr-2" />
                      Create Custom Learning Path
                    </Button>
                  </Link>
                  <Link to={createPageUrl("MyPaths")}>
                    <Button variant="outline" className="w-full h-16 text-lg">
                      <BookOpen className="w-5 h-5 mr-2" />
                      View My Learning Paths
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
