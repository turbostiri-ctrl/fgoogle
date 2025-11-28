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
import UserProfileORM, {
  type UserProfileModel,
  UserProfileSubscriptionTier
} from '@/components/data/orm/orm_user_profile';
import { DollarSign, TrendingUp, CreditCard, Calendar } from 'lucide-react';

interface PaymentRecord {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  amount: number;
  plan: string;
  status: 'completed' | 'pending' | 'failed';
  date: Date;
}

export function PaymentManagement() {
  const [users, setUsers] = useState<UserProfileModel[]>([]);
  const [loading, setLoading] = useState(true);
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

  // Generate mock payment records based on premium users
  const generatePaymentRecords = (): PaymentRecord[] => {
    const premiumUsers = users.filter(u => u.subscription_tier === UserProfileSubscriptionTier.Premium);

    return premiumUsers.map((user, index) => ({
      id: `PAY-${user.id?.substring(0, 8)}`,
      userId: user.id || '',
      userName: user.name || '',
      userEmail: user.email || '',
      amount: 49.99,
      plan: 'Premium Monthly',
      status: 'completed' as const,
      date: user.create_time ? new Date(parseInt(user.create_time) * 1000) : new Date()
    }));
  };

  const paymentRecords = generatePaymentRecords();
  const totalRevenue = paymentRecords.reduce((sum, record) => sum + record.amount, 0);
  const completedPayments = paymentRecords.filter(p => p.status === 'completed').length;

  return (
    <div className="space-y-4">
      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Venit Total</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              Din {paymentRecords.length} tranzacții
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Plăți Finalizate</CardTitle>
            <CreditCard className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedPayments}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Venit Mediu</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${paymentRecords.length > 0 ? (totalRevenue / paymentRecords.length).toFixed(2) : '0.00'}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Luna Aceasta</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${paymentRecords.filter(p => {
                const paymentDate = new Date(p.date);
                const now = new Date();
                return paymentDate.getMonth() === now.getMonth() &&
                       paymentDate.getFullYear() === now.getFullYear();
              }).reduce((sum, p) => sum + p.amount, 0).toFixed(2)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payments Table */}
      <Card>
        <CardHeader>
          <CardTitle>Istoric Plăți</CardTitle>
          <CardDescription>
            Vizualizează toate tranzacțiile și plățile efectuate
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
                    <TableHead>ID Tranzacție</TableHead>
                    <TableHead>Utilizator</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Plan</TableHead>
                    <TableHead>Sumă</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Data</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paymentRecords.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        Nu există tranzacții înregistrate
                      </TableCell>
                    </TableRow>
                  ) : (
                    paymentRecords.map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell className="font-mono text-sm">{payment.id}</TableCell>
                        <TableCell className="font-medium">{payment.userName}</TableCell>
                        <TableCell>{payment.userEmail}</TableCell>
                        <TableCell>
                          <Badge variant="default">{payment.plan}</Badge>
                        </TableCell>
                        <TableCell className="font-semibold text-green-600">
                          ${payment.amount.toFixed(2)}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              payment.status === 'completed' ? 'default' :
                              payment.status === 'pending' ? 'secondary' :
                              'destructive'
                            }
                          >
                            {payment.status === 'completed' ? 'Finalizat' :
                             payment.status === 'pending' ? 'În așteptare' :
                             'Eșuat'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {payment.date.toLocaleDateString('ro-RO')}
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
