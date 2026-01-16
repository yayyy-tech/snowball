import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import type { User } from "@shared/schema";
import { getQueryFn } from "@/lib/queryClient";
import { analytics, EVENTS } from "@/lib/mixpanel";
import { skipBeforeUnloadWarning } from "@/components/ExitIntentModal";

export function useAuth() {
  const { data: user, isLoading } = useQuery<User>({
    queryKey: ["/api/auth/user"],
    queryFn: getQueryFn<User>({ on401: "returnNull" }),
    retry: false,
  });

  useEffect(() => {
    if (user) {
      analytics.identify(user.id, {
        $email: user.email,
        $first_name: user.firstName,
        $last_name: user.lastName,
      });
      analytics.track(EVENTS.USER_LOGGED_IN, {
        method: 'google',
      });
    }
  }, [user?.id]);

  const login = () => {
    skipBeforeUnloadWarning();
    window.location.href = '/auth/google';
  };

  const logout = () => {
    skipBeforeUnloadWarning();
    analytics.track(EVENTS.USER_LOGGED_OUT);
    analytics.reset();
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
