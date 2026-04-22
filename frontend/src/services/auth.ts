import { User } from "../types";

export const saveAuth = (token: string, user: User): void => {
  localStorage.setItem("bb_token", token);
  localStorage.setItem("bb_user", JSON.stringify(user));
};

export const clearAuth = (): void => {
  localStorage.removeItem("bb_token");
  localStorage.removeItem("bb_user");
};

export const getCurrentUser = (): User | null => {
  const raw = localStorage.getItem("bb_user");
  if (!raw) return null;
  return JSON.parse(raw) as User;
};

export const getToken = (): string | null => localStorage.getItem("bb_token");
