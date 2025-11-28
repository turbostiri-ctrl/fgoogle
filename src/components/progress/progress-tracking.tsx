import * as React from 'react';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { TrendingUp, TrendingDown, Weight, Calendar } from 'lucide-react';
import ProgressMetricORM, { type ProgressMetricModel } from '@/components/data/orm/orm_progress_metric';
import ExerciseLogORM from '@/components/data/orm/orm_exercise_log';
import { useOpenAIGPTChatMutation } from '@/hooks/use-openai-gpt-chat';

export function ProgressTracking() {
  const { user, isPremium } = useAuth();
  const [metrics, setMetrics] = useState<ProgressMetricModel[]>([]);
  const [weight, setWeight] = useState('');
  const [notes, setNotes] = useState('');
  const [analysis, setAnalysis] = useState('');
  const [workoutCount, setWorkoutCount] = useState(0);
  const chatMutation = useOpenAIGPTChatMutation();

  useEffect(() => {
    loadProgress();
  }, [user]);

  const loadProgress = async () => {
    if (!user?.id) return;

    try {
      const metricOrm = ProgressMetricORM.getInstance();
      const exerciseOrm = ExerciseLogORM.getInstance();

      const [allMetrics] = await metricOrm.listProgressMetric(
        undefined,
        { orders: [{ field: 'date', symbol: 2 }] },
        { size: 30, number: 0 }
      );
      setMetrics(allMetrics);

      const logs = await exerciseOrm.getAllExerciseLog();
      setWorkoutCount(logs.length);
    } catch (error) {
      console.error('Failed to load progress:', error);
    }
  };

  const addMetric = async () => {
    if (!user?.id || !weight) return;

    try {
      const orm = ProgressMetricORM.getInstance();
      await orm.insertProgressMetric([{
        user_id: user.id,
        date: new Date().toISOString().split('T')[0],
        weight: parseFloat(weight),
        notes
      } as any]);

      setWeight('');
      setNotes('');
      loadProgress();
    } catch (error) {
      console.error('Failed to add metric:', error);
    }
  };

  const generateAnalysis = async () => {
    if (!isPremium) return;

    try {
      const result = await chatMutation.mutateAsync({
        messages: [
          {
            role: 'system',
            content: 'You are a fitness expert analyzing progress data. Provide encouraging and actionable insights.'
          },
          {
            role: 'user',
            content: `Analyze this fitness progress: ${workoutCount} workouts completed, weight history: ${metrics.map(m => m.weight).join(', ')}kg. Provide insights and recommendations.`
          }
        ]
      });

      setAnalysis(result.content);
    } catch (error) {
      console.error('Failed to generate analysis:', error);
    }
  };

  const latestWeight = metrics.length > 0 ? metrics[0].weight : null;
  const previousWeight = metrics.length > 1 ? metrics[1].weight : null;
  const weightChange = latestWeight && previousWeight ? latestWeight - previousWeight : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Progress Tracking</h1>
        <p className="text-muted-foreground">Monitor your fitness journey</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Current Weight</p>
                <p className="text-3xl font-bold">{latestWeight ? `${latestWeight}kg` : 'N/A'}</p>
              </div>
              <Weight className="h-8 w-8 text-primary" />
            </div>
            {weightChange !== 0 && (
              <div className={`flex items-center gap-1 mt-2 text-sm ${weightChange > 0 ? 'text-red-500' : 'text-green-500'}`}>
                {weightChange > 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                <span>{Math.abs(weightChange).toFixed(1)}kg</span>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Workouts</p>
                <p className="text-3xl font-bold">{workoutCount}</p>
              </div>
              <Calendar className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Progress Entries</p>
                <p className="text-3xl font-bold">{metrics.length}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Log Progress</CardTitle>
            <CardDescription>Record your latest metrics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="weight">Weight (kg)</Label>
              <Input
                id="weight"
                type="number"
                step="0.1"
                placeholder="70.5"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Notes (optional)</Label>
              <Input
                id="notes"
                placeholder="Feeling strong today!"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
            <Button onClick={addMetric} className="w-full" disabled={!weight}>
              Add Entry
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>AI Progress Analysis</CardTitle>
            <CardDescription>Get insights from AI</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={generateAnalysis}
              className="w-full"
              disabled={!isPremium || chatMutation.isPending}
            >
              {chatMutation.isPending ? 'Analyzing...' : isPremium ? 'Generate Analysis' : 'Premium Feature'}
            </Button>
            {analysis && (
              <div className="bg-secondary p-4 rounded-lg text-sm">
                {analysis}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Progress</CardTitle>
          <CardDescription>Your latest entries</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {metrics.slice(0, 10).map((metric, idx) => (
              <div key={metric.id} className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{metric.date}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-semibold">{metric.weight}kg</span>
                  {metric.notes && <span className="text-sm text-muted-foreground">{metric.notes}</span>}
                </div>
              </div>
            ))}
            {metrics.length === 0 && (
              <p className="text-center text-muted-foreground py-8">No progress entries yet</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
