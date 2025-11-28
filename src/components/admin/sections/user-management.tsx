import * as React from 'react';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import UserProfileORM, {
  type UserProfileModel,
  UserProfileSubscriptionTier,
  UserProfileFitnessLevel
} from '@/components/data/orm/orm_user_profile';
import { Pencil, Trash2, Search, UserPlus, Shield } from 'lucide-react';

export function UserManagement() {
  const [users, setUsers] = useState<UserProfileModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<UserProfileModel | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const orm = UserProfileORM.getInstance();

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const allUsers = await orm.getAllUserProfile();
      setUsers(allUsers);
    } catch (error) {
      console.error('Failed to load users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditUser = (user: UserProfileModel) => {
    setSelectedUser({ ...user });
    setIsEditDialogOpen(true);
  };

  const handleDeleteUser = (user: UserProfileModel) => {
    setSelectedUser(user);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedUser?.id) return;

    try {
      await orm.deleteUserProfileById(selectedUser.id);
      await loadUsers();
      setIsDeleteDialogOpen(false);
      setSelectedUser(null);
    } catch (error) {
      console.error('Failed to delete user:', error);
    }
  };

  const saveUserChanges = async () => {
    if (!selectedUser?.id) return;

    try {
      await orm.setUserProfileById(selectedUser.id, selectedUser);
      await loadUsers();
      setIsEditDialogOpen(false);
      setSelectedUser(null);
    } catch (error) {
      console.error('Failed to update user:', error);
    }
  };

  const filteredUsers = users.filter(user =>
    user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getTierBadgeVariant = (tier: UserProfileSubscriptionTier): "default" | "secondary" | "outline" => {
    switch (tier) {
      case UserProfileSubscriptionTier.Premium:
        return "default";
      case UserProfileSubscriptionTier.Free:
        return "secondary";
      default:
        return "outline";
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>管理 Utilizatori</CardTitle>
          <CardDescription>
            Vizualizează și gestionează toți utilizatorii platformei ({users.length} utilizatori)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Caută utilizatori după nume sau email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          {/* Users Table */}
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            </div>
          ) : (
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nume</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Abonament</TableHead>
                    <TableHead>Nivel Fitness</TableHead>
                    <TableHead>Data Creare</TableHead>
                    <TableHead className="text-right">Acțiuni</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        {searchQuery ? 'Niciun utilizator găsit' : 'Nu există utilizatori'}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            {user.name}
                            {user.email === 'marketingporo@yahoo.com' && (
                              <Shield className="h-3 w-3 text-primary" />
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Badge variant={getTierBadgeVariant(user.subscription_tier)}>
                            {user.subscription_tier === UserProfileSubscriptionTier.Premium ? 'Premium' : 'Free'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {user.fitness_level === UserProfileFitnessLevel.Beginner && 'Începător'}
                          {user.fitness_level === UserProfileFitnessLevel.Intermediate && 'Intermediar'}
                          {user.fitness_level === UserProfileFitnessLevel.Advanced && 'Avansat'}
                          {!user.fitness_level && '-'}
                        </TableCell>
                        <TableCell>
                          {user.create_time ? new Date(parseInt(user.create_time) * 1000).toLocaleDateString('ro-RO') : '-'}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEditUser(user)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteUser(user)}
                              disabled={user.email === 'marketingporo@yahoo.com'}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
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

      {/* Edit User Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Editează Utilizator</DialogTitle>
            <DialogDescription>
              Modifică detaliile utilizatorului
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-name">Nume</Label>
                <Input
                  id="edit-name"
                  value={selectedUser.name || ''}
                  onChange={(e) => setSelectedUser({ ...selectedUser, name: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-email">Email</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={selectedUser.email || ''}
                  onChange={(e) => setSelectedUser({ ...selectedUser, email: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-age">Vârstă</Label>
                  <Input
                    id="edit-age"
                    type="number"
                    value={selectedUser.age || ''}
                    onChange={(e) => setSelectedUser({ ...selectedUser, age: parseInt(e.target.value) || null })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-weight">Greutate (kg)</Label>
                  <Input
                    id="edit-weight"
                    type="number"
                    value={selectedUser.weight || ''}
                    onChange={(e) => setSelectedUser({ ...selectedUser, weight: parseFloat(e.target.value) || null })}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-tier">Tip Abonament</Label>
                <Select
                  value={selectedUser.subscription_tier?.toString()}
                  onValueChange={(value) => setSelectedUser({
                    ...selectedUser,
                    subscription_tier: parseInt(value) as UserProfileSubscriptionTier
                  })}
                >
                  <SelectTrigger id="edit-tier">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={UserProfileSubscriptionTier.Free.toString()}>Free</SelectItem>
                    <SelectItem value={UserProfileSubscriptionTier.Premium.toString()}>Premium</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-fitness-level">Nivel Fitness</Label>
                <Select
                  value={selectedUser.fitness_level?.toString() || '0'}
                  onValueChange={(value) => setSelectedUser({
                    ...selectedUser,
                    fitness_level: parseInt(value) as UserProfileFitnessLevel
                  })}
                >
                  <SelectTrigger id="edit-fitness-level">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Nespecificat</SelectItem>
                    <SelectItem value={UserProfileFitnessLevel.Beginner.toString()}>Începător</SelectItem>
                    <SelectItem value={UserProfileFitnessLevel.Intermediate.toString()}>Intermediar</SelectItem>
                    <SelectItem value={UserProfileFitnessLevel.Advanced.toString()}>Avansat</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Anulează
            </Button>
            <Button onClick={saveUserChanges}>
              Salvează Modificările
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmă Ștergerea</DialogTitle>
            <DialogDescription>
              Ești sigur că vrei să ștergi acest utilizator? Această acțiune nu poate fi anulată.
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <Alert>
              <AlertDescription>
                <strong>{selectedUser.name}</strong> ({selectedUser.email})
              </AlertDescription>
            </Alert>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Anulează
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Șterge Utilizator
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
