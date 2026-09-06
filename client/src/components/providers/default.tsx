import { AuthProvider } from "./auth.tsx";
import { ConvexProvider } from "./convex.tsx";
import { QueryClientProvider } from "./query-client.tsx";
import { Toaster } from "../ui/sonner.tsx";
import { TooltipProvider } from "../ui/tooltip.tsx";
import { AppProvider } from "@/context/AppContext.tsx";

export function DefaultProviders({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ConvexProvider>
        <QueryClientProvider>
          <TooltipProvider>
            <AppProvider>
              <Toaster />
              {children}
            </AppProvider>
          </TooltipProvider>
        </QueryClientProvider>
      </ConvexProvider>
    </AuthProvider>
  );
}
