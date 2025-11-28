# Google OAuth Setup Guide

This guide explains how to set up Google OAuth automatic login for FitLife Pro.

## Features Implemented

- **Automatic Login/Register**: Users can sign in or sign up with their Google account in one click
- **Seamless Integration**: If a user with the Google email already exists, they are logged in; otherwise, a new account is created
- **Unified Experience**: Google login button appears on both login and register pages
- **User-Friendly UI**: Clean separator with "Or continue with" text between traditional and Google login

## How to Set Up Google OAuth

### Step 1: Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to **APIs & Services** → **Credentials**
4. Click **Create Credentials** → **OAuth 2.0 Client ID**
5. Configure the OAuth consent screen if you haven't already:
   - Choose "External" for user type
   - Fill in the application name: "FitLife Pro"
   - Add your email as developer contact
   - Add scopes: `email`, `profile`
6. Create OAuth 2.0 Client ID:
   - Application type: **Web application**
   - Name: "FitLife Pro Web Client"
   - Authorized JavaScript origins:
     - `http://localhost:3000` (for development)
     - Your production domain (e.g., `https://fitlifepro.com`)
   - Authorized redirect URIs:
     - `http://localhost:3000` (for development)
     - Your production domain (e.g., `https://fitlifepro.com`)
7. Click **Create** and copy your:
   - **Client ID** (looks like: `xxxxx.apps.googleusercontent.com`)
   - **Client Secret** (looks like: `GOCSPX-xxxxx`)

### Step 2: Configure Environment Variables

1. Open `.env.local` file in the project root
2. Replace the placeholder values with your actual credentials:

```env
VITE_GOOGLE_CLIENT_ID=your-actual-client-id.apps.googleusercontent.com
VITE_GOOGLE_CLIENT_SECRET=your-actual-client-secret
```

### Step 3: Test the Integration

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Navigate to the login page
3. Click on **"Sign in with Google"** button
4. Authenticate with your Google account
5. You should be automatically logged in or registered

## How It Works

### Authentication Flow

1. **User clicks Google button** → Opens Google OAuth consent screen
2. **User authorizes** → Google returns an authorization code
3. **Exchange code for token** → Application exchanges code for access token
4. **Fetch user info** → Application fetches user profile (email, name, picture)
5. **Check existing user**:
   - If email exists in database → **Login** user
   - If email doesn't exist → **Create account** and login user
6. **Store session** → User ID is saved in localStorage

### Key Components

#### 1. GoogleAuthButton (`src/components/auth/google-auth-button.tsx`)
- Handles the OAuth flow using `@react-oauth/google`
- Exchanges authorization code for access token
- Fetches user information from Google API
- Calls success/error callbacks

#### 2. AuthContext (`src/contexts/auth-context.tsx`)
- New `googleAuth()` method for Google authentication
- Checks if user exists by email
- Creates new user if needed
- Stores user session

#### 3. Login/Register Pages
- Integrated Google button with separator
- Unified error handling
- Success callbacks for both Google and traditional auth

## Security Considerations

### Current Implementation (Development)
- Client-side OAuth flow
- Tokens exchanged in browser
- Good for development and testing

### Production Recommendations

1. **Move token exchange to backend**:
   - Don't expose `VITE_GOOGLE_CLIENT_SECRET` in frontend
   - Create a backend endpoint: `POST /auth/google`
   - Exchange authorization code on server
   - Return your own JWT token

2. **Add HTTPS**:
   - Google OAuth requires HTTPS in production
   - Update authorized origins to use HTTPS

3. **Implement proper password hashing**:
   - Current code stores Google ID as password
   - Use bcrypt or similar for traditional passwords
   - Consider separate `google_id` field in database

4. **Add CSRF protection**:
   - Use state parameter in OAuth flow
   - Verify state matches on callback

5. **Validate tokens server-side**:
   - Verify Google tokens on your backend
   - Don't trust client-side validation alone

## Troubleshooting

### "Google login failed" error
- Check if Client ID and Secret are correctly set in `.env.local`
- Verify authorized origins/redirects in Google Console match your domain
- Check browser console for detailed error messages

### "Redirect URI mismatch" error
- Add your current origin to authorized redirect URIs in Google Console
- Make sure the origin matches exactly (including port number)

### "Access blocked" error
- Configure OAuth consent screen properly
- Add test users in Google Console if app is in testing mode
- Verify required scopes are added

## Testing Accounts

For development, you can use any Google account. The app will:
- Create a new user if the email doesn't exist
- Log in existing user if the email is already registered

## Database Schema

Google authenticated users are stored with:
- `email`: User's Google email
- `name`: User's Google display name
- `password`: Google ID (used as identifier, not for password login)
- `subscription_tier`: Defaults to "Free"
- `preferences`: Default preferences object

## Next Steps

1. Replace placeholder credentials in `.env.local`
2. Test Google login on login page
3. Test Google signup on register page
4. Verify user data is correctly stored in database
5. Test that existing Google users can log in again

## Additional Resources

- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [@react-oauth/google Documentation](https://www.npmjs.com/package/@react-oauth/google)
- [Google Cloud Console](https://console.cloud.google.com/)
