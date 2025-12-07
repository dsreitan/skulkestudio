// Type for the injected initial state
declare global {
  interface Window {
    initialState?: {
      user: {
        isAuthenticated: boolean;
        username: string | null;
      };
    };
  }
}

/**
 * Gets the authentication status from the injected initial state.
 * Available immediately on page load, no async needed.
 * The state is set synchronously in the <head> before React renders.
 */
export function getAuthStatus() {
  if (typeof window === "undefined") {
    return { isAuthenticated: false, username: null };
  }
  
  // Ensure initialState exists (it should be set synchronously before React renders)
  // If it doesn't exist yet, return false to prevent flash
  if (!window.initialState) {
    // This shouldn't happen, but fallback to prevent flash
    return { isAuthenticated: false, username: null };
  }
  
  return {
    isAuthenticated: window.initialState.user?.isAuthenticated ?? false,
    username: window.initialState.user?.username ?? null,
  };
}

