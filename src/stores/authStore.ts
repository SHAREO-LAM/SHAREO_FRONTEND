import { defineStore } from 'pinia';

type UserRole = 'guest' | 'user' | 'vendor' | 'admin';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    isLoggedIn: false,
    userRole: 'guest' as UserRole,
    userInfo: null as null | { id: number; firstName: string; lastName: string; email: string },
  }),
  actions: {
    login(role: UserRole = 'user', info: any = null) {
      this.isLoggedIn = true;
      this.userRole = role;
      this.userInfo = info;
    },
    logout() {
      this.isLoggedIn = false;
      this.userRole = 'guest';
      this.userInfo = null;
    },
  },
});
