import { jwtDecode } from "jwt-decode";

interface ErrorData {
  msg: string;
  data: any;
  status: string;
}

export type TUser = {
  id: number | null;
  email: string | null;
  name: string | null;
};

interface DecodedToken {
  exp: number;
}

import { defineStore } from "pinia";

export const useMyAuthStore = defineStore("myAuthStore", {
  state: () => ({
    token: "",
    user: null as TUser | null,
    error: false,
    error_data: null as ErrorData | null,
  }),
  persist: true,
  getters: {
    isTokenExpired: (state) => {
      if (!state.token) return true;

      const currTime = Date.now() / 1000;

      const decodedToken = jwtDecode<DecodedToken>(state.token);

      return decodedToken.exp < currTime;
    },
  },
  actions: {
    async clearToken() {
      this.token = "";
    },
  },
});
