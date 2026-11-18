import React from 'react';
import { ClerkProvider, SignedIn, SignedOut, SignIn, SignUp } from '@clerk/clerk-react';

export default function ClerkWrapper({ children }) {
  const publishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

  if (!publishableKey) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 p-6 text-center">
        <div className="max-w-lg rounded-2xl border border-amber-200 bg-white p-6 shadow-sm">
          <h1 className="text-lg font-bold text-slate-900">Authentication is not configured</h1>
          <p className="mt-2 text-sm text-slate-600">
            Set VITE_CLERK_PUBLISHABLE_KEY in your local environment file, then restart the app.
          </p>
        </div>
      </div>
    );
  }

  return (
    <ClerkProvider publishableKey={publishableKey}>
      <SignedIn>{children}</SignedIn>
      <SignedOut>
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
          <h2 className="text-xl font-semibold mb-4">Sign in to continue</h2>
          <div className="flex flex-col gap-4 w-full max-w-sm">
            <SignIn />
            <SignUp />
          </div>
        </div>
      </SignedOut>
    </ClerkProvider>
  );
}
