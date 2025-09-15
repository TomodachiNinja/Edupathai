import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { 
  Play, 
  RotateCcw, 
  Lightbulb, 
  Save, 
  CheckCircle, 
  XCircle,
  Clock,
  Award
} from "lucide-react";

export default function InteractiveCodeEditor({ 
  exercise, 
  onComplete,
  currentDay 
}) {
  const [code, setCode] = useState(exercise?.starter_code || '# Your code here\n');
  const [output, setOutput] = useState('Click "Run Code" to see your output here...');
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState([]);
  const [showHints, setShowHints] = useState(false);
  const [currentHint, setCurrentHint] = useState(0);
  const [progress, setProgress] = useState(0);
  const [score, setScore] = useState(0);

  const runCode = async () => {
    setIsRunning(true);
    setOutput('Running your code...');
    
    // Simulate code execution
    setTimeout(() => {
      try {
        // Mock output based on exercise type
        const mockOutput = generateMockOutput(code, exercise);
        setOutput(mockOutput);
        
        // Run tests
        const results = runTests(code, exercise);
        setTestResults(results);
        
        // Calculate progress
        const passed = results.filter(r => r.passed).length;
        const newProgress = Math.round((passed / results.length) * 100);
        setProgress(newProgress);
        
        // Calculate score
        const newScore = passed * 10;
        setScore(newScore);
        
        if (newProgress === 100) {
          onComplete?.(newScore);
          showSuccessAnimation();
        }
      } catch (error) {
        setOutput(`Error: ${error.message}`);
      }
      setIsRunning(false);
    }, 1500);
  };

  const generateMockOutput = (code, exercise) => {
    if (code.includes('print') || code.includes('console.log')) {
      return `Output generated successfully!\n\nSample results:\n${exercise?.expected_output || 'Code executed without errors.'}`;
    }
    return 'No output generated. Try adding print statements to see results.';
  };

  const runTests = (code, exercise) => {
    const tests = exercise?.test_cases || [
      { name: 'Basic functionality', description: 'Code runs without errors' },
      { name: 'Expected output', description: 'Produces correct results' },
      { name: 'Code quality', description: 'Follows best practices' }
    ];

    return tests.map((test, index) => ({
      ...test,
      passed: Math.random() > 0.3, // Mock test results
      id: index
    }));
  };

  const resetCode = () => {
    setCode(exercise?.starter_code || '# Your code here\n');
    setOutput('Click "Run Code" to see your output here...');
    setTestResults([]);
    setProgress(0);
    setScore(0);
  };

  const showHint = () => {
    setShowHints(true);
    if (exercise?.hints && currentHint < exercise.hints.length - 1) {
      setCurrentHint(currentHint + 1);
    }
  };

  const showSuccessAnimation = () => {
    // Create floating success message
    const successEl = document.createElement('div');
    successEl.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg font-semibold z-50 animate-bounce';
    successEl.innerHTML = `🎉 Exercise Complete! +${score} XP`;
    document.body.appendChild(successEl);
    setTimeout(() => successEl.remove(), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Exercise Header */}
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-0">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5 text-purple-600" />
              🛠 Hands-on Exercise: {exercise?.title || 'Coding Challenge'}
            </CardTitle>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                ~{exercise?.duration || 20} mins
              </Badge>
              <Badge className="bg-purple-100 text-purple-800">
                🏆 {score} XP
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-white rounded-lg p-4">
              <h4 className="font-semibold text-slate-800 mb-2">🎯 Your Mission:</h4>
              <p className="text-slate-600">{exercise?.description || 'Complete the coding challenge using the skills you\'ve learned today.'}</p>
            </div>
            
            {exercise?.requirements && (
              <div className="bg-white rounded-lg p-4">
                <h4 className="font-semibold text-slate-800 mb-2">📝 Requirements:</h4>
                <ol className="list-decimal list-inside space-y-1 text-slate-600">
                  {exercise.requirements.map((req, index) => (
                    <li key={index}>{req}</li>
                  ))}
                </ol>
              </div>
            )}

            <div className="flex items-center justify-between bg-white rounded-lg p-4">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-slate-600">Progress:</span>
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <span className="text-sm font-semibold text-slate-800">{progress}%</span>
              </div>
              <div className="flex gap-2">
                {progress === 100 && <CheckCircle className="w-5 h-5 text-green-500" />}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Code Editor */}
      <Card className="bg-white border-0 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-gray-800 to-gray-700 text-white rounded-t-lg">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <span className="text-lg">💻 Code Editor</span>
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button
                onClick={runCode}
                disabled={isRunning}
                className="bg-green-600 hover:bg-green-700"
                size="sm"
              >
                <Play className="w-4 h-4 mr-1" />
                {isRunning ? 'Running...' : 'Run Code'}
              </Button>
              <Button onClick={resetCode} variant="outline" size="sm">
                <RotateCcw className="w-4 h-4 mr-1" />
                Reset
              </Button>
              <Button onClick={showHint} variant="outline" size="sm">
                <Lightbulb className="w-4 h-4 mr-1" />
                Hint
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="grid lg:grid-cols-2 min-h-[400px]">
            <div className="p-4 border-r">
              <Textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="min-h-[350px] font-mono text-sm border-0 resize-none focus:ring-0"
                placeholder="Write your code here..."
              />
            </div>
            <div className="p-4 bg-gray-900 text-green-400">
              <div className="flex items-center gap-2 mb-3 text-gray-300">
                <span className="text-sm font-medium">📤 Output Console</span>
              </div>
              <pre className="text-sm whitespace-pre-wrap font-mono">{output}</pre>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Test Results */}
      {testResults.length > 0 && (
        <Card className="bg-white border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              🧪 Test Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {testResults.map((test) => (
                <div 
                  key={test.id}
                  className={`flex items-center gap-3 p-3 rounded-lg ${
                    test.passed ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
                  }`}
                >
                  {test.passed ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-600" />
                  )}
                  <div className="flex-1">
                    <span className="font-medium text-slate-800">{test.name}</span>
                    <p className="text-sm text-slate-600">{test.description}</p>
                  </div>
                  <span className={`text-sm font-semibold ${
                    test.passed ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {test.passed ? 'Passed' : 'Failed'}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Hints */}
      {showHints && exercise?.hints && (
        <Card className="bg-yellow-50 border border-yellow-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-800">
              <Lightbulb className="w-5 h-5" />
              💡 Hint {currentHint + 1}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-yellow-800">{exercise.hints[currentHint]}</p>
            {currentHint < exercise.hints.length - 1 && (
              <Button 
                onClick={showHint} 
                variant="outline" 
                className="mt-3"
                size="sm"
              >
                Next Hint →
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}