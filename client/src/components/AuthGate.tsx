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
      toast.info("Please login or register to explore and use Krivexa platform features.");
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <>{children}</>;
}
