import React, { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useApp } from "@/context/AppContext.tsx";
import { toast } from "sonner";

interface AuthGateProps {
  children: React.ReactNode;
}

export default function AuthGate({ children }: AuthGateProps) {
  const { user, isAdminLoggedIn } = useApp();
  const location = useLocation();

  const isAuthenticated = Boolean(user || isAdminLoggedIn);

  useEffect(() => {
    if (!isAuthenticated) {
      toast.info("Please register or login to access Krivexo services and features.");
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return <Navigate to="/register" replace state={{ from: location }} />;
  }

  return <>{children}</>;
}
