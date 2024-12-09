export interface IAuthContextType {
  user: { name: string; isAuthenticated: boolean } | null;
  login: (userName: string, password: string) => void;
  logout: () => void;
  // isAuthenticated: boolean;
}
