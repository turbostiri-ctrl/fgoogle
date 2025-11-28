import * as React from 'react';
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { MessageCircle, Settings, Zap, Check } from 'lucide-react';

export function AICoachSettings() {
  const [settings, setSettings] = useState({
    enabled: true,
    model: 'gpt-4',
    temperature: 0.7,
    maxTokens: 2000,
    systemPrompt: 'Tu ești un antrenor personal profesionist și expert în nutriție. Oferă sfaturi personalizate, motivaționale și bazate pe știință pentru utilizatorii FitLife Pro.',
    contextWindow: 4000,
    responseStyle: 'friendly',
    includeMotivation: true,
    autoSuggest: true
  });

  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    // Simulate saving settings
    console.log('Saving AI Coach settings:', settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Configurare AI Coach</CardTitle>
          <CardDescription>
            Setări pentru asistentul AI și comportamentul chatbot-ului
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Status */}
          <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/50">
            <div className="flex items-center gap-3">
              <MessageCircle className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium">Status AI Coach</p>
                <p className="text-sm text-muted-foreground">
                  {settings.enabled ? 'Activ și funcțional' : 'Dezactivat'}
                </p>
              </div>
            </div>
            <Switch
              checked={settings.enabled}
              onCheckedChange={(checked) => setSettings({ ...settings, enabled: checked })}
            />
          </div>

          {/* Model Configuration */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Configurare Model
            </h3>

            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="model">Model AI</Label>
                <Input
                  id="model"
                  value={settings.model}
                  onChange={(e) => setSettings({ ...settings, model: e.target.value })}
                  placeholder="gpt-4"
                />
                <p className="text-xs text-muted-foreground">
                  Model utilizat pentru generarea răspunsurilor AI Coach
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="temperature">Temperature</Label>
                  <Input
                    id="temperature"
                    type="number"
                    min="0"
                    max="2"
                    step="0.1"
                    value={settings.temperature}
                    onChange={(e) => setSettings({ ...settings, temperature: parseFloat(e.target.value) })}
                  />
                  <p className="text-xs text-muted-foreground">
                    Creativitate: 0 (conservativ) - 2 (creativ)
                  </p>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="maxTokens">Max Tokens</Label>
                  <Input
                    id="maxTokens"
                    type="number"
                    min="100"
                    max="4000"
                    step="100"
                    value={settings.maxTokens}
                    onChange={(e) => setSettings({ ...settings, maxTokens: parseInt(e.target.value) })}
                  />
                  <p className="text-xs text-muted-foreground">
                    Lungimea maximă a răspunsului
                  </p>
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="systemPrompt">System Prompt</Label>
                <Textarea
                  id="systemPrompt"
                  value={settings.systemPrompt}
                  onChange={(e) => setSettings({ ...settings, systemPrompt: e.target.value })}
                  rows={5}
                  className="font-mono text-sm"
                />
                <p className="text-xs text-muted-foreground">
                  Instrucțiuni de bază pentru comportamentul AI Coach
                </p>
              </div>
            </div>
          </div>

          {/* Behavior Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Comportament și Stil
            </h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium">Include Motivație</p>
                  <p className="text-sm text-muted-foreground">
                    Adaugă mesaje motivaționale în răspunsuri
                  </p>
                </div>
                <Switch
                  checked={settings.includeMotivation}
                  onCheckedChange={(checked) => setSettings({ ...settings, includeMotivation: checked })}
                />
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium">Auto-Sugestii</p>
                  <p className="text-sm text-muted-foreground">
                    Oferă sugestii automate bazate pe progres
                  </p>
                </div>
                <Switch
                  checked={settings.autoSuggest}
                  onCheckedChange={(checked) => setSettings({ ...settings, autoSuggest: checked })}
                />
              </div>

              <div className="grid gap-2">
                <Label>Stil Răspuns</Label>
                <div className="flex gap-2">
                  <Badge
                    variant={settings.responseStyle === 'professional' ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => setSettings({ ...settings, responseStyle: 'professional' })}
                  >
                    Profesional
                  </Badge>
                  <Badge
                    variant={settings.responseStyle === 'friendly' ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => setSettings({ ...settings, responseStyle: 'friendly' })}
                  >
                    Prietenos
                  </Badge>
                  <Badge
                    variant={settings.responseStyle === 'motivational' ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => setSettings({ ...settings, responseStyle: 'motivational' })}
                  >
                    Motivațional
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex items-center justify-between pt-4 border-t">
            {saved && (
              <Alert className="flex-1 mr-4">
                <Check className="h-4 w-4" />
                <AlertDescription>
                  Setările au fost salvate cu succes!
                </AlertDescription>
              </Alert>
            )}
            <Button onClick={handleSave} className="ml-auto">
              Salvează Setările
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Usage Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>Statistici Utilizare AI Coach</CardTitle>
          <CardDescription>
            Date despre interacțiunile cu AI Coach
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="p-4 border rounded-lg">
              <p className="text-sm text-muted-foreground">Total Conversații</p>
              <p className="text-2xl font-bold">1,247</p>
            </div>
            <div className="p-4 border rounded-lg">
              <p className="text-sm text-muted-foreground">Mesaje Trimise</p>
              <p className="text-2xl font-bold">8,932</p>
            </div>
            <div className="p-4 border rounded-lg">
              <p className="text-sm text-muted-foreground">Rating Mediu</p>
              <p className="text-2xl font-bold">4.8/5</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
