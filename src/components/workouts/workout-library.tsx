import * as React from 'react';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Dumbbell, Clock, Flame, Heart, Search, Play, Check } from 'lucide-react';
import WorkoutORM, { type WorkoutModel } from '@/components/data/orm/orm_workout';
import ExerciseLogORM from '@/components/data/orm/orm_exercise_log';
import { useOpenAIGPTChatMutation } from '@/hooks/use-openai-gpt-chat';
import { toast } from 'sonner';

export function WorkoutLibrary() {
  const { user, isPremium } = useAuth();
  const [workouts, setWorkouts] = useState<WorkoutModel[]>([]);
  const [filteredWorkouts, setFilteredWorkouts] = useState<WorkoutModel[]>([]);
  const [selectedWorkout, setSelectedWorkout] = useState<WorkoutModel | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [showGenerateDialog, setShowGenerateDialog] = useState(false);
  const chatMutation = useOpenAIGPTChatMutation();

  useEffect(() => {
    loadWorkouts();
  }, []);

  useEffect(() => {
    filterWorkouts();
  }, [workouts, searchQuery, category]);

  const loadWorkouts = async () => {
    try {
      const orm = WorkoutORM.getInstance();
      const allWorkouts = await orm.getAllWorkout();
      setWorkouts(allWorkouts);
    } catch (error) {
      console.error('Failed to load workouts:', error);
    }
  };

  const filterWorkouts = () => {
    let filtered = workouts;

    if (category !== 'all') {
      filtered = filtered.filter(w => w.category?.toLowerCase() === category.toLowerCase());
    }

    if (searchQuery) {
      filtered = filtered.filter(w =>
        w.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        w.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredWorkouts(filtered);
  };

  const logWorkout = async (workout: WorkoutModel) => {
    if (!user?.id || !workout.id) return;

    try {
      const orm = ExerciseLogORM.getInstance();
      await orm.insertExerciseLog([{
        user_id: user.id,
        workout_id: workout.id,
        completed_at: new Date().toISOString(),
        duration_minutes: workout.duration_minutes || 30,
        calories_burned: 200
      } as any]);
      toast('Workout logged successfully!');
    } catch (error) {
      console.error('Failed to log workout:', error);
      toast('Failed to log workout');
    }
  };

  const generateAIWorkout = async () => {
    if (!isPremium) {
      toast('AI workout generation is a premium feature');
      return;
    }

    try {
      const result = await chatMutation.mutateAsync({
        messages: [
          {
            role: 'system',
            content: 'You are a professional fitness coach. Create workout plans in a structured format.'
          },
          {
            role: 'user',
            content: `Create a personalized workout plan based on: Goals: ${user?.objectives?.join(', ')}, Fitness Level: ${user?.fitness_level}. Provide the workout name, description, duration, and 5 exercises.`
          }
        ]
      });

      toast('AI Workout plan generated!');
      setShowGenerateDialog(false);
    } catch (error) {
      console.error('Failed to generate workout:', error);
      toast('Failed to generate workout');
    }
  };

  const categories = ['all', 'Home', 'Gym', 'HIIT', 'Strength', 'Cardio', 'Stretching', 'Mobility'];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Workout Library</h1>
        <p className="text-muted-foreground">Browse and start your workouts</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search workouts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button onClick={() => setShowGenerateDialog(true)} disabled={!isPremium}>
          Generate AI Workout
        </Button>
      </div>

      <Tabs value={category} onValueChange={setCategory}>
        <TabsList className="w-full justify-start overflow-x-auto flex-nowrap">
          {categories.map(cat => (
            <TabsTrigger key={cat} value={cat} className="capitalize">
              {cat}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredWorkouts.length > 0 ? (
          filteredWorkouts.map(workout => (
            <Card key={workout.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{workout.name}</CardTitle>
                    <CardDescription className="line-clamp-2 mt-1">
                      {workout.description}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {workout.duration_minutes} min
                  </div>
                  <div className="flex items-center gap-1">
                    <Flame className="h-4 w-4" />
                    {workout.difficulty_level}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    className="flex-1 gap-2"
                    onClick={() => {
                      setSelectedWorkout(workout);
                      logWorkout(workout);
                    }}
                  >
                    <Play className="h-4 w-4" />
                    Start
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <Dumbbell className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No workouts found</p>
          </div>
        )}
      </div>

      <Dialog open={showGenerateDialog} onOpenChange={setShowGenerateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Generate AI Workout Plan</DialogTitle>
            <DialogDescription>
              Our AI will create a personalized workout plan based on your goals and fitness level.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              This will generate a custom workout tailored to your profile.
            </p>
            <Button
              onClick={generateAIWorkout}
              disabled={chatMutation.isPending}
              className="w-full"
            >
              {chatMutation.isPending ? 'Generating...' : 'Generate Workout'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
