import { create } from "zustand";

const useAuthStore = create((set) => ({
  user: null,
  token: null,

  //  garder ton ancien comportement
  setUser: (user) =>
    set({
      user,
      token: user.token || null, // au cas où ton backend renvoie token
    }),

  logout: () =>
    set({
      user: null,
      token: null,
    }),
}));

export default useAuthStore;