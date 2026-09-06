import { HerculesAuthProvider } from "@usehercules/auth/react";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const authority = import.meta.env.VITE_HERCULES_OIDC_AUTHORITY;
  const clientId = import.meta.env.VITE_HERCULES_OIDC_CLIENT_ID;

  if (!authority || !clientId) {
    return <>{children}</>;
  }

  return (
    <HerculesAuthProvider
      authority={authority}
      client_id={clientId}
      userManagerSettings={{
        prompt: import.meta.env.VITE_HERCULES_OIDC_PROMPT ?? "select_account",
        response_type:
          import.meta.env.VITE_HERCULES_OIDC_RESPONSE_TYPE ?? "code",
        scope:
          import.meta.env.VITE_HERCULES_OIDC_SCOPE ??
          "openid profile email offline_access",
        redirect_uri:
          import.meta.env.VITE_HERCULES_OIDC_REDIRECT_URI ??
          `${window.location.origin}/auth/callback`,
      }}
    >
      {children}
    </HerculesAuthProvider>
  );
}
