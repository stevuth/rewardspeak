'use client';

import { LoginPageContent } from '@/components/auth/login-page-content';

export default function Page() {
  // The root of the application will now always render the login page content.
  // All complex redirection and authentication-checking logic has been removed
  // to eliminate rendering conflicts and 404 errors.
  // Post-login navigation will be handled by the AuthForm component.
  return <LoginPageContent />;
}
