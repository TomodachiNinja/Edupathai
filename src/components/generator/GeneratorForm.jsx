import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, Lightbulb } from "lucide-react";

export default function GeneratorForm({ onSubmit, prefilledSubject = "" }) {
  const [formData, setFormData] = useState({
    topic: prefilledSubject,
    duration: "",
    skillLevel: "",
    dailyTime: "",
    specificGoals: ""
  });

  const [errors, setErrors] = useState({});
  const [suggestions] = useState([
    "Python Programming", "Web Development", "Data Science", "Machine Learning",
    "JavaScript", "React Development", "Mobile App Development", "Digital Marketing",
    "Cybersecurity", "Game Development", "UI/UX Design", "DevOps", "Blockchain",
    "Cloud Computing", "Artificial Intelligence", "Database Management"
  ]);

  useEffect(() => {
    if (prefilledSubject) {
      setFormData(prev => ({ ...prev, topic: prefilledSubject }));
    }
  }, [prefilledSubject]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.topic.trim()) newErrors.topic = "Topic is required";
    if (!formData.duration) newErrors.duration = "Duration is required";
    if (!formData.skillLevel) newErrors.skillLevel = "Skill level is required";
    if (!formData.dailyTime) newErrors.dailyTime = "Daily time commitment is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const handleSuggestionClick = (suggestion) => {
    handleInputChange("topic", suggestion);
  };

  return (
    <Card className="bg-white/90 backdrop-blur-md border-0 shadow-xl">
      <CardHeader className="text-center pb-6">
        <CardTitle className="text-2xl font-bold text-slate-800 flex items-center justify-center gap-2">
          <Sparkles className="w-6 h-6 text-blue-500" />
          Create Your Learning Path
        </CardTitle>
        <p className="text-slate-600">Fill out the details below to generate your personalized curriculum</p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="topic" className="text-sm font-semibold text-slate-700">
              What do you want to learn? *
            </Label>
            <Input
              id="topic"
              placeholder="e.g., Python Programming, Digital Marketing, Spanish"
              value={formData.topic}
              onChange={(e) => handleInputChange("topic", e.target.value)}
              className={`h-12 ${errors.topic ? "border-red-300" : "border-slate-200"}`}
            />
            {errors.topic && <p className="text-red-500 text-xs">{errors.topic}</p>}
            
            {/* Topic Suggestions */}
            <div className="mt-3">
              <div className="flex items-center gap-2 mb-2">
                <Lightbulb className="w-4 h-4 text-yellow-500" />
                <span className="text-xs font-medium text-slate-600">Popular Topics:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {suggestions.slice(0, 8).map((suggestion, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="px-3 py-1 text-xs bg-slate-100 hover:bg-blue-100 rounded-full transition-colors text-slate-700 hover:text-blue-700"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="duration" className="text-sm font-semibold text-slate-700">
                Learning Duration *
              </Label>
              <Select value={formData.duration} onValueChange={(value) => handleInputChange("duration", value)}>
                <SelectTrigger className={`h-12 ${errors.duration ? "border-red-300" : "border-slate-200"}`}>
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">1 Week (7 days)</SelectItem>
                  <SelectItem value="14">2 Weeks (14 days)</SelectItem>
                  <SelectItem value="21">3 Weeks (21 days)</SelectItem>
                  <SelectItem value="30">1 Month (30 days)</SelectItem>
                  <SelectItem value="60">2 Months (60 days)</SelectItem>
                  <SelectItem value="90">3 Months (90 days)</SelectItem>
                </SelectContent>
              </Select>
              {errors.duration && <p className="text-red-500 text-xs">{errors.duration}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="skillLevel" className="text-sm font-semibold text-slate-700">
                Current Skill Level *
              </Label>
              <Select value={formData.skillLevel} onValueChange={(value) => handleInputChange("skillLevel", value)}>
                <SelectTrigger className={`h-12 ${errors.skillLevel ? "border-red-300" : "border-slate-200"}`}>
                  <SelectValue placeholder="Select your level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner - New to this topic</SelectItem>
                  <SelectItem value="intermediate">Intermediate - Some experience</SelectItem>
                  <SelectItem value="advanced">Advanced - Significant experience</SelectItem>
                </SelectContent>
              </Select>
              {errors.skillLevel && <p className="text-red-500 text-xs">{errors.skillLevel}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="dailyTime" className="text-sm font-semibold text-slate-700">
              Daily Time Commitment *
            </Label>
            <Select value={formData.dailyTime} onValueChange={(value) => handleInputChange("dailyTime", value)}>
              <SelectTrigger className={`h-12 ${errors.dailyTime ? "border-red-300" : "border-slate-200"}`}>
                <SelectValue placeholder="Hours per day" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0.5">30 minutes per day</SelectItem>
                <SelectItem value="1">1 hour per day</SelectItem>
                <SelectItem value="1.5">1.5 hours per day</SelectItem>
                <SelectItem value="2">2 hours per day</SelectItem>
                <SelectItem value="3">3 hours per day</SelectItem>
                <SelectItem value="4">4+ hours per day</SelectItem>
              </SelectContent>
            </Select>
            {errors.dailyTime && <p className="text-red-500 text-xs">{errors.dailyTime}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="specificGoals" className="text-sm font-semibold text-slate-700">
              Specific Goals (Optional)
            </Label>
            <Textarea
              id="specificGoals"
              placeholder="e.g., Build a web application, Pass certification exam, Start freelancing, Get a new job..."
              value={formData.specificGoals}
              onChange={(e) => handleInputChange("specificGoals", e.target.value)}
              className="min-h-[100px] border-slate-200"
            />
            <p className="text-xs text-slate-500">
              Help us tailor your learning path to your specific objectives and career goals
            </p>
          </div>

          <Button
            type="submit"
            className="w-full h-12 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white font-semibold shadow-lg transition-all duration-200"
          >
            <Sparkles className="w-5 h-5 mr-2" />
            Generate My Learning Path
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}