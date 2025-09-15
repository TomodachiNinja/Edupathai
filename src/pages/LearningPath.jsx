
import React, { useState, useEffect, useCallback } from "react";
import { LearningPath } from "@/api/entities";
import { DailyProgress } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, ArrowRight, ArrowLeft as PrevIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import LearningPathHeader from "../components/learning-path/LearningPathHeader";
import ProgressOverview from "../components/learning-path/ProgressOverview";
import DailyModule from "../components/learning-path/DailyModule";
import ResourceLibrary from "../components/learning-path/ResourceLibrary";

export default function LearningPathPage() {
  const navigate = useNavigate();
  const [learningPath, setLearningPath] = useState(null);
  const [progress, setProgress] = useState([]);
  const [activeDay, setActiveDay] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const urlParams = new URLSearchParams(window.location.search);
  const pathId = urlParams.get("id");
  const dayParam = urlParams.get("day"); // Added: Read day from URL parameter

  const loadLearningPath = useCallback(async () => {
    if (!pathId) {
      navigate(createPageUrl("MyPaths")); // Changed from Generator/Dashboard
      return;
    }

    try {
      const [paths, progressData] = await Promise.all([
        LearningPath.list(),
        DailyProgress.filter({ learning_path_id: pathId })
      ]);
      const path = paths.find(p => p.id === pathId);
      
      if (!path) {
        navigate(createPageUrl("MyPaths")); // Changed from Generator/Dashboard
        return;
      }

      setLearningPath(path);
      setProgress(progressData);

      // Set active day from URL parameter or find first uncompleted day
      if (dayParam && !isNaN(dayParam)) {
        const dayNumber = parseInt(dayParam);
        if (dayNumber >= 1 && dayNumber <= path.duration_days) {
          setActiveDay(dayNumber);
        } else {
          setActiveDay(1); // Fallback to day 1 if URL param is invalid or out of bounds
        }
      } else {
        const uncompletedDay = findFirstUncompletedDay(progressData, path.duration_days);
        setActiveDay(uncompletedDay);
      }
    } catch (error) {
      console.error("Error loading learning path:", error);
    } finally {
      setIsLoading(false);
    }
  }, [pathId, dayParam, navigate]); // Added dayParam to dependencies

  useEffect(() => {
    loadLearningPath();
  }, [loadLearningPath]);

  const findFirstUncompletedDay = (progressData, totalDays) => {
    for (let day = 1; day <= totalDays; day++) {
      const dayProgress = progressData.find(p => p.day === day);
      if (!dayProgress) return day;
      
      const completedTasks = [
        dayProgress.video_completed,
        dayProgress.reading_completed,
        dayProgress.exercise_completed,
        dayProgress.assessment_completed
      ].filter(Boolean).length;
      
      if (completedTasks < 4) return day;
    }
    return 1; // All completed, return to first day
  };

  const updateProgress = async (day, field, value) => {
    const existing = progress.find(p => p.day === day);
    let updatedProgress;
    
    if (existing) {
      updatedProgress = await DailyProgress.update(existing.id, { [field]: value });
      setProgress(prev => prev.map(p => p.id === existing.id ? updatedProgress : p));
    } else {
      updatedProgress = await DailyProgress.create({
        learning_path_id: pathId,
        day,
        [field]: value
      });
      setProgress(prev => [...prev, updatedProgress]);
    }
  };

  const navigateDay = (direction) => {
    if (!learningPath) return;
    
    const newDay = direction === 'next' 
      ? Math.min(activeDay + 1, learningPath.duration_days)
      : Math.max(activeDay - 1, 1);
    
    setActiveDay(newDay);
    
    // Update URL to include day parameter for better navigation
    const newUrl = createPageUrl(`LearningPath?id=${pathId}&day=${newDay}`);
    window.history.replaceState({}, '', newUrl);
  };

  const exportToGoogleDocs = () => {
    if (!learningPath) return;

    const content = `# Learning Path: ${learningPath.title}

**Duration:** ${learningPath.duration_days} days
**Skill Level:** ${learningPath.skill_level}
**Daily Time Commitment:** ${learningPath.daily_time_hours} hours

## Description
${learningPath.description}

## Prerequisites
${learningPath.prerequisites?.map(p => `• ${p}`).join('\n') || 'None'}

## Learning Objectives
${learningPath.learning_objectives?.map(o => `• ${o}`).join('\n') || 'Not specified'}

## Daily Schedule

${learningPath.daily_modules?.map(module => `
### Day ${module.day}: ${module.title}
**Objective:** ${module.objective}
**Time Required:** ${module.time_required} hours

#### Video Learning
• **Video:** "${module.video_learning?.title}" by ${module.video_learning?.channel}
• **Duration:** ${module.video_learning?.duration} minutes
• **Key concepts:** ${module.video_learning?.key_concepts?.join(', ') || 'Not specified'}

#### Reading Materials
${module.reading_materials?.map(rm => `• ${rm.title} (${rm.source})`).join('\n') || 'None specified'}

#### Practical Exercise
**Task:** ${module.practical_exercise?.task || 'Not specified'}
**Expected outcome:** ${module.practical_exercise?.expected_outcome || 'Not specified'}

#### Assessment
${module.assessment?.map(a => `• ${a}`).join('\n') || 'None specified'}

---
`).join('\n') || 'No modules defined'}

## Resources

### YouTube Channels
${learningPath.resources?.youtube_channels?.join(', ') || 'None specified'}

### Books
${learningPath.resources?.books?.join(', ') || 'None specified'}

### Websites
${learningPath.resources?.websites?.join(', ') || 'None specified'}

### Tools
${learningPath.resources?.tools?.join(', ') || 'None specified'}

---
*Generated by EduPath AI Learning Management System*`;

    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${learningPath.title.replace(/\s+/g, '_')}_Learning_Path.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-green-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading your learning path...</p>
        </div>
      </div>
    );
  }

  if (!learningPath) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-green-50">
        <div className="text-center">
          <p className="mb-4">Learning path not found</p>
          <Button onClick={() => navigate(createPageUrl("MyPaths"))}> {/* Changed from Dashboard */}
            Back to My Paths
          </Button>
        </div>
      </div>
    );
  }

  // Get the correct module and progress for the active day
  const currentModule = learningPath.daily_modules?.find(m => m.day === activeDay);
  const currentProgress = progress.find(p => p.day === activeDay);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-green-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Navigation Header */}
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="outline"
            onClick={() => navigate(createPageUrl("MyPaths"))}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to My Paths
          </Button>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              onClick={() => navigateDay('prev')}
              disabled={activeDay === 1}
              size="sm"
            >
              <PrevIcon className="w-4 h-4 mr-1" />
              Previous Day
            </Button>
            <Button 
              variant="outline"
              onClick={() => navigateDay('next')}
              disabled={activeDay === learningPath.duration_days}
              size="sm"
            >
              Next Day
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
            <Button variant="outline" onClick={exportToGoogleDocs}>
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        <LearningPathHeader learningPath={learningPath} progress={progress} />
        
        <div className="grid lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <ProgressOverview 
              learningPath={learningPath}
              progress={progress}
              activeDay={activeDay}
              onDaySelect={setActiveDay}
            />
          </div>
          
          <div className="lg:col-span-2">
            <DailyModule
              module={currentModule} // Pass the specific module for the active day
              progress={currentProgress} // Pass the specific progress for the active day
              onUpdateProgress={updateProgress}
              currentDay={activeDay}
              totalDays={learningPath.duration_days}
              onNavigateDay={navigateDay}
            />
          </div>
          
          <div className="lg:col-span-1">
            <ResourceLibrary resources={learningPath.resources} />
          </div>
        </div>
      </div>
    </div>
  );
}
