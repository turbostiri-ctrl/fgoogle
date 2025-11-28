import * as React from 'react';
import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from '@/contexts/auth-context';
import { LoginPage } from '@/components/auth/login-page';
import { RegisterPage } from '@/components/auth/register-page';
import { OnboardingFlow } from '@/components/onboarding/onboarding-flow';
import { Dashboard } from '@/components/dashboard/dashboard';
import { WorkoutLibrary } from '@/components/workouts/workout-library';
import { NutritionSection } from '@/components/nutrition/nutrition-section';
import { ProgressTracking } from '@/components/progress/progress-tracking';
import { LifestyleContent } from '@/components/lifestyle/lifestyle-content';
import { SettingsPage } from '@/components/settings/settings-page';
import { SubscriptionPage } from '@/components/subscription/subscription-page';
import { AICoach } from '@/components/ai-coach/ai-coach';
import { AdminPanel } from '@/components/admin/admin-panel';
import { Navigation } from '@/components/navigation/navigation';
import { Button } from '@/components/ui/button';
import {
  Home,
  Dumbbell,
  Apple,
  TrendingUp,
  BookOpen,
  Settings,
  Crown,
  MessageCircle,
  Menu,
  X,
  Shield
} from 'lucide-react';

type Page = 'dashboard' | 'workouts' | 'nutrition' | 'progress' | 'lifestyle' | 'settings' | 'subscription' | 'ai-coach' | 'admin';

function FitnessAppContent() {
  const { user, isLoading } = useAuth();
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [showAuth, setShowAuth] = useState<'login' | 'register' | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Check if user needs onboarding
    if (user && !user.age && !user.objectives) {
      setShowOnboarding(true);
    }
  }, [user]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Show auth pages if not logged in
  if (!user) {
    if (showAuth === 'register') {
      return (
        <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5">
          <RegisterPage onSuccess={() => setShowAuth(null)} onSwitchToLogin={() => setShowAuth('login')} />
        </div>
      );
    }
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5">
        <LoginPage onSuccess={() => setShowAuth(null)} onSwitchToRegister={() => setShowAuth('register')} />
      </div>
    );
  }

  // Show onboarding if needed
  if (showOnboarding) {
    return <OnboardingFlow onComplete={() => setShowOnboarding(false)} />;
  }

  // Check if user is admin
  const isAdmin = user?.email === 'marketingporo@yahoo.com';

  const navItems = [
    { id: 'dashboard' as Page, label: 'Dashboard', icon: Home },
    { id: 'workouts' as Page, label: 'Workouts', icon: Dumbbell },
    { id: 'nutrition' as Page, label: 'Nutrition', icon: Apple },
    { id: 'progress' as Page, label: 'Progress', icon: TrendingUp },
    { id: 'lifestyle' as Page, label: 'Lifestyle', icon: BookOpen },
    { id: 'ai-coach' as Page, label: 'AI Coach', icon: MessageCircle },
    { id: 'subscription' as Page, label: 'Premium', icon: Crown },
    { id: 'settings' as Page, label: 'Settings', icon: Settings },
  ];

  // Add Admin Panel for admin users
  if (isAdmin) {
    navItems.push({ id: 'admin' as Page, label: 'Admin Panel', icon: Shield });
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Dumbbell className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold">FitLife Pro</h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Button
                key={item.id}
                variant={currentPage === item.id ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setCurrentPage(item.id)}
                className="gap-2"
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Button>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t bg-background">
            <nav className="container px-4 py-2 grid grid-cols-2 gap-2">
              {navItems.map((item) => (
                <Button
                  key={item.id}
                  variant={currentPage === item.id ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => {
                    setCurrentPage(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className="gap-2 justify-start"
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Button>
              ))}
            </nav>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="container px-4 py-6 max-w-7xl mx-auto">
        {currentPage === 'dashboard' && <Dashboard onNavigate={setCurrentPage} />}
        {currentPage === 'workouts' && <WorkoutLibrary />}
        {currentPage === 'nutrition' && <NutritionSection />}
        {currentPage === 'progress' && <ProgressTracking />}
        {currentPage === 'lifestyle' && <LifestyleContent />}
        {currentPage === 'settings' && <SettingsPage />}
        {currentPage === 'subscription' && <SubscriptionPage />}
        {currentPage === 'ai-coach' && <AICoach />}
        {currentPage === 'admin' && <AdminPanel />}
      </main>
    </div>
  );
}

export function FitnessApp() {
  return (
    <AuthProvider>
      <FitnessAppContent />
    </AuthProvider>
  );
}
