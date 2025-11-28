import * as React from 'react';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Apple, Clock, Flame, Search, Crown } from 'lucide-react';
import NutritionRecipeORM, { type NutritionRecipeModel } from '@/components/data/orm/orm_nutrition_recipe';

export function NutritionSection() {
  const { isPremium } = useAuth();
  const [recipes, setRecipes] = useState<NutritionRecipeModel[]>([]);
  const [filteredRecipes, setFilteredRecipes] = useState<NutritionRecipeModel[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [mealType, setMealType] = useState('all');

  useEffect(() => {
    loadRecipes();
  }, []);

  useEffect(() => {
    filterRecipes();
  }, [recipes, searchQuery, mealType]);

  const loadRecipes = async () => {
    try {
      const orm = NutritionRecipeORM.getInstance();
      const allRecipes = await orm.getAllNutritionRecipe();
      setRecipes(allRecipes);
    } catch (error) {
      console.error('Failed to load recipes:', error);
    }
  };

  const filterRecipes = () => {
    let filtered = recipes;

    if (mealType !== 'all') {
      filtered = filtered.filter(r => {
        const mealTypeStr = typeof r.meal_type === 'string' ? r.meal_type : String(r.meal_type || '');
        return mealTypeStr.toLowerCase() === mealType.toLowerCase();
      });
    }

    if (searchQuery) {
      filtered = filtered.filter(r =>
        r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredRecipes(filtered);
  };

  const mealTypes = ['all', 'breakfast', 'lunch', 'dinner', 'snack'];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Nutrition & Recipes</h1>
        <p className="text-muted-foreground">Healthy meals for your fitness goals</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search recipes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      <Tabs value={mealType} onValueChange={setMealType}>
        <TabsList className="w-full justify-start">
          {mealTypes.map(type => (
            <TabsTrigger key={type} value={type} className="capitalize">
              {type}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredRecipes.length > 0 ? (
          filteredRecipes.map(recipe => (
            <Card key={recipe.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{recipe.name}</CardTitle>
                    {recipe.is_premium && !isPremium && (
                      <Badge variant="secondary" className="mt-1">
                        <Crown className="h-3 w-3 mr-1" />
                        Premium
                      </Badge>
                    )}
                  </div>
                </div>
                <CardDescription className="line-clamp-2">
                  {recipe.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center gap-1">
                    <Flame className="h-4 w-4 text-orange-500" />
                    <span>{recipe.calories} cal</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{recipe.prep_time_minutes} min</span>
                  </div>
                </div>
                <div className="flex gap-2 text-xs">
                  <span className="bg-secondary px-2 py-1 rounded">P: {recipe.protein}g</span>
                  <span className="bg-secondary px-2 py-1 rounded">C: {recipe.carbs}g</span>
                  <span className="bg-secondary px-2 py-1 rounded">F: {recipe.fats}g</span>
                </div>
                <Button className="w-full" disabled={recipe.is_premium && !isPremium}>
                  {recipe.is_premium && !isPremium ? 'Premium Only' : 'View Recipe'}
                </Button>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <Apple className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No recipes found</p>
          </div>
        )}
      </div>
    </div>
  );
}
