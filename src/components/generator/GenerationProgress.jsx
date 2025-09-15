import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Sparkles, BookOpen, Target } from "lucide-react";

export default function GenerationProgress({ step }) {
  return (
    <Card className="bg-white/90 backdrop-blur-md border-0 shadow-xl">
      <CardContent className="p-8">
        <div className="text-center space-y-6">
          <div className="flex items-center justify-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-green-500 rounded-2xl flex items-center justify-center shadow-lg animate-pulse">
              <Loader2 className="w-8 h-8 text-white animate-spin" />
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">
              Creating Your Learning Path
            </h3>
            <p className="text-slate-600">{step}</p>
          </div>

          <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
            <div className="flex flex-col items-center space-y-2 opacity-70">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-blue-600" />
              </div>
              <span className="text-xs text-slate-600">Analyzing</span>
            </div>
            <div className="flex flex-col items-center space-y-2 opacity-70">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-green-600" />
              </div>
              <span className="text-xs text-slate-600">Structuring</span>
            </div>
            <div className="flex flex-col items-center space-y-2 opacity-70">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <Target className="w-5 h-5 text-purple-600" />
              </div>
              <span className="text-xs text-slate-600">Personalizing</span>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-4">
            <p className="text-sm text-slate-600">
              We're creating a comprehensive learning plan with daily modules, 
              curated resources, and progress tracking just for you.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}