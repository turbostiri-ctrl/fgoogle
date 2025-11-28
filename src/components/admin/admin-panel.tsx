import * as React from 'react';
import { useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { UserManagement } from './sections/user-management';
import { SubscriptionManagement } from './sections/subscription-management';
import { PaymentManagement } from './sections/payment-management';
import { WorkoutManagement } from './sections/workout-management';
import { NutritionManagement } from './sections/nutrition-management';
import { AICoachSettings } from './sections/ai-coach-settings';
import { SystemSettings } from './sections/system-settings';
import {
  Users,
  CreditCard,
  DollarSign,
  Dumbbell,
  Apple,
  MessageCircle,
  Settings,
  ShieldAlert
} from 'lucide-react';

export function AdminPanel() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('users');

  // Check if user is admin (using the admin email)
  const isAdmin = user?.email === 'marketingporo@yahoo.com';

  if (!isAdmin) {
    return (
      <div className="container max-w-4xl mx-auto py-8">
        <Alert variant="destructive">
          <ShieldAlert className="h-4 w-4" />
          <AlertDescription>
            Access Denied. You don't have permission to access the Admin Panel.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container max-w-7xl mx-auto py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Panel</h1>
          <p className="text-muted-foreground">
            Control complet asupra tuturor funcțiilor aplicației FitLife Pro
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4 lg:grid-cols-7 gap-2">
          <TabsTrigger value="users" className="gap-2">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Utilizatori</span>
          </TabsTrigger>
          <TabsTrigger value="subscriptions" className="gap-2">
            <CreditCard className="h-4 w-4" />
            <span className="hidden sm:inline">Abonamente</span>
          </TabsTrigger>
          <TabsTrigger value="payments" className="gap-2">
            <DollarSign className="h-4 w-4" />
            <span className="hidden sm:inline">Plăți</span>
          </TabsTrigger>
          <TabsTrigger value="workouts" className="gap-2">
            <Dumbbell className="h-4 w-4" />
            <span className="hidden sm:inline">Antrenamente</span>
          </TabsTrigger>
          <TabsTrigger value="nutrition" className="gap-2">
            <Apple className="h-4 w-4" />
            <span className="hidden sm:inline">Nutriție</span>
          </TabsTrigger>
          <TabsTrigger value="ai-coach" className="gap-2">
            <MessageCircle className="h-4 w-4" />
            <span className="hidden sm:inline">AI Coach</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="gap-2">
            <Settings className="h-4 w-4" />
            <span className="hidden sm:inline">Setări</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-4">
          <UserManagement />
        </TabsContent>

        <TabsContent value="subscriptions" className="space-y-4">
          <SubscriptionManagement />
        </TabsContent>

        <TabsContent value="payments" className="space-y-4">
          <PaymentManagement />
        </TabsContent>

        <TabsContent value="workouts" className="space-y-4">
          <WorkoutManagement />
        </TabsContent>

        <TabsContent value="nutrition" className="space-y-4">
          <NutritionManagement />
        </TabsContent>

        <TabsContent value="ai-coach" className="space-y-4">
          <AICoachSettings />
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <SystemSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
}
