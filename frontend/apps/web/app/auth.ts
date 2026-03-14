declare global {
  interface Window {
    initialState?: {
      user: {
        isAuthenticated: boolean;
        username: string | null;
      };
      sections: Array<{ id: string; title: string }>;
    };
  }
}

const defaults = {
  isAuthenticated: false,
  username: null as string | null,
  sections: [] as Array<{ id: string; title: string }>,
};

export function getInitialState() {
  if (typeof window === "undefined" || !window.initialState) {
    return defaults;
  }

  return {
    isAuthenticated: window.initialState.user?.isAuthenticated ?? false,
    username: window.initialState.user?.username ?? null,
    sections: window.initialState.sections ?? [],
  };
}
