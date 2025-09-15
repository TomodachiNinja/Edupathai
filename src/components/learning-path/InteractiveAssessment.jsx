import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { 
  CheckCircle, 
  XCircle, 
  Award, 
  Target,
  RotateCcw,
  ArrowRight,
  Trophy
} from "lucide-react";

export default function InteractiveAssessment({ 
  questions, 
  onComplete,
  currentDay 
}) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showFeedback, setShowFeedback] = useState({});
  const [score, setScore] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0);

  React.useEffect(() => {
    const timer = setInterval(() => setTimeSpent(t => t + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswer = (questionId, answer) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const checkAnswer = (questionIndex) => {
    const question = questions[questionIndex];
    const userAnswer = answers[question.id];
    const isCorrect = userAnswer === question.correct_answer;
    
    setShowFeedback(prev => ({
      ...prev,
      [questionIndex]: { correct: isCorrect, shown: true }
    }));

    if (isCorrect) {
      const points = question.points || 10;
      setScore(prev => prev + points);
      showScoreAnimation(points);
    }
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      completeAssessment();
    }
  };

  const completeAssessment = () => {
    setIsCompleted(true);
    const totalPoints = questions.reduce((sum, q) => sum + (q.points || 10), 0);
    const percentage = Math.round((score / totalPoints) * 100);
    onComplete?.(score, percentage);
    showCompletionAnimation();
  };

  const showScoreAnimation = (points) => {
    const scoreEl = document.createElement('div');
    scoreEl.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg font-semibold z-50 animate-bounce';
    scoreEl.innerHTML = `+${points} points!`;
    document.body.appendChild(scoreEl);
    setTimeout(() => scoreEl.remove(), 2000);
  };

  const showCompletionAnimation = () => {
    const confetti = document.createElement('div');
    confetti.className = 'fixed inset-0 pointer-events-none z-50';
    confetti.innerHTML = '🎉'.repeat(20);
    confetti.style.cssText = 'font-size: 2rem; animation: confetti 3s ease-out;';
    document.body.appendChild(confetti);
    setTimeout(() => confetti.remove(), 3000);
  };

  const restartAssessment = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setShowFeedback({});
    setScore(0);
    setIsCompleted(false);
    setTimeSpent(0);
  };

  const progressPercentage = ((currentQuestion + 1) / questions.length) * 100;

  if (isCompleted) {
    return <AssessmentComplete score={score} questions={questions} onRestart={restartAssessment} timeSpent={timeSpent} />;
  }

  const question = questions[currentQuestion];
  const feedback = showFeedback[currentQuestion];

  return (
    <div className="space-y-6">
      {/* Assessment Header */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-0">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-600" />
              🎯 Interactive Assessment - Day {currentDay}
            </CardTitle>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="flex items-center gap-1">
                ⏱ {formatTime(timeSpent)}
              </Badge>
              <Badge className="bg-blue-100 text-blue-800">
                🏆 {score} points
              </Badge>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-600">Progress</span>
              <span className="text-sm font-semibold text-slate-800">
                {currentQuestion + 1}/{questions.length} questions
              </span>
            </div>
            <Progress value={progressPercentage} className="h-3" />
          </div>
        </CardHeader>
      </Card>

      {/* Question Card */}
      <Card className="bg-white border-0 shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge className="bg-blue-600 text-white">Q{currentQuestion + 1}</Badge>
              <Badge variant="outline">{question.type || 'Multiple Choice'}</Badge>
            </div>
            <Badge className="bg-green-100 text-green-800">
              +{question.points || 10} points
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <h3 className="text-lg font-semibold text-slate-800">{question.text}</h3>

          {/* Multiple Choice Question */}
          {(!question.type || question.type === 'multiple_choice') && (
            <div className="space-y-3">
              {question.options.map((option, index) => {
                const optionKey = String.fromCharCode(97 + index); // a, b, c, d
                const isSelected = answers[question.id] === optionKey;
                const isCorrect = optionKey === question.correct_answer;
                const showResult = feedback?.shown;
                
                return (
                  <label
                    key={optionKey}
                    className={`block p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      isSelected && !showResult ? 'border-blue-500 bg-blue-50' :
                      showResult && isCorrect ? 'border-green-500 bg-green-50' :
                      showResult && isSelected && !isCorrect ? 'border-red-500 bg-red-50' :
                      'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name={`question-${question.id}`}
                        value={optionKey}
                        checked={isSelected}
                        onChange={(e) => handleAnswer(question.id, e.target.value)}
                        disabled={showResult}
                        className="w-4 h-4"
                      />
                      <span className="flex-1">{option}</span>
                      {showResult && isCorrect && <CheckCircle className="w-5 h-5 text-green-600" />}
                      {showResult && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-red-600" />}
                    </div>
                  </label>
                );
              })}
            </div>
          )}

          {/* Code Challenge Question */}
          {question.type === 'code_challenge' && (
            <div className="space-y-4">
              <div className="bg-gray-100 p-4 rounded-lg">
                <pre className="text-sm"><code>{question.code_template}</code></pre>
              </div>
              <div className="space-y-2">
                {question.blanks?.map((blank, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <label className="text-sm font-medium">{blank.label}:</label>
                    <Input
                      placeholder={blank.placeholder}
                      value={answers[`${question.id}_${index}`] || ''}
                      onChange={(e) => handleAnswer(`${question.id}_${index}`, e.target.value)}
                      className="max-w-xs"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Drag & Drop Question */}
          {question.type === 'drag_drop' && (
            <DragDropQuestion 
              question={question}
              onAnswer={(answer) => handleAnswer(question.id, answer)}
            />
          )}

          {/* Feedback */}
          {feedback?.shown && (
            <div className={`p-4 rounded-lg ${
              feedback.correct ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
            }`}>
              <div className="flex items-start gap-2">
                {feedback.correct ? (
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-600 mt-0.5" />
                )}
                <div className="flex-1">
                  <h5 className={`font-semibold ${feedback.correct ? 'text-green-800' : 'text-red-800'}`}>
                    {feedback.correct ? '✅ Correct!' : '❌ Incorrect'}
                  </h5>
                  <p className={`text-sm ${feedback.correct ? 'text-green-700' : 'text-red-700'}`}>
                    {question.explanation}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between pt-4">
            <div>
              {!feedback?.shown && answers[question.id] && (
                <Button onClick={() => checkAnswer(currentQuestion)}>
                  Check Answer
                </Button>
              )}
            </div>
            <div>
              {feedback?.shown && (
                <Button onClick={nextQuestion} className="flex items-center gap-2">
                  {currentQuestion === questions.length - 1 ? (
                    <>Complete Assessment <Trophy className="w-4 h-4" /></>
                  ) : (
                    <>Next Question <ArrowRight className="w-4 h-4" /></>
                  )}
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function AssessmentComplete({ score, questions, onRestart, timeSpent }) {
  const totalPoints = questions.reduce((sum, q) => sum + (q.points || 10), 0);
  const percentage = Math.round((score / totalPoints) * 100);
  const grade = percentage >= 90 ? 'A' : percentage >= 80 ? 'B' : percentage >= 70 ? 'C' : percentage >= 60 ? 'D' : 'F';

  return (
    <Card className="bg-white border-0 shadow-lg">
      <CardContent className="p-8 text-center">
        <div className="mb-6">
          <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Trophy className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">🎉 Assessment Complete!</h2>
          <p className="text-slate-600">Great job completing the assessment!</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg">
            <div className="text-3xl font-bold text-green-600">{score}</div>
            <div className="text-sm text-green-700">Total Points</div>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg">
            <div className="text-3xl font-bold text-blue-600">{percentage}%</div>
            <div className="text-sm text-blue-700">Score Percentage</div>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-lg">
            <div className="text-3xl font-bold text-purple-600">{grade}</div>
            <div className="text-sm text-purple-700">Final Grade</div>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 justify-center">
          <Button onClick={onRestart} variant="outline" className="flex items-center gap-2">
            <RotateCcw className="w-4 h-4" />
            Retake Assessment
          </Button>
          <Button className="flex items-center gap-2">
            <ArrowRight className="w-4 h-4" />
            Continue to Next Day
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function DragDropQuestion({ question, onAnswer }) {
  const [draggedItems, setDraggedItems] = useState([]);
  
  // Implementation for drag and drop would go here
  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <p className="text-sm text-gray-600 mb-2">Drag and drop functionality coming soon!</p>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h5 className="font-medium mb-2">Items to arrange:</h5>
          {question.items?.map((item, index) => (
            <div key={index} className="bg-white p-2 rounded mb-2 cursor-move">
              {item}
            </div>
          ))}
        </div>
        <div>
          <h5 className="font-medium mb-2">Drop zones:</h5>
          {question.drop_zones?.map((zone, index) => (
            <div key={index} className="border-2 border-dashed border-gray-300 p-4 rounded mb-2 min-h-[50px]">
              {zone.label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}