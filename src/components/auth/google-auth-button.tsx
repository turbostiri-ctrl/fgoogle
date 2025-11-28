import * as React from 'react';
import { useGoogleLogin, type CodeResponse } from '@react-oauth/google';
import { Button } from '@/components/ui/button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';

interface GoogleAuthButtonProps {
  onSuccess: (googleId: string, email: string, name: string, picture?: string) => Promise<void>;
  onError?: (error: string) => void;
  mode?: 'login' | 'register';
}

export function GoogleAuthButton({ onSuccess, onError, mode = 'login' }: GoogleAuthButtonProps) {
  const [isLoading, setIsLoading] = React.useState(false);

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (codeResponse: CodeResponse) => {
      try {
        setIsLoading(true);

        // Exchange authorization code for access token and user info
        const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            code: codeResponse.code,
            client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID || '',
            client_secret: import.meta.env.VITE_GOOGLE_CLIENT_SECRET || '',
            redirect_uri: window.location.origin,
            grant_type: 'authorization_code',
          }),
        });

        if (!tokenResponse.ok) {
          throw new Error('Failed to exchange authorization code');
        }

        const tokenData = await tokenResponse.json();

        // Fetch user info from Google
        const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
          headers: {
            Authorization: `Bearer ${tokenData.access_token}`,
          },
        });

        if (!userInfoResponse.ok) {
          throw new Error('Failed to fetch user info');
        }

        const userInfo = await userInfoResponse.json();

        // Call the onSuccess callback with user data
        await onSuccess(
          userInfo.id,
          userInfo.email,
          userInfo.name,
          userInfo.picture
        );
      } catch (error) {
        console.error('Google login error:', error);
        onError?.(error instanceof Error ? error.message : 'Google login failed');
      } finally {
        setIsLoading(false);
      }
    },
    onError: (error) => {
      console.error('Google login error:', error);
      onError?.('Google login failed');
    },
    flow: 'auth-code',
  });

  return (
    <Button
      type="button"
      variant="outline"
      className="w-full"
      onClick={() => handleGoogleLogin()}
      disabled={isLoading}
    >
      <FontAwesomeIcon icon={faGoogle} className="mr-2 h-4 w-4" />
      {isLoading ? 'Connecting...' : mode === 'login' ? 'Sign in with Google' : 'Sign up with Google'}
    </Button>
  );
}
