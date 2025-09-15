import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, BookOpen, Play, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function SearchResults({ results, isSearching, searchQuery }) {
  if (isSearching) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-slate-800">Searching...</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => (
            <Card key={i} className="bg-white/90 backdrop-blur-md">
              <CardContent className="p-6">
                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-3 w-full mb-4" />
                <Skeleton className="h-8 w-20" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (results.length === 0 && searchQuery) {
    return (
      <Card className="bg-white/90 backdrop-blur-md border-0 shadow-lg">
        <CardContent className="p-8 text-center">
          <Search className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-slate-800 mb-2">
            No results found for "{searchQuery}"
          </h3>
          <p className="text-slate-600 mb-6">
            Don't worry! You can create a custom learning path for any topic.
          </p>
          <Link to={createPageUrl(`Generator?subject=${encodeURIComponent(searchQuery)}`)}>
            <Button className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700">
              <Plus className="w-4 h-4 mr-2" />
              Create Learning Path for "{searchQuery}"
            </Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  const pathResults = results.filter(r => r.type === 'path');
  const subjectResults = results.filter(r => r.type === 'subject');

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-slate-800">
        Search Results for "{searchQuery}" ({results.length})
      </h2>

      {pathResults.length > 0 && (
        <div>
          <h3 className="text-lg font-medium text-slate-700 mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Existing Learning Paths ({pathResults.length})
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pathResults.map(path => (
              <Card key={path.id} className="bg-white/90 backdrop-blur-md hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <Badge variant="outline" className="mb-2">
                      {path.skill_level}
                    </Badge>
                    <span className="text-xs text-slate-500">
                      {path.completion_percentage || 0}% complete
                    </span>
                  </div>
                  <CardTitle className="text-lg">{path.title}</CardTitle>
                  <p className="text-sm text-slate-600 line-clamp-2">
                    {path.description}
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center text-sm text-slate-500 mb-4">
                    <span>{path.duration_days} days</span>
                    <span>{path.daily_time_hours}h/day</span>
                  </div>
                  <Link to={createPageUrl(`LearningPath?id=${path.id}`)}>
                    <Button className="w-full">
                      <Play className="w-4 h-4 mr-2" />
                      Continue Learning
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {subjectResults.length > 0 && (
        <div>
          <h3 className="text-lg font-medium text-slate-700 mb-4 flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Available Subjects ({subjectResults.length})
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {subjectResults.map((subject, index) => (
              <Card key={index} className="bg-white/90 backdrop-blur-md hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <h4 className="font-semibold text-slate-800 mb-2">{subject.name}</h4>
                  <p className="text-sm text-slate-600 mb-4">{subject.description}</p>
                  <Link to={createPageUrl(`Generator?subject=${encodeURIComponent(subject.name)}`)}>
                    <Button variant="outline" className="w-full">
                      <Plus className="w-4 h-4 mr-2" />
                      Create Learning Path
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Always show option to create custom path */}
      <Card className="bg-gradient-to-r from-blue-50 to-green-50 border-0">
        <CardContent className="p-6 text-center">
          <h3 className="font-semibold text-slate-800 mb-2">
            Don't see what you're looking for?
          </h3>
          <p className="text-slate-600 mb-4">
            Create a custom learning path for any topic you want to master.
          </p>
          <Link to={createPageUrl(`Generator?subject=${encodeURIComponent(searchQuery)}`)}>
            <Button className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700">
              <Plus className="w-4 h-4 mr-2" />
              Create Custom Path for "{searchQuery}"
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}