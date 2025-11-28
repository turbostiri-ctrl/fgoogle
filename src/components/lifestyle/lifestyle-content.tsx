import * as React from 'react';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, Video, Crown, Heart, Brain, Moon } from 'lucide-react';
import LifestyleContentORM, { type LifestyleContentModel, LifestyleContentContentType } from '@/components/data/orm/orm_lifestyle_content';

export function LifestyleContent() {
  const { isPremium } = useAuth();
  const [content, setContent] = useState<LifestyleContentModel[]>([]);
  const [category, setCategory] = useState('all');

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    try {
      const orm = LifestyleContentORM.getInstance();
      const allContent = await orm.getAllLifestyleContent();
      setContent(allContent);
    } catch (error) {
      console.error('Failed to load lifestyle content:', error);
    }
  };

  const filteredContent = category === 'all'
    ? content
    : content.filter(c => c.category?.toLowerCase() === category.toLowerCase());

  const categories = [
    { id: 'all', label: 'All', icon: BookOpen },
    { id: 'sleep', label: 'Sleep', icon: Moon },
    { id: 'mindset', label: 'Mindset', icon: Brain },
    { id: 'health', label: 'Health', icon: Heart }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Lifestyle & Education</h1>
        <p className="text-muted-foreground">Learn about health, wellness, and productivity</p>
      </div>

      <Tabs value={category} onValueChange={setCategory}>
        <TabsList className="w-full justify-start">
          {categories.map(cat => (
            <TabsTrigger key={cat.id} value={cat.id} className="gap-2">
              <cat.icon className="h-4 w-4" />
              {cat.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredContent.length > 0 ? (
          filteredContent.map(item => (
            <Card key={item.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {item.content_type === LifestyleContentContentType.Video ? (
                        <Video className="h-4 w-4 text-primary" />
                      ) : (
                        <BookOpen className="h-4 w-4 text-primary" />
                      )}
                      <Badge variant="secondary" className="text-xs">
                        {item.category}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg">{item.title}</CardTitle>
                  </div>
                  {item.is_premium && (
                    <Badge variant="secondary">
                      <Crown className="h-3 w-3 mr-1" />
                      Premium
                    </Badge>
                  )}
                </div>
                <CardDescription className="line-clamp-3">
                  {item.content?.substring(0, 150)}...
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  className="w-full"
                  variant={item.is_premium && !isPremium ? 'outline' : 'default'}
                  disabled={item.is_premium && !isPremium}
                >
                  {item.is_premium && !isPremium
                    ? 'Premium Only'
                    : item.content_type === LifestyleContentContentType.Video
                      ? 'Watch'
                      : 'Read'}
                </Button>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No content available</p>
          </div>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daily Wellness Tips</CardTitle>
          <CardDescription>Quick tips for a healthier lifestyle</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start gap-3 p-3 bg-secondary rounded-lg">
            <Moon className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <h4 className="font-semibold text-sm">Sleep Quality</h4>
              <p className="text-sm text-muted-foreground">Aim for 7-9 hours of quality sleep each night</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 bg-secondary rounded-lg">
            <Heart className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <h4 className="font-semibold text-sm">Hydration</h4>
              <p className="text-sm text-muted-foreground">Drink at least 8 glasses of water daily</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 bg-secondary rounded-lg">
            <Brain className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <h4 className="font-semibold text-sm">Mental Health</h4>
              <p className="text-sm text-muted-foreground">Practice mindfulness or meditation for 10 minutes</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
