export const endpoints = {
  auth: {
    login: "/auth/login",
    logout: "/auth/logout",
    refresh: "/auth/refresh",
    introspect: "/auth/introspect",
    changePassword: "/auth/change-password",
  },
  categories: {
    list: "/categories",
    create: "/categories",
    detail: (id: string) => `/categories/${id}`,
    remove: (id: string) => `/categories/${id}`,
    addAttribute: (id: string) => `/categories/${id}/attributes`,
  },
};
