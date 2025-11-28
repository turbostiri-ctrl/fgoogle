import UserProfileORM, {
  type UserProfileModel,
  UserProfileSubscriptionTier
} from '@/components/data/orm/orm_user_profile';

/**
 * Seeds the admin user into the database if it doesn't already exist
 */
export async function seedAdminUser(): Promise<void> {
  const orm = UserProfileORM.getInstance();

  const adminEmail = 'marketingporo@yahoo.com';
  const adminPassword = 'Qwertys1994@';

  try {
    // Check if admin user already exists
    const existingUsers = await orm.getUserProfileByEmail(adminEmail);

    if (existingUsers.length > 0) {
      console.log('Admin user already exists');
      return;
    }

    // Create admin user
    const adminUser: Partial<UserProfileModel> = {
      email: adminEmail,
      password: adminPassword,
      name: 'Admin User',
      subscription_tier: UserProfileSubscriptionTier.Premium,
      preferences: {
        dark_mode: false,
        language: 'en',
        notifications_enabled: true
      }
    };

    await orm.insertUserProfile([adminUser as UserProfileModel]);
    console.log('Admin user created successfully');
  } catch (error) {
    console.error('Failed to seed admin user:', error);
  }
}
