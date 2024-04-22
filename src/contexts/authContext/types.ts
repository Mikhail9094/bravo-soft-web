import { ReactNode } from "react";

export interface AuthProviderProps {
  children: ReactNode;
}

export interface AuthContextProps {
  isAuth: boolean;
  login(data: any): void; 
  logout(): void;
  changeAuthStatus(status: boolean): void;

}
