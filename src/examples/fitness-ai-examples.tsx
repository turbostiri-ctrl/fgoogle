/**
 * FITNESS APPLICATION AI EXAMPLES
 *
 * This file demonstrates how to use the OpenAI GPT Chat hooks
 * for various fitness application features.
 *
 * DO NOT IMPORT THIS FILE - These are reference examples only.
 */

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';
import {
  useOpenAIGPTChatMutation,
  useChatConversation,
  type ChatMessage,
} from '@/hooks/use-openai-gpt-chat';

// ============================================================================
// EXAMPLE 1: Personalized Workout Plan Generator
// ============================================================================

interface WorkoutPreferences {
  goal: 'muscle' | 'weight-loss' | 'endurance' | 'flexibility';
  level: 'beginner' | 'intermediate' | 'advanced';
  daysPerWeek: number;
  equipment: string[];
}

export function WorkoutPlanGenerator() {
  const [preferences, setPreferences] = useState<WorkoutPreferences>({
    goal: 'muscle',
    level: 'intermediate',
    daysPerWeek: 3,
    equipment: ['dumbbells', 'resistance bands'],
  });
  const [workoutPlan, setWorkoutPlan] = useState<string>('');

  const chatMutation = useOpenAIGPTChatMutation();

  const generatePlan = async () => {
    try {
      const result = await chatMutation.mutateAsync({
        messages: [
          {
            role: 'system',
            content:
              'You are a certified personal trainer with 10 years of experience. Create detailed, safe, and effective workout plans.',
          },
          {
            role: 'user',
            content: `Create a ${preferences.daysPerWeek}-day per week workout plan for someone with:
- Goal: ${preferences.goal}
- Fitness Level: ${preferences.level}
- Available Equipment: ${preferences.equipment.join(', ')}

Include exercises, sets, reps, and rest periods. Make it detailed and actionable.`,
          },
        ],
      });

      setWorkoutPlan(result.content);
    } catch (error) {
      console.error('Failed to generate workout plan:', error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Workout Plan Generator</CardTitle>
        <CardDescription>Get a personalized workout plan based on your goals</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Preference inputs would go here */}

        <Button onClick={generatePlan} disabled={chatMutation.isPending}>
          {chatMutation.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating Plan...
            </>
          ) : (
            'Generate Workout Plan'
          )}
        </Button>

        {chatMutation.error && (
          <Alert variant="destructive">
            <AlertDescription>{chatMutation.error.message}</AlertDescription>
          </Alert>
        )}

        {workoutPlan && (
          <div className="whitespace-pre-wrap rounded-md bg-muted p-4">
            <h3 className="font-semibold mb-2">Your Personalized Workout Plan:</h3>
            {workoutPlan}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ============================================================================
// EXAMPLE 2: Progress Analysis and Recommendations
// ============================================================================

interface WorkoutSession {
  date: string;
  exercise: string;
  sets: number;
  reps: number;
  weight: number;
}

export function ProgressAnalyzer() {
  const [sessions, setSessions] = useState<WorkoutSession[]>([]);
  const [analysis, setAnalysis] = useState<string>('');

  const chatMutation = useOpenAIGPTChatMutation();

  const analyzeProgress = async () => {
    const sessionsData = sessions
      .map(s => `${s.date}: ${s.exercise} - ${s.sets}x${s.reps} @ ${s.weight}lbs`)
      .join('\n');

    try {
      const result = await chatMutation.mutateAsync({
        messages: [
          {
            role: 'system',
            content:
              'You are a fitness data analyst. Analyze workout progress and provide actionable insights and recommendations.',
          },
          {
            role: 'user',
            content: `Analyze my workout progress and provide recommendations:\n\n${sessionsData}\n\nWhat patterns do you see? What should I focus on? Am I progressing well?`,
          },
        ],
      });

      setAnalysis(result.content);
    } catch (error) {
      console.error('Failed to analyze progress:', error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Progress Analysis</CardTitle>
        <CardDescription>Get insights on your workout progress</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={analyzeProgress} disabled={chatMutation.isPending || sessions.length === 0}>
          {chatMutation.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            'Analyze Progress'
          )}
        </Button>

        {analysis && (
          <div className="whitespace-pre-wrap rounded-md bg-muted p-4">
            <h3 className="font-semibold mb-2">Analysis & Recommendations:</h3>
            {analysis}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ============================================================================
// EXAMPLE 3: Post-Workout Recommendations
// ============================================================================

interface WorkoutData {
  exercises: string[];
  duration: number;
  intensity: 'low' | 'medium' | 'high';
  muscleGroups: string[];
}

export function PostWorkoutRecommendations() {
  const [workoutData, setWorkoutData] = useState<WorkoutData>({
    exercises: ['Squats', 'Bench Press', 'Deadlifts'],
    duration: 60,
    intensity: 'high',
    muscleGroups: ['legs', 'chest', 'back'],
  });
  const [recommendations, setRecommendations] = useState<string>('');

  const chatMutation = useOpenAIGPTChatMutation();

  const getRecommendations = async () => {
    try {
      const result = await chatMutation.mutateAsync({
        messages: [
          {
            role: 'system',
            content:
              'You are a sports nutritionist and recovery specialist. Provide post-workout recommendations.',
          },
          {
            role: 'user',
            content: `I just completed a ${workoutData.intensity} intensity workout:
- Duration: ${workoutData.duration} minutes
- Exercises: ${workoutData.exercises.join(', ')}
- Muscle Groups: ${workoutData.muscleGroups.join(', ')}

What should I do for optimal recovery? Include nutrition, hydration, rest, and stretching recommendations.`,
          },
        ],
      });

      setRecommendations(result.content);
    } catch (error) {
      console.error('Failed to get recommendations:', error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Post-Workout Recommendations</CardTitle>
        <CardDescription>Get personalized recovery advice</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={getRecommendations} disabled={chatMutation.isPending}>
          {chatMutation.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Getting Recommendations...
            </>
          ) : (
            'Get Recovery Plan'
          )}
        </Button>

        {recommendations && (
          <div className="whitespace-pre-wrap rounded-md bg-muted p-4">
            <h3 className="font-semibold mb-2">Recovery Recommendations:</h3>
            {recommendations}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ============================================================================
// EXAMPLE 4: Interactive Fitness Q&A Chat
// ============================================================================

export function FitnessQAChat() {
  const [userInput, setUserInput] = useState('');

  const {
    messages,
    addUserMessage,
    addAssistantMessage,
    chat,
    isLoading,
    error,
    clearMessages,
  } = useChatConversation(
    'You are a knowledgeable fitness coach and nutritionist. Answer questions about exercise, nutrition, recovery, and training with accurate, helpful information. Keep responses concise but informative.'
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userInput.trim() || isLoading) return;

    const question = userInput.trim();
    setUserInput('');

    // Add user message to conversation
    addUserMessage(question);

    try {
      // Get AI response
      const response = await chat({
        messages: [...messages, { role: 'user', content: question }],
      });

      // Add assistant response to conversation
      addAssistantMessage(response.content);
    } catch (error) {
      console.error('Chat error:', error);
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Ask Your Fitness Coach</CardTitle>
        <CardDescription>
          Get answers about exercises, nutrition, training plans, and more
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="h-[400px] overflow-y-auto space-y-4 rounded-md border p-4">
          {messages
            .filter(m => m.role !== 'system')
            .map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-2 ${
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }`}
                >
                  <div className="text-xs font-semibold mb-1">
                    {message.role === 'user' ? 'You' : 'Coach'}
                  </div>
                  <div className="whitespace-pre-wrap">{message.content}</div>
                </div>
              </div>
            ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-muted rounded-lg px-4 py-2">
                <Loader2 className="h-4 w-4 animate-spin" />
              </div>
            </div>
          )}
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error.message}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="flex gap-2">
          <Textarea
            value={userInput}
            onChange={e => setUserInput(e.target.value)}
            placeholder="Ask about nutrition, exercises, training plans..."
            className="min-h-[60px]"
            disabled={isLoading}
          />
          <div className="flex flex-col gap-2">
            <Button type="submit" disabled={isLoading || !userInput.trim()}>
              Send
            </Button>
            <Button type="button" variant="outline" onClick={clearMessages} disabled={isLoading}>
              Clear
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// EXAMPLE 5: Automatic Training Plan Adjustment
// ============================================================================

interface PerformanceMetrics {
  completedWorkouts: number;
  missedWorkouts: number;
  averageIntensity: number;
  progressRate: number;
  fatigueLevel: number;
}

export function TrainingPlanAdjuster() {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    completedWorkouts: 8,
    missedWorkouts: 2,
    averageIntensity: 7.5,
    progressRate: 0.85,
    fatigueLevel: 6,
  });
  const [adjustedPlan, setAdjustedPlan] = useState<string>('');

  const chatMutation = useOpenAIGPTChatMutation();

  const adjustPlan = async () => {
    try {
      const result = await chatMutation.mutateAsync({
        messages: [
          {
            role: 'system',
            content:
              'You are an adaptive fitness algorithm. Analyze performance data and adjust training plans to optimize results while preventing overtraining.',
          },
          {
            role: 'user',
            content: `Based on my last 2 weeks:
- Completed Workouts: ${metrics.completedWorkouts}/10
- Average Intensity: ${metrics.averageIntensity}/10
- Progress Rate: ${(metrics.progressRate * 100).toFixed(0)}% of target
- Fatigue Level: ${metrics.fatigueLevel}/10

Suggest adjustments to my training plan. Should I increase/decrease volume, intensity, or frequency? What specific changes do you recommend?`,
          },
        ],
      });

      setAdjustedPlan(result.content);
    } catch (error) {
      console.error('Failed to adjust plan:', error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Training Plan Adjuster</CardTitle>
        <CardDescription>
          Automatically optimize your plan based on performance data
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="font-medium">Completion Rate</div>
            <div className="text-2xl font-bold">
              {((metrics.completedWorkouts / 10) * 100).toFixed(0)}%
            </div>
          </div>
          <div>
            <div className="font-medium">Fatigue Level</div>
            <div className="text-2xl font-bold">{metrics.fatigueLevel}/10</div>
          </div>
        </div>

        <Button onClick={adjustPlan} disabled={chatMutation.isPending}>
          {chatMutation.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analyzing Performance...
            </>
          ) : (
            'Get Plan Adjustments'
          )}
        </Button>

        {adjustedPlan && (
          <div className="whitespace-pre-wrap rounded-md bg-muted p-4">
            <h3 className="font-semibold mb-2">Recommended Adjustments:</h3>
            {adjustedPlan}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ============================================================================
// EXAMPLE 6: Batch Processing Multiple Requests
// ============================================================================

export function BatchNutritionAnalyzer() {
  const [meals, setMeals] = useState<string[]>([
    'Chicken breast, brown rice, broccoli',
    'Protein shake with banana',
    'Salmon, quinoa, asparagus',
  ]);
  const [analyses, setAnalyses] = useState<string[]>([]);

  const chatMutation = useOpenAIGPTChatMutation();

  const analyzeMeals = async () => {
    try {
      const result = await chatMutation.mutateAsync({
        messages: [
          {
            role: 'system',
            content:
              'You are a sports nutritionist. Analyze meals and provide macronutrient estimates and suggestions.',
          },
          {
            role: 'user',
            content: `Analyze these meals and provide:
1. Estimated macros (protein/carbs/fats in grams)
2. Calorie estimate
3. Nutritional quality rating
4. Suggestions for improvement

Meals:
${meals.map((meal, i) => `${i + 1}. ${meal}`).join('\n')}

Format each meal analysis clearly.`,
          },
        ],
      });

      setAnalyses([result.content]);
    } catch (error) {
      console.error('Failed to analyze meals:', error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Batch Meal Analyzer</CardTitle>
        <CardDescription>Analyze multiple meals at once</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          {meals.map((meal, index) => (
            <div key={index} className="rounded-md border p-2">
              {meal}
            </div>
          ))}
        </div>

        <Button onClick={analyzeMeals} disabled={chatMutation.isPending}>
          {chatMutation.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analyzing Meals...
            </>
          ) : (
            'Analyze All Meals'
          )}
        </Button>

        {analyses.length > 0 && (
          <div className="whitespace-pre-wrap rounded-md bg-muted p-4">
            {analyses[0]}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
