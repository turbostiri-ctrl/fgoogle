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
import UserProfileORM, {
  type UserProfileModel,
  UserProfileSubscriptionTier
} from '@/components/data/orm/orm_user_profile';
import { Crown, TrendingUp, Users, DollarSign, Calendar } from 'lucide-react';

export function SubscriptionManagement() {
  const [users, setUsers] = useState<UserProfileModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<UserProfileModel | null>(null);
  const [isUpgradeDialogOpen, setIsUpgradeDialogOpen] = useState(false);
  const [expiryDate, setExpiryDate] = useState('');
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

  const handleUpgradeSubscription = (user: UserProfileModel) => {
    setSelectedUser(user);
    // Set default expiry to 1 month from now
    const defaultExpiry = new Date();
    defaultExpiry.setMonth(defaultExpiry.getMonth() + 1);
    setExpiryDate(defaultExpiry.toISOString().split('T')[0]);
    setIsUpgradeDialogOpen(true);
  };

  const confirmUpgrade = async () => {
    if (!selectedUser?.id) return;

    try {
      const newTier = selectedUser.subscription_tier === UserProfileSubscriptionTier.Premium
        ? UserProfileSubscriptionTier.Free
        : UserProfileSubscriptionTier.Premium;

      const updatedUser = {
        ...selectedUser,
        subscription_tier: newTier,
        subscription_expiry_date: newTier === UserProfileSubscriptionTier.Premium ? expiryDate : null
      };

      await orm.setUserProfileById(selectedUser.id, updatedUser);
      await loadUsers();
      setIsUpgradeDialogOpen(false);
      setSelectedUser(null);
    } catch (error) {
      console.error('Failed to update subscription:', error);
    }
  };

  const freeUsers = users.filter(u => u.subscription_tier === UserProfileSubscriptionTier.Free);
  const premiumUsers = users.filter(u => u.subscription_tier === UserProfileSubscriptionTier.Premium);
  const activeSubscriptions = premiumUsers.filter(u =>
    !u.subscription_expiry_date || new Date(u.subscription_expiry_date) > new Date()
  );

  return (
    <div className="space-y-4">
      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Utilizatori</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Abonați Premium</CardTitle>
            <Crown className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{premiumUsers.length}</div>
            <p className="text-xs text-muted-foreground">
              {activeSubscriptions.length} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Utilizatori Free</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{freeUsers.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rata Conversie</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {users.length > 0 ? Math.round((premiumUsers.length / users.length) * 100) : 0}%
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Subscriptions Table */}
      <Card>
        <CardHeader>
          <CardTitle>Gestionare Abonamente</CardTitle>
          <CardDescription>
            Vizualizează și modifică abonamentele utilizatorilor
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
                    <TableHead>Utilizator</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Plan</TableHead>
                    <TableHead>Data Expirare</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Acțiuni</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        Nu există utilizatori
                      </TableCell>
                    </TableRow>
                  ) : (
                    users.map((user) => {
                      const isPremium = user.subscription_tier === UserProfileSubscriptionTier.Premium;
                      const isExpired = user.subscription_expiry_date &&
                        new Date(user.subscription_expiry_date) < new Date();
                      const isActive = isPremium && !isExpired;

                      return (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">{user.name}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>
                            <Badge variant={isPremium ? 'default' : 'secondary'}>
                              {isPremium ? 'Premium' : 'Free'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {user.subscription_expiry_date
                              ? new Date(user.subscription_expiry_date).toLocaleDateString('ro-RO')
                              : '-'}
                          </TableCell>
                          <TableCell>
                            {isPremium ? (
                              <Badge variant={isActive ? 'default' : 'destructive'}>
                                {isActive ? 'Activ' : 'Expirat'}
                              </Badge>
                            ) : (
                              <Badge variant="outline">-</Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              size="sm"
                              variant={isPremium ? 'outline' : 'default'}
                              onClick={() => handleUpgradeSubscription(user)}
                            >
                              {isPremium ? 'Downgrade la Free' : 'Upgrade la Premium'}
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Upgrade/Downgrade Dialog */}
      <Dialog open={isUpgradeDialogOpen} onOpenChange={setIsUpgradeDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedUser?.subscription_tier === UserProfileSubscriptionTier.Premium
                ? 'Downgrade la Free'
                : 'Upgrade la Premium'}
            </DialogTitle>
            <DialogDescription>
              Modifică abonamentul pentru {selectedUser?.name}
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Utilizator</Label>
                <Input value={`${selectedUser.name} (${selectedUser.email})`} disabled />
              </div>
              <div className="space-y-2">
                <Label>Plan Curent</Label>
                <Input
                  value={selectedUser.subscription_tier === UserProfileSubscriptionTier.Premium ? 'Premium' : 'Free'}
                  disabled
                />
              </div>
              <div className="space-y-2">
                <Label>Plan Nou</Label>
                <Input
                  value={selectedUser.subscription_tier === UserProfileSubscriptionTier.Premium ? 'Free' : 'Premium'}
                  disabled
                />
              </div>
              {selectedUser.subscription_tier === UserProfileSubscriptionTier.Free && (
                <div className="space-y-2">
                  <Label htmlFor="expiry-date">Data Expirare</Label>
                  <Input
                    id="expiry-date"
                    type="date"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                  />
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsUpgradeDialogOpen(false)}>
              Anulează
            </Button>
            <Button onClick={confirmUpgrade}>
              Confirmă
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
