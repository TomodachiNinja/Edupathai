import React, { useState, useEffect } from "react";
import { LearningPath } from "@/api/entities";
import { InvokeLLM } from "@/api/integrations";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import GeneratorForm from "../components/generator/GeneratorForm";
import GenerationProgress from "../components/generator/GenerationProgress";

export default function GeneratorPage() {
  const navigate = useNavigate();
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState("");
  const [prefilledSubject, setPrefilledSubject] = useState("");

  useEffect(() => {
    // Check for prefilled subject from URL params
    const urlParams = new URLSearchParams(window.location.search);
    const subjectParam = urlParams.get("subject");
    if (subjectParam) {
      setPrefilledSubject(decodeURIComponent(subjectParam));
    }
  }, []);

  const handleGenerate = async (data) => {
    setIsGenerating(true);
    setGenerationStep("Analyzing your learning request...");

    try {
      setGenerationStep("Creating comprehensive curriculum structure...");
      
      const prompt = `Create a comprehensive educational learning path for "${data.topic}". 

Requirements:
- Duration: ${data.duration} days
- Skill Level: ${data.skillLevel}
- Daily Time Commitment: ${data.dailyTime} hours
- Specific Goals: ${data.specificGoals || "General mastery of the topic"}

Create a detailed learning path with:

1. Overall learning objectives (3-5 main goals)
2. Prerequisites list  
3. Daily breakdown for each day (${data.duration} days total) with:
   - Specific learning objective
   - Video learning: realistic YouTube video title and popular channel name in the field
   - Reading materials: articles, documentation, books
   - Practical exercise with clear expected outcome
   - Assessment questions (3-4 questions)
   - Realistic time breakdown

4. Comprehensive resource library:
   - Popular YouTube channels for ${data.topic}
   - Essential books and documentation
   - Useful websites and tools
   - Community resources

Focus on:
- Progressive skill building from basics to advanced
- Real-world applications and projects
- Industry-standard tools and practices
- Practical exercises that reinforce learning
- Clear milestones and achievements

Make this actionable and comprehensive for ${data.skillLevel} level learners.`;

      const response = await InvokeLLM({
        prompt,
        response_json_schema: {
          type: "object",
          properties: {
            title: { type: "string" },
            description: { type: "string" },
            prerequisites: { type: "array", items: { type: "string" } },
            learning_objectives: { type: "array", items: { type: "string" } },
            daily_modules: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  day: { type: "number" },
                  title: { type: "string" },
                  objective: { type: "string" },
                  time_required: { type: "number" },
                  video_learning: {
                    type: "object",
                    properties: {
                      title: { type: "string" },
                      channel: { type: "string" },
                      duration: { type: "number" },
                      key_concepts: { type: "array", items: { type: "string" } }
                    }
                  },
                  reading_materials: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        title: { type: "string" },
                        source: { type: "string" },
                        type: { type: "string" }
                      }
                    }
                  },
                  practical_exercise: {
                    type: "object",
                    properties: {
                      task: { type: "string" },
                      expected_outcome: { type: "string" },
                      duration: { type: "number" }
                    }
                  },
                  assessment: { type: "array", items: { type: "string" } }
                }
              }
            },
            resources: {
              type: "object",
              properties: {
                youtube_channels: { type: "array", items: { type: "string" } },
                books: { type: "array", items: { type: "string" } },
                websites: { type: "array", items: { type: "string" } },
                tools: { type: "array", items: { type: "string" } }
              }
            }
          }
        }
      });

      setGenerationStep("Saving your personalized learning path...");

      const learningPath = await LearningPath.create({
        title: response.title,
        topic: data.topic,
        duration_days: parseInt(data.duration),
        skill_level: data.skillLevel,
        daily_time_hours: parseFloat(data.dailyTime),
        description: response.description,
        prerequisites: response.prerequisites,
        learning_objectives: response.learning_objectives,
        daily_modules: response.daily_modules,
        resources: response.resources,
        completion_percentage: 0
      });

      setGenerationStep("Redirecting to your learning path...");
      setTimeout(() => {
        navigate(createPageUrl(`LearningPath?id=${learningPath.id}`));
      }, 1000);

    } catch (error) {
      console.error("Error generating learning path:", error);
      setGenerationStep("Error generating path. Please try again.");
      setTimeout(() => setIsGenerating(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-green-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-green-500 rounded-2xl flex items-center justify-center shadow-lg">
              <Sparkles className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              AI Learning Path Generator
            </h1>
          </div>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto leading-relaxed">
            Create personalized, comprehensive learning journeys with daily modules, 
            curated resources, and progress tracking for any subject.
          </p>
        </div>

        {isGenerating ? (
          <GenerationProgress step={generationStep} />
        ) : (
          <GeneratorForm 
            onSubmit={handleGenerate} 
            prefilledSubject={prefilledSubject}
          />
        )}

        {/* Feature highlights */}
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          {[
            {
              title: "AI-Powered Curriculum",
              description: "Advanced AI creates structured daily modules tailored to your learning style"
            },
            {
              title: "Interactive Progress",
              description: "Track completion, take notes, and monitor your learning journey"
            },
            {
              title: "Curated Resources", 
              description: "Hand-picked videos, articles, and tools from industry experts"
            }
          ].map((feature, index) => (
            <div key={index} className="bg-white/80 backdrop-blur-md rounded-xl p-6 text-center shadow-lg">
              <h3 className="font-semibold text-slate-800 mb-2">{feature.title}</h3>
              <p className="text-slate-600 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}