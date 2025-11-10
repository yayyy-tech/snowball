import { useQuery } from "@tanstack/react-query";
import type { User } from "@shared/schema";
import { getQueryFn } from "@/lib/queryClient";

export function useAuth() {
  const { data: user, isLoading } = useQuery<User>({
    queryKey: ["/api/auth/user"],
    queryFn: getQueryFn<User>({ on401: "returnNull" }),
    retry: false,
  });

  const login = () => {
    window.location.href = '/auth/google';
  };

  const logout = () => {
    window.location.href = '/auth/logout';
  };

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
  };
}
