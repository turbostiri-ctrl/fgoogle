import * as React from 'react';
import { useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { UserProfileFitnessLevel, UserProfileObjectivesItem } from '@/components/data/orm/orm_user_profile';

interface OnboardingFlowProps {
  onComplete: () => void;
}

export function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const { user, updateUser } = useAuth();
  const [step, setStep] = useState(1);
  const [data, setData] = useState({
    objectives: [] as number[],
    age: '',
    weight: '',
    height: '',
    fitness_level: UserProfileFitnessLevel.Beginner
  });

  const objectives = [
    { id: UserProfileObjectivesItem.WeightLoss, label: 'Weight Loss' },
    { id: UserProfileObjectivesItem.MuscleGain, label: 'Muscle Gain' },
    { id: UserProfileObjectivesItem.Toning, label: 'Toning' },
    { id: UserProfileObjectivesItem.Mobility, label: 'Mobility' },
    { id: UserProfileObjectivesItem.HealthyLifestyle, label: 'Healthy Lifestyle' }
  ];

  const fitnessLevels = [
    { id: UserProfileFitnessLevel.Beginner, label: 'Beginner', desc: 'Just getting started' },
    { id: UserProfileFitnessLevel.Intermediate, label: 'Intermediate', desc: 'Some experience' },
    { id: UserProfileFitnessLevel.Advanced, label: 'Advanced', desc: 'Regular training' }
  ];

  const toggleObjective = (id: number) => {
    setData(prev => ({
      ...prev,
      objectives: prev.objectives.includes(id)
        ? prev.objectives.filter(o => o !== id)
        : [...prev.objectives, id]
    }));
  };

  const handleComplete = async () => {
    if (!user) return;

    await updateUser({
      objectives: data.objectives,
      age: data.age ? parseInt(data.age) : undefined,
      weight: data.weight ? parseFloat(data.weight) : undefined,
      height: data.height ? parseFloat(data.height) : undefined,
      fitness_level: data.fitness_level
    });

    onComplete();
  };

  const totalSteps = 4;
  const progress = (step / totalSteps) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <div className="mb-4">
            <Progress value={progress} className="h-2" />
            <p className="text-sm text-muted-foreground mt-2">Step {step} of {totalSteps}</p>
          </div>
          <CardTitle className="text-2xl">
            {step === 1 && 'What are your fitness goals?'}
            {step === 2 && 'Tell us about yourself'}
            {step === 3 && 'What\'s your fitness level?'}
            {step === 4 && 'Review your information'}
          </CardTitle>
          <CardDescription>
            {step === 1 && 'Select all that apply'}
            {step === 2 && 'This helps us personalize your experience'}
            {step === 3 && 'Choose the level that best describes you'}
            {step === 4 && 'Make sure everything looks good'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {step === 1 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {objectives.map((obj) => (
                <Button
                  key={obj.id}
                  variant={data.objectives.includes(obj.id) ? 'default' : 'outline'}
                  className="h-auto py-4 justify-start"
                  onClick={() => toggleObjective(obj.id)}
                >
                  {obj.label}
                </Button>
              ))}
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    type="number"
                    placeholder="25"
                    value={data.age}
                    onChange={(e) => setData({ ...data, age: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="weight">Weight (kg)</Label>
                  <Input
                    id="weight"
                    type="number"
                    step="0.1"
                    placeholder="70"
                    value={data.weight}
                    onChange={(e) => setData({ ...data, weight: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="height">Height (cm)</Label>
                  <Input
                    id="height"
                    type="number"
                    placeholder="175"
                    value={data.height}
                    onChange={(e) => setData({ ...data, height: e.target.value })}
                  />
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="grid grid-cols-1 gap-3">
              {fitnessLevels.map((level) => (
                <Button
                  key={level.id}
                  variant={data.fitness_level === level.id ? 'default' : 'outline'}
                  className="h-auto py-4 flex-col items-start"
                  onClick={() => setData({ ...data, fitness_level: level.id })}
                >
                  <span className="font-semibold">{level.label}</span>
                  <span className="text-sm opacity-80">{level.desc}</span>
                </Button>
              ))}
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Goals</h3>
                <div className="flex flex-wrap gap-2">
                  {data.objectives.map((objId) => {
                    const obj = objectives.find(o => o.id === objId);
                    return obj ? <Badge key={objId}>{obj.label}</Badge> : null;
                  })}
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Personal Info</h3>
                <p className="text-sm text-muted-foreground">
                  Age: {data.age || 'Not provided'} • Weight: {data.weight ? `${data.weight}kg` : 'Not provided'} • Height: {data.height ? `${data.height}cm` : 'Not provided'}
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Fitness Level</h3>
                <p className="text-sm text-muted-foreground">
                  {fitnessLevels.find(l => l.id === data.fitness_level)?.label}
                </p>
              </div>
            </div>
          )}

          <div className="flex justify-between mt-6">
            <Button
              variant="outline"
              onClick={() => setStep(step - 1)}
              disabled={step === 1}
            >
              Previous
            </Button>
            {step < totalSteps ? (
              <Button
                onClick={() => setStep(step + 1)}
                disabled={step === 1 && data.objectives.length === 0}
              >
                Next
              </Button>
            ) : (
              <Button onClick={handleComplete}>
                Complete Setup
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
