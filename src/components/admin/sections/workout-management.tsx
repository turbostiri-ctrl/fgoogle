import * as React from 'react';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import WorkoutORM, { type WorkoutModel } from '@/components/data/orm/orm_workout';
import WorkoutPlanORM, { type WorkoutPlanModel } from '@/components/data/orm/orm_workout_plan';
import ExerciseLogORM, { type ExerciseLogModel } from '@/components/data/orm/orm_exercise_log';
import { Dumbbell, Activity, Calendar, TrendingUp } from 'lucide-react';

export function WorkoutManagement() {
  const [workouts, setWorkouts] = useState<WorkoutModel[]>([]);
  const [workoutPlans, setWorkoutPlans] = useState<WorkoutPlanModel[]>([]);
  const [exerciseLogs, setExerciseLogs] = useState<ExerciseLogModel[]>([]);
  const [loading, setLoading] = useState(true);

  const workoutORM = WorkoutORM.getInstance();
  const planORM = WorkoutPlanORM.getInstance();
  const logORM = ExerciseLogORM.getInstance();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [workoutsData, plansData, logsData] = await Promise.all([
        workoutORM.getAllWorkout(),
        planORM.getAllWorkoutPlan(),
        logORM.getAllExerciseLog()
      ]);
      setWorkouts(workoutsData);
      setWorkoutPlans(plansData);
      setExerciseLogs(logsData);
    } catch (error) {
      console.error('Failed to load workout data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Antrenamente</CardTitle>
            <Dumbbell className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{workouts.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Planuri Workout</CardTitle>
            <Calendar className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{workoutPlans.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Exerciții Loguite</CardTitle>
            <Activity className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{exerciseLogs.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Medie/Utilizator</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {workouts.length > 0 ? Math.round(exerciseLogs.length / workouts.length) : 0}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Workouts Table */}
      <Card>
        <CardHeader>
          <CardTitle>Antrenamente</CardTitle>
          <CardDescription>
            Vizualizează toate antrenamentele create de utilizatori
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            </div>
          ) : (
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nume</TableHead>
                    <TableHead>Tip</TableHead>
                    <TableHead>Descriere</TableHead>
                    <TableHead>Data Creare</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {workouts.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                        Nu există antrenamente înregistrate
                      </TableCell>
                    </TableRow>
                  ) : (
                    workouts.map((workout) => (
                      <TableRow key={workout.id}>
                        <TableCell className="font-medium">{workout.name || 'Fără nume'}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{workout.category || 'General'}</Badge>
                        </TableCell>
                        <TableCell className="max-w-xs truncate">
                          {workout.description || '-'}
                        </TableCell>
                        <TableCell>
                          {workout.create_time
                            ? new Date(parseInt(workout.create_time) * 1000).toLocaleDateString('ro-RO')
                            : '-'}
                        </TableCell>
                        <TableCell>
                          <Badge variant="default">Activ</Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Workout Plans Table */}
      <Card>
        <CardHeader>
          <CardTitle>Planuri de Antrenament</CardTitle>
          <CardDescription>
            Planuri personalizate create pentru utilizatori
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            </div>
          ) : (
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nume Plan</TableHead>
                    <TableHead>Descriere</TableHead>
                    <TableHead>Data Creare</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {workoutPlans.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
                        Nu există planuri de antrenament
                      </TableCell>
                    </TableRow>
                  ) : (
                    workoutPlans.map((plan) => (
                      <TableRow key={plan.id}>
                        <TableCell className="font-medium">{plan.name || 'Plan Personalizat'}</TableCell>
                        <TableCell className="max-w-md truncate">
                          {plan.description || '-'}
                        </TableCell>
                        <TableCell>
                          {plan.create_time
                            ? new Date(parseInt(plan.create_time) * 1000).toLocaleDateString('ro-RO')
                            : '-'}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
