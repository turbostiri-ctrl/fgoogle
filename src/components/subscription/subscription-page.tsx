import * as React from 'react';
import { useAuth } from '@/contexts/auth-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Crown, Sparkles, Zap } from 'lucide-react';
import { UserProfileSubscriptionTier } from '@/components/data/orm/orm_user_profile';
import { toast } from 'sonner';

export function SubscriptionPage() {
  const { user, isPremium, updateUser } = useAuth();

  const handleSubscribe = async (tier: 'monthly' | 'yearly') => {
    try {
      const expiryDate = new Date();
      expiryDate.setMonth(expiryDate.getMonth() + (tier === 'monthly' ? 1 : 12));

      await updateUser({
        subscription_tier: UserProfileSubscriptionTier.Premium,
        subscription_expiry_date: expiryDate.toISOString()
      });

      toast('Successfully upgraded to Premium!');
    } catch (error) {
      toast('Failed to upgrade subscription');
    }
  };

  const features = [
    'AI-powered personalized workout plans',
    'Unlimited workout generation',
    'Advanced progress analytics',
    'AI Coach for instant guidance',
    'Exclusive premium recipes',
    'Premium lifestyle content',
    'Detailed nutrition tracking',
    'Priority customer support'
  ];

  return (
    <div className="space-y-8">
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <div className="bg-primary rounded-full p-3">
            <Crown className="h-8 w-8 text-primary-foreground" />
          </div>
        </div>
        <h1 className="text-4xl font-bold mb-2">Upgrade to Premium</h1>
        <p className="text-muted-foreground text-lg">
          Unlock the full potential of your fitness journey
        </p>
      </div>

      {isPremium && (
        <Card className="border-primary bg-gradient-to-r from-primary/10 to-secondary/10">
          <CardContent className="pt-6 text-center">
            <Badge className="mb-2">Active</Badge>
            <p className="font-semibold">You're already a Premium member!</p>
            <p className="text-sm text-muted-foreground mt-1">
              Subscription expires: {user?.subscription_expiry_date ?
                new Date(user.subscription_expiry_date).toLocaleDateString() :
                'Never'}
            </p>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {/* Monthly Plan */}
        <Card className="hover:shadow-xl transition-all">
          <CardHeader>
            <div className="flex items-center gap-2 mb-2">
              <Zap className="h-5 w-5 text-primary" />
              <CardTitle>Monthly</CardTitle>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-bold">€4.99</span>
              <span className="text-muted-foreground">/month</span>
            </div>
            <CardDescription>Perfect for getting started</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              className="w-full mb-4 gap-2"
              size="lg"
              onClick={() => handleSubscribe('monthly')}
              disabled={isPremium}
            >
              <Crown className="h-4 w-4" />
              {isPremium ? 'Current Plan' : 'Subscribe Monthly'}
            </Button>
            <ul className="space-y-2">
              {features.slice(0, 4).map((feature, idx) => (
                <li key={idx} className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-primary" />
                  {feature}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Yearly Plan */}
        <Card className="border-primary relative hover:shadow-xl transition-all">
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
            <Badge className="bg-primary gap-1">
              <Sparkles className="h-3 w-3" />
              Best Value
            </Badge>
          </div>
          <CardHeader>
            <div className="flex items-center gap-2 mb-2">
              <Crown className="h-5 w-5 text-primary" />
              <CardTitle>Yearly</CardTitle>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-bold">€39.99</span>
              <span className="text-muted-foreground">/year</span>
            </div>
            <CardDescription>
              Save €20 compared to monthly
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              className="w-full mb-4 gap-2"
              size="lg"
              onClick={() => handleSubscribe('yearly')}
              disabled={isPremium}
            >
              <Crown className="h-4 w-4" />
              {isPremium ? 'Current Plan' : 'Subscribe Yearly'}
            </Button>
            <ul className="space-y-2">
              {features.map((feature, idx) => (
                <li key={idx} className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-primary" />
                  {feature}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Why Go Premium?</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start gap-3">
            <div className="bg-primary/10 p-2 rounded-lg">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h4 className="font-semibold mb-1">AI-Powered Plans</h4>
              <p className="text-sm text-muted-foreground">
                Get personalized workouts generated by advanced AI
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="bg-primary/10 p-2 rounded-lg">
              <Zap className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h4 className="font-semibold mb-1">Instant Results</h4>
              <p className="text-sm text-muted-foreground">
                Track progress with advanced analytics and insights
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
