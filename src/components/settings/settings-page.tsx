import * as React from 'react';
import { useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { User, Bell, Globe, Moon, LogOut, Crown } from 'lucide-react';
import { toast } from 'sonner';

export function SettingsPage() {
  const { user, logout, updateUser, isPremium } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');

  const preferences = user?.preferences ?
    (typeof user.preferences === 'string' ? JSON.parse(user.preferences) : user.preferences) :
    { dark_mode: false, language: 'en', notifications_enabled: true };

  const [darkMode, setDarkMode] = useState(preferences.dark_mode || false);
  const [language, setLanguage] = useState(preferences.language || 'en');
  const [notifications, setNotifications] = useState(preferences.notifications_enabled !== false);

  const handleSaveProfile = async () => {
    try {
      await updateUser({ name, email });
      toast('Profile updated successfully');
    } catch (error) {
      toast('Failed to update profile');
    }
  };

  const handleSavePreferences = async () => {
    try {
      await updateUser({
        preferences: {
          dark_mode: darkMode,
          language,
          notifications_enabled: notifications
        }
      });
      toast('Preferences updated successfully');
    } catch (error) {
      toast('Failed to update preferences');
    }
  };

  const handleLogout = () => {
    logout();
    toast('Logged out successfully');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-muted-foreground">Manage your account and preferences</p>
      </div>

      {/* Subscription Status */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Crown className="h-5 w-5 text-primary" />
              <CardTitle>Subscription</CardTitle>
            </div>
            <Badge variant={isPremium ? 'default' : 'secondary'}>
              {isPremium ? 'Premium' : 'Free'}
            </Badge>
          </div>
          <CardDescription>
            {isPremium ? 'You have access to all premium features' : 'Upgrade to unlock premium features'}
          </CardDescription>
        </CardHeader>
        {!isPremium && (
          <CardContent>
            <Button className="w-full gap-2">
              <Crown className="h-4 w-4" />
              Upgrade to Premium
            </Button>
          </CardContent>
        )}
      </Card>

      {/* Profile Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <User className="h-5 w-5" />
            <CardTitle>Profile</CardTitle>
          </div>
          <CardDescription>Update your personal information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <Button onClick={handleSaveProfile}>Save Changes</Button>
        </CardContent>
      </Card>

      {/* Preferences */}
      <Card>
        <CardHeader>
          <CardTitle>Preferences</CardTitle>
          <CardDescription>Customize your app experience</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Moon className="h-5 w-5" />
              <div>
                <p className="font-medium">Dark Mode</p>
                <p className="text-sm text-muted-foreground">Toggle dark theme</p>
              </div>
            </div>
            <Switch checked={darkMode} onCheckedChange={setDarkMode} />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              <div>
                <p className="font-medium">Notifications</p>
                <p className="text-sm text-muted-foreground">Receive workout reminders</p>
              </div>
            </div>
            <Switch checked={notifications} onCheckedChange={setNotifications} />
          </div>

          <Separator />

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              <Label>Language</Label>
            </div>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="ro">Romanian</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button onClick={handleSavePreferences}>Save Preferences</Button>
        </CardContent>
      </Card>

      {/* Account Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Account</CardTitle>
          <CardDescription>Manage your account</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="destructive" onClick={handleLogout} className="gap-2">
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
