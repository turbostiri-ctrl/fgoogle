import * as React from 'react';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import NutritionRecipeORM, { type NutritionRecipeModel } from '@/components/data/orm/orm_nutrition_recipe';
import NutritionLogORM, { type NutritionLogModel } from '@/components/data/orm/orm_nutrition_log';
import { Apple, BookOpen, Calendar, TrendingUp } from 'lucide-react';

export function NutritionManagement() {
  const [recipes, setRecipes] = useState<NutritionRecipeModel[]>([]);
  const [nutritionLogs, setNutritionLogs] = useState<NutritionLogModel[]>([]);
  const [loading, setLoading] = useState(true);

  const recipeORM = NutritionRecipeORM.getInstance();
  const logORM = NutritionLogORM.getInstance();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [recipesData, logsData] = await Promise.all([
        recipeORM.getAllNutritionRecipe(),
        logORM.getAllNutritionLog()
      ]);
      setRecipes(recipesData);
      setNutritionLogs(logsData);
    } catch (error) {
      console.error('Failed to load nutrition data:', error);
    } finally {
      setLoading(false);
    }
  };

  const totalCalories = nutritionLogs.reduce((sum, log) => sum + (log.calories || 0), 0);
  const avgCaloriesPerLog = nutritionLogs.length > 0 ? Math.round(totalCalories / nutritionLogs.length) : 0;

  return (
    <div className="space-y-4">
      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rețete</CardTitle>
            <BookOpen className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{recipes.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Înregistrări Nutriție</CardTitle>
            <Calendar className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{nutritionLogs.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Calorii</CardTitle>
            <TrendingUp className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCalories.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Medie Calorii</CardTitle>
            <Apple className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgCaloriesPerLog}</div>
            <p className="text-xs text-muted-foreground">per înregistrare</p>
          </CardContent>
        </Card>
      </div>

      {/* Recipes Table */}
      <Card>
        <CardHeader>
          <CardTitle>Rețete Nutriție</CardTitle>
          <CardDescription>
            Toate rețetele și planurile de masă din platformă
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
                    <TableHead>Nume Rețetă</TableHead>
                    <TableHead>Descriere</TableHead>
                    <TableHead>Calorii</TableHead>
                    <TableHead>Proteine</TableHead>
                    <TableHead>Data Creare</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recipes.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                        Nu există rețete înregistrate
                      </TableCell>
                    </TableRow>
                  ) : (
                    recipes.map((recipe) => (
                      <TableRow key={recipe.id}>
                        <TableCell className="font-medium">{recipe.name || 'Fără nume'}</TableCell>
                        <TableCell className="max-w-xs truncate">
                          {recipe.description || '-'}
                        </TableCell>
                        <TableCell>{recipe.calories ? `${recipe.calories} kcal` : '-'}</TableCell>
                        <TableCell>{recipe.protein ? `${recipe.protein}g` : '-'}</TableCell>
                        <TableCell>
                          {recipe.create_time
                            ? new Date(parseInt(recipe.create_time) * 1000).toLocaleDateString('ro-RO')
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

      {/* Nutrition Logs Table */}
      <Card>
        <CardHeader>
          <CardTitle>Jurnal Nutriție Utilizatori</CardTitle>
          <CardDescription>
            Înregistrări zilnice ale consumului alimentar
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
                    <TableHead>Tip Masă</TableHead>
                    <TableHead>Calorii</TableHead>
                    <TableHead>Rețetă ID</TableHead>
                    <TableHead>User ID</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Data</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {nutritionLogs.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        Nu există înregistrări de nutriție
                      </TableCell>
                    </TableRow>
                  ) : (
                    nutritionLogs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell className="font-medium">
                          {log.meal_type === 1 ? 'Mic dejun' :
                           log.meal_type === 2 ? 'Prânz' :
                           log.meal_type === 3 ? 'Cină' : 'Gustare'}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{log.calories || 0} kcal</Badge>
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground truncate max-w-[100px]">
                          {log.recipe_id?.substring(0, 8) || '-'}
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground truncate max-w-[100px]">
                          {log.user_id?.substring(0, 8) || '-'}
                        </TableCell>
                        <TableCell>
                          <Badge variant="default">Înregistrat</Badge>
                        </TableCell>
                        <TableCell>
                          {log.consumed_at
                            ? new Date(log.consumed_at).toLocaleDateString('ro-RO')
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
