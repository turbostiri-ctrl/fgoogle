import * as React from 'react';
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Dumbbell,
  Apple,
  TrendingUp,
  Droplet,
  Flame,
  Target,
  ArrowRight,
  Crown,
  Sparkles
} from 'lucide-react';
import WorkoutORM from '@/components/data/orm/orm_workout';
import NutritionRecipeORM from '@/components/data/orm/orm_nutrition_recipe';
import ExerciseLogORM from '@/components/data/orm/orm_exercise_log';

type Page = 'dashboard' | 'workouts' | 'nutrition' | 'progress' | 'lifestyle' | 'settings' | 'subscription' | 'ai-coach';

interface DashboardProps {
  onNavigate: (page: Page) => void;
}

export function Dashboard({ onNavigate }: DashboardProps) {
  const { user, isPremium } = useAuth();
  const [todayWorkout, setTodayWorkout] = useState<any>(null);
  const [recipeOfDay, setRecipeOfDay] = useState<any>(null);
  const [weekProgress, setWeekProgress] = useState(0);
  const [calorieTarget] = useState(2000);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const workoutOrm = WorkoutORM.getInstance();
      const recipeOrm = NutritionRecipeORM.getInstance();
      const exerciseOrm = ExerciseLogORM.getInstance();

      const [workouts] = await workoutOrm.listWorkout(undefined, undefined, { size: 1, number: 0 });
      if (workouts.length > 0) {
        setTodayWorkout(workouts[0]);
      }

      const [recipes] = await recipeOrm.listNutritionRecipe(undefined, undefined, { size: 1, number: 0 });
      if (recipes.length > 0) {
        setRecipeOfDay(recipes[0]);
      }

      if (user?.id) {
        const today = new Date();
        const weekStart = new Date(today.setDate(today.getDate() - today.getDay()));
        const logs = await exerciseOrm.getAllExerciseLog();
        const weekLogs = logs.filter(log => {
          const logDate = new Date(parseInt(log.create_time) * 1000);
          return logDate >= weekStart;
        });
        setWeekProgress((weekLogs.length / 5) * 100);
      }
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    }
  };

  const motivationalMessages = [
    "You're stronger than yesterday!",
    "Every workout counts!",
    "Progress, not perfection!",
    "Your body can do it, it's your mind you need to convince!",
    "The only bad workout is the one that didn't happen!"
  ];

  const randomMessage = motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name}!</h1>
        <p className="text-muted-foreground">{randomMessage}</p>
      </div>

      {/* Premium Upsell */}
      {!isPremium && (
        <Card className="border-primary/50 bg-gradient-to-r from-primary/10 to-secondary/10">
          <CardContent className="flex items-center justify-between p-6">
            <div className="flex items-center gap-3">
              <Crown className="h-8 w-8 text-primary" />
              <div>
                <h3 className="font-semibold">Upgrade to Premium</h3>
                <p className="text-sm text-muted-foreground">Unlock AI-powered plans, exclusive recipes, and advanced analytics</p>
              </div>
            </div>
            <Button onClick={() => onNavigate('subscription')} className="gap-2">
              <Sparkles className="h-4 w-4" />
              Upgrade Now
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Weekly Progress</p>
                <p className="text-2xl font-bold">{Math.round(weekProgress)}%</p>
              </div>
              <Target className="h-8 w-8 text-primary" />
            </div>
            <Progress value={weekProgress} className="mt-3" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Calorie Target</p>
                <p className="text-2xl font-bold">{calorieTarget}</p>
              </div>
              <Flame className="h-8 w-8 text-orange-500" />
            </div>
            <p className="text-xs text-muted-foreground mt-3">Daily goal</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Hydration</p>
                <p className="text-2xl font-bold">6/8</p>
              </div>
              <Droplet className="h-8 w-8 text-blue-500" />
            </div>
            <p className="text-xs text-muted-foreground mt-3">Glasses today</p>
          </CardContent>
        </Card>
      </div>

      {/* Today's Recommendations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Workout of the Day */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Dumbbell className="h-5 w-5 text-primary" />
                <CardTitle>Today's Workout</CardTitle>
              </div>
              {todayWorkout && <Badge>{todayWorkout.difficulty_level}</Badge>}
            </div>
            <CardDescription>Recommended for your goals</CardDescription>
          </CardHeader>
          <CardContent>
            {todayWorkout ? (
              <div className="space-y-3">
                <h3 className="font-semibold">{todayWorkout.name}</h3>
                <p className="text-sm text-muted-foreground">{todayWorkout.description}</p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>{todayWorkout.duration_minutes} min</span>
                  <span>•</span>
                  <span>{todayWorkout.category}</span>
                </div>
                <Button className="w-full gap-2" onClick={() => onNavigate('workouts')}>
                  Start Workout
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">No workout scheduled</p>
                <Button onClick={() => onNavigate('workouts')}>Browse Workouts</Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recipe of the Day */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Apple className="h-5 w-5 text-green-500" />
                <CardTitle>Recipe of the Day</CardTitle>
              </div>
              {recipeOfDay?.is_premium && <Badge variant="secondary"><Crown className="h-3 w-3 mr-1" />Premium</Badge>}
            </div>
            <CardDescription>Healthy and delicious</CardDescription>
          </CardHeader>
          <CardContent>
            {recipeOfDay ? (
              <div className="space-y-3">
                <h3 className="font-semibold">{recipeOfDay.name}</h3>
                <p className="text-sm text-muted-foreground">{recipeOfDay.description}</p>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Flame className="h-4 w-4 text-orange-500" />
                    <span>{recipeOfDay.calories} cal</span>
                  </div>
                  <span>•</span>
                  <span>{recipeOfDay.prep_time_minutes} min</span>
                </div>
                <Button className="w-full gap-2" onClick={() => onNavigate('nutrition')}>
                  View Recipe
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">No recipe available</p>
                <Button onClick={() => onNavigate('nutrition')}>Browse Recipes</Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Jump to your favorite sections</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Button variant="outline" className="h-auto py-4 flex-col gap-2" onClick={() => onNavigate('workouts')}>
              <Dumbbell className="h-5 w-5" />
              <span className="text-sm">Workouts</span>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex-col gap-2" onClick={() => onNavigate('nutrition')}>
              <Apple className="h-5 w-5" />
              <span className="text-sm">Nutrition</span>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex-col gap-2" onClick={() => onNavigate('progress')}>
              <TrendingUp className="h-5 w-5" />
              <span className="text-sm">Progress</span>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex-col gap-2" onClick={() => onNavigate('ai-coach')}>
              <Sparkles className="h-5 w-5" />
              <span className="text-sm">AI Coach</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
