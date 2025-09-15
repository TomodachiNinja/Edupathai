
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  PlayCircle, 
  BookOpen, 
  Code2, 
  CheckSquare, 
  Clock, 
  Target,
  Youtube,
  ExternalLink,
  StickyNote,
  ChevronDown,
  ChevronRight,
  CheckCircle, // Added for save status
  XCircle,     // Added for save status and clear button
  Save         // Added for save button
} from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import YouTubePlayer from "./YouTubePlayer";
import InteractiveCodeEditor from "./InteractiveCodeEditor";
import InteractiveAssessment from "./InteractiveAssessment";

export default function DailyModule({ module, progress, onUpdateProgress, currentDay }) {
  const [notes, setNotes] = useState(progress?.notes || "");
  const [notesChanged, setNotesChanged] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState(""); // "saved", "error", ""
  const [expandedSections, setExpandedSections] = useState({
    video: true,
    reading: false,
    exercise: false,
    assessment: false
  });

  // Update notes when progress changes or day changes
  useEffect(() => {
    setNotes(progress?.notes || "");
    setNotesChanged(false); // Reset notesChanged when new progress/day is loaded
    setSaveStatus(""); // Clear save status
  }, [progress, currentDay]);

  if (!module) {
    return (
      <Card className="bg-white/90 backdrop-blur-md border-0 shadow-lg">
        <CardContent className="p-8 text-center">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-800 mb-2">No Content Available</h3>
          <p className="text-slate-600">Content for Day {currentDay} is being prepared.</p>
        </CardContent>
      </Card>
    );
  }

  // Verify we have the correct module for the current day
  if (module.day !== currentDay) {
    return (
      <Card className="bg-white/90 backdrop-blur-md border-0 shadow-lg">
        <CardContent className="p-8 text-center">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Target className="w-8 h-8 text-yellow-600" />
          </div>
          <h3 className="text-lg font-semibold text-slate-800 mb-2">Content Mismatch</h3>
          <p className="text-slate-600">Expected Day {currentDay} content, but got Day {module.day}.</p>
        </CardContent>
      </Card>
    );
  }

  const handleNotesChange = (value) => {
    setNotes(value);
    setNotesChanged(true); // Mark notes as changed
    setSaveStatus(""); // Clear any previous save status when user starts typing again
  };

  const saveNotes = async () => {
    if (!notesChanged) return; // Only save if there are changes
    
    setIsSaving(true);
    setSaveStatus(""); // Clear previous status while saving
    try {
      await onUpdateProgress(currentDay, "notes", notes); // Assuming onUpdateProgress is async or returns a promise
      setNotesChanged(false); // No longer changed after successful save
      setSaveStatus("saved"); // Set success status
      
      // Show success message temporarily
      setTimeout(() => setSaveStatus(""), 2000);
    } catch (error) {
      setSaveStatus("error"); // Set error status
      console.error("Error saving notes:", error);
    } finally {
      setIsSaving(false); // Always stop saving state
    }
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Enhanced exercise data with interactive features
  const enhancedExercise = {
    title: module.practical_exercise?.task || "Coding Challenge",
    description: module.practical_exercise?.task || "Complete the coding exercise using today's concepts.",
    duration: module.practical_exercise?.duration || 20,
    starter_code: `# Day ${currentDay} - ${module.title}\n# ${module.practical_exercise?.task || 'Write your code here'}\n\n`,
    expected_output: module.practical_exercise?.expected_outcome || "Expected results will be shown here.",
    requirements: [
      module.practical_exercise?.task || "Complete the main task",
      module.practical_exercise?.expected_outcome || "Achieve the expected outcome",
      "Test your solution thoroughly",
      "Follow coding best practices"
    ],
    test_cases: [
      { name: 'Basic functionality', description: 'Code runs without errors' },
      { name: 'Expected output', description: 'Produces correct results' },
      { name: 'Code quality', description: 'Follows best practices' }
    ],
    hints: [
      "Start by understanding the problem requirements",
      "Break down the task into smaller steps",
      "Test your code with sample inputs",
      "Check the documentation for help with syntax"
    ]
  };

  // Enhanced assessment data with interactive features
  const enhancedAssessment = module.assessment ? module.assessment.map((question, index) => ({
    id: `day${currentDay}_q${index + 1}`,
    text: question,
    type: 'multiple_choice',
    options: [
      `Option A for: ${question.substring(0, 30)}...`,
      `Option B for: ${question.substring(0, 30)}...`,
      `Option C for: ${question.substring(0, 30)}...`,
      `Option D for: ${question.substring(0, 30)}...`
    ],
    correct_answer: 'b', // Mock correct answer
    explanation: "This is the correct answer because it demonstrates the key concept from today's lesson.",
    points: 10
  })) : [];

  const tasks = [
    {
      key: "video_completed",
      section: "video",
      label: "Video Learning",
      icon: PlayCircle,
      content: module.video_learning,
      color: "text-red-600",
      bgColor: "bg-red-50"
    },
    {
      key: "reading_completed", 
      section: "reading",
      label: "Reading Materials",
      icon: BookOpen,
      content: module.reading_materials,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      key: "exercise_completed",
      section: "exercise", 
      label: "Interactive Exercise", 
      icon: Code2,
      content: module.practical_exercise,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      key: "assessment_completed",
      section: "assessment",
      label: "Interactive Assessment",
      icon: CheckSquare,
      content: module.assessment,
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    }
  ];

  return (
    <div className="space-y-6">
      <Card className="bg-white/90 backdrop-blur-md border-0 shadow-lg">
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-xl mb-2">
                Day {currentDay}: {module.title}
              </CardTitle>
              <p className="text-slate-600 mb-4">{module.objective}</p>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Clock className="w-4 h-4" />
              {module.time_required}h
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-blue-500" />
            <span className="text-sm font-medium text-slate-700">Learning Objective</span>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {tasks.map((task) => (
            <Collapsible
              key={`${currentDay}-${task.key}`}
              open={expandedSections[task.section]}
              onOpenChange={() => toggleSection(task.section)}
            >
              <div className="space-y-3">
                <CollapsibleTrigger asChild>
                  <div className="flex items-center justify-between cursor-pointer hover:bg-slate-50 rounded-lg p-2 -m-2 transition-colors">
                    <div className="flex items-center gap-3">
                      <task.icon className={`w-5 h-5 ${task.color}`} />
                      <h3 className="font-semibold text-slate-800">{task.label}</h3>
                      {expandedSections[task.section] ? (
                        <ChevronDown className="w-4 h-4 text-slate-400" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-slate-400" />
                      )}
                    </div>
                    <Checkbox
                      checked={progress?.[task.key] || false}
                      onCheckedChange={(checked) => 
                        onUpdateProgress(currentDay, task.key, checked)
                      }
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                </CollapsibleTrigger>

                <CollapsibleContent className="ml-8 space-y-3">
                  {task.key === "video_completed" && task.content && (
                    <div className={`${task.bgColor} rounded-lg p-4`}>
                      <div className="mb-4">
                        <div className="flex items-start gap-3 mb-4">
                          <Youtube className="w-5 h-5 text-red-600 mt-0.5" />
                          <div className="flex-1">
                            <h4 className="font-medium text-slate-800 mb-1">
                              "{task.content.title}"
                            </h4>
                            <p className="text-sm text-slate-600 mb-2">
                              by {task.content.channel} • ~{task.content.duration} mins
                            </p>
                            {task.content.key_concepts && (
                              <div>
                                <p className="text-xs font-medium text-slate-700 mb-2">Key concepts to focus on:</p>
                                <div className="flex flex-wrap gap-1">
                                  {task.content.key_concepts.map((concept, index) => (
                                    <Badge key={index} variant="outline" className="text-xs">
                                      {concept}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <YouTubePlayer 
                        videoTitle={task.content.title}
                        channelName={task.content.channel}
                        onVideoFound={(videoId) => {
                          console.log("Video found for Day", currentDay, ":", videoId);
                        }}
                      />
                    </div>
                  )}

                  {task.key === "reading_completed" && task.content && Array.isArray(task.content) && (
                    <div className={`${task.bgColor} rounded-lg p-4`}>
                      <div className="space-y-3">
                        {task.content.map((material, index) => (
                          <div key={index} className="bg-white rounded-lg p-3 flex items-center justify-between">
                            <div>
                              <h4 className="font-medium text-slate-800">{material.title}</h4>
                              <p className="text-sm text-slate-600">{material.source} • {material.type}</p>
                            </div>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => {
                                const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(material.title + " " + material.source)}`;
                                window.open(searchUrl, '_blank');
                              }}
                            >
                              <ExternalLink className="w-3 h-3 mr-1" />
                              Find
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {task.key === "exercise_completed" && (
                    <div className="space-y-4">
                      <InteractiveCodeEditor
                        exercise={enhancedExercise}
                        currentDay={currentDay}
                        onComplete={(score) => {
                          console.log(`Exercise completed with score: ${score}`);
                          onUpdateProgress(currentDay, task.key, true);
                        }}
                      />
                    </div>
                  )}

                  {task.key === "assessment_completed" && enhancedAssessment.length > 0 && (
                    <div className="space-y-4">
                      <InteractiveAssessment
                        questions={enhancedAssessment}
                        currentDay={currentDay}
                        onComplete={(score, percentage) => {
                          console.log(`Assessment completed - Score: ${score}, Percentage: ${percentage}%`);
                          onUpdateProgress(currentDay, task.key, true);
                        }}
                      />
                    </div>
                  )}
                </CollapsibleContent>
              </div>
            </Collapsible>
          ))}

          {/* Enhanced Daily Notes Section */}
          <div className="border-t pt-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <StickyNote className="w-5 h-5 text-orange-500" />
                <label className="text-base font-semibold text-slate-700">
                  Daily Notes for Day {currentDay}
                </label>
              </div>
              <div className="flex items-center gap-2">
                {saveStatus === "saved" && (
                  <span className="text-xs text-green-600 flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    Saved successfully
                  </span>
                )}
                {saveStatus === "error" && (
                  <span className="text-xs text-red-600 flex items-center gap-1">
                    <XCircle className="w-3 h-3" />
                    Failed to save
                  </span>
                )}
                {notesChanged && !isSaving && saveStatus !== "saved" && (
                  <span className="text-xs text-orange-600">
                    Unsaved changes
                  </span>
                )}
              </div>
            </div>

            <div className="space-y-3">
              <Textarea
                placeholder={`Write your thoughts, questions, key learnings, or any notes for Day ${currentDay}...

You can include:
• Key concepts you learned
• Questions you have
• Ideas for practice
• Personal insights
• Areas that need more review`}
                value={notes}
                onChange={(e) => handleNotesChange(e.target.value)}
                className="min-h-[120px] resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              
              <div className="flex items-center justify-between">
                <div className="text-xs text-slate-500">
                  {notes.length} characters • Auto-save when you click Save Notes
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    onClick={saveNotes}
                    disabled={!notesChanged || isSaving}
                    size="sm"
                    className={`${
                      !notesChanged 
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                    } transition-all duration-200`}
                  >
                    {isSaving ? (
                      <>
                        <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin mr-1"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-3 h-3 mr-1" />
                        Save Notes
                      </>
                    )}
                  </Button>
                  
                  {notes.length > 0 && (
                    <Button
                      onClick={() => {
                        setNotes("");
                        setNotesChanged(true); // Mark as changed so save button can be enabled to clear
                        setSaveStatus(""); // Clear status
                      }}
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:text-red-700 hover:border-red-300"
                    >
                      <XCircle className="w-3 h-3 mr-1" />
                      Clear
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* Notes Tips */}
            {notes.length === 0 && (
              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="text-sm font-medium text-blue-800 mb-2">💡 Tips for effective note-taking:</h4>
                <ul className="text-xs text-blue-700 space-y-1">
                  <li>• Summarize key concepts in your own words</li>
                  <li>• Write down questions that come up during learning</li>
                  <li>• Note any challenges you faced and how you solved them</li>
                  <li>• Record ideas for future practice or projects</li>
                </ul>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
