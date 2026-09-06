import { ConvexProviderWithHerculesAuth } from "@usehercules/auth/convex-react";
import { ConvexProvider as StandardConvexProvider, ConvexReactClient } from "convex/react";

const convexUrl = import.meta.env.VITE_CONVEX_URL;
const convex = convexUrl ? new ConvexReactClient(convexUrl) : null;

export function ConvexProvider({ children }: { children: React.ReactNode }) {
  const authority = import.meta.env.VITE_HERCULES_OIDC_AUTHORITY;

  if (!convex) {
    return <>{children}</>;
  }

  if (!authority) {
    return (
      <StandardConvexProvider client={convex}>
        {children}
      </StandardConvexProvider>
    );
  }

  return (
    <ConvexProviderWithHerculesAuth client={convex}>
      {children}
    </ConvexProviderWithHerculesAuth>
  );
}
