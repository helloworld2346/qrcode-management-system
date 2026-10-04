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
    addAttribute: (id: string) => `/categories/${id}/attributes`,
    remove: (id: string) => `/categories/${id}`,
  },
  attributes: {
    list: "/attributes",
    create: "/attributes",
    remove: (id: string) => `/attributes/${id}`,
  },
  items: {
    list: "/items",
    create: "/items",
    detail: (id: string) => `/items/${id}`,
    update: (id: string) => `/items/${id}`,
    updateStatus: (id: string) => `/items/${id}/status`,
    remove: (id: string) => `/items/${id}`,
    qr: (id: string) => `/items/${id}/qr`,
    resolve: (code: string) => `/items/resolve/${code}`,
  },
};
