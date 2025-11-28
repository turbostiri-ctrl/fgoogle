import * as React from 'react';
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Settings,
  Database,
  Shield,
  Bell,
  Globe,
  Activity,
  Users,
  TrendingUp,
  Check
} from 'lucide-react';

export function SystemSettings() {
  const [settings, setSettings] = useState({
    siteName: 'FitLife Pro',
    maintenanceMode: false,
    allowRegistration: true,
    requireEmailVerification: false,
    enableNotifications: true,
    enableAnalytics: true,
    maxUsersPerPlan: 10000,
    sessionTimeout: 30,
    backupFrequency: 'daily'
  });

  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    console.log('Saving system settings:', settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  // Mock system stats
  const systemStats = {
    uptime: '99.9%',
    activeUsers: 1234,
    totalStorage: '45.2 GB',
    apiCalls: 28567,
    avgResponseTime: '120ms',
    errorRate: '0.01%'
  };

  return (
    <div className="space-y-4">
      {/* System Overview */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Utilizatori Activi</CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemStats.activeUsers}</div>
            <p className="text-xs text-muted-foreground">ultimele 24h</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Uptime</CardTitle>
            <Activity className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemStats.uptime}</div>
            <p className="text-xs text-muted-foreground">ultima lună</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Timp Răspuns</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemStats.avgResponseTime}</div>
            <p className="text-xs text-muted-foreground">medie</p>
          </CardContent>
        </Card>
      </div>

      {/* General Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Setări Generale
          </CardTitle>
          <CardDescription>
            Configurări de bază ale platformei
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="siteName">Nume Platformă</Label>
            <Input
              id="siteName"
              value={settings.siteName}
              onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
            />
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/50">
            <div className="flex items-center gap-3">
              <Shield className="h-5 w-5 text-orange-600" />
              <div>
                <p className="font-medium">Mod Mentenanță</p>
                <p className="text-sm text-muted-foreground">
                  Dezactivează accesul utilizatorilor
                </p>
              </div>
            </div>
            <Switch
              checked={settings.maintenanceMode}
              onCheckedChange={(checked) => setSettings({ ...settings, maintenanceMode: checked })}
            />
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <Users className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium">Permite Înregistrări</p>
                <p className="text-sm text-muted-foreground">
                  Utilizatori noi se pot înregistra
                </p>
              </div>
            </div>
            <Switch
              checked={settings.allowRegistration}
              onCheckedChange={(checked) => setSettings({ ...settings, allowRegistration: checked })}
            />
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <Globe className="h-5 w-5 text-blue-600" />
              <div>
                <p className="font-medium">Verificare Email</p>
                <p className="text-sm text-muted-foreground">
                  Necesită verificare email la înregistrare
                </p>
              </div>
            </div>
            <Switch
              checked={settings.requireEmailVerification}
              onCheckedChange={(checked) => setSettings({ ...settings, requireEmailVerification: checked })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="sessionTimeout">Timeout Sesiune (min)</Label>
              <Input
                id="sessionTimeout"
                type="number"
                value={settings.sessionTimeout}
                onChange={(e) => setSettings({ ...settings, sessionTimeout: parseInt(e.target.value) })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="maxUsers">Max Utilizatori/Plan</Label>
              <Input
                id="maxUsers"
                type="number"
                value={settings.maxUsersPerPlan}
                onChange={(e) => setSettings({ ...settings, maxUsersPerPlan: parseInt(e.target.value) })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notifications & Analytics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notificări și Analytics
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <Bell className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="font-medium">Notificări Sistem</p>
                <p className="text-sm text-muted-foreground">
                  Trimite notificări către utilizatori
                </p>
              </div>
            </div>
            <Switch
              checked={settings.enableNotifications}
              onCheckedChange={(checked) => setSettings({ ...settings, enableNotifications: checked })}
            />
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <div>
                <p className="font-medium">Analytics</p>
                <p className="text-sm text-muted-foreground">
                  Colectează date de utilizare
                </p>
              </div>
            </div>
            <Switch
              checked={settings.enableAnalytics}
              onCheckedChange={(checked) => setSettings({ ...settings, enableAnalytics: checked })}
            />
          </div>
        </CardContent>
      </Card>

      {/* Database Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Informații Database
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Spațiu Utilizat</p>
              <p className="text-lg font-semibold">{systemStats.totalStorage}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Apeluri API (24h)</p>
              <p className="text-lg font-semibold">{systemStats.apiCalls.toLocaleString()}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Rată Erori</p>
              <p className="text-lg font-semibold text-green-600">{systemStats.errorRate}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Backup</p>
              <Badge variant="default">Zilnic - Automat</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex items-center justify-between pt-4">
        {saved && (
          <Alert className="flex-1 mr-4">
            <Check className="h-4 w-4" />
            <AlertDescription>
              Setările au fost salvate cu succes!
            </AlertDescription>
          </Alert>
        )}
        <Button onClick={handleSave} size="lg" className="ml-auto">
          Salvează Toate Setările
        </Button>
      </div>
    </div>
  );
}
