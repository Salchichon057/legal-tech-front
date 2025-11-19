"use client";

import { useEffect } from "react";
import { Amplify } from "aws-amplify";

export function AmplifyProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const userPoolId = process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID;
    const userPoolClientId = process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID;

    if (userPoolId && userPoolClientId) {
      Amplify.configure({
        Auth: {
          Cognito: {
            userPoolId,
            userPoolClientId,
          },
        },
      });
    }
  }, []);

  return <>{children}</>;
}
