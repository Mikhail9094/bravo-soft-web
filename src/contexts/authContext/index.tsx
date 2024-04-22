import { createContext, useCallback, useEffect, useState } from "react";
import { AuthContextProps, AuthProviderProps } from "./types";
import { useNavigate } from "react-router";
import { instance } from "../../api/requests";
import { AUTH_USER_ID, TOKEN_LS_KEY } from "../../constants";

export const AuthContext = createContext({} as AuthContextProps);

function AuthProvider({ children }: AuthProviderProps) {
  const [isAuth, setIsAuth] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const signIn = async () => {
      try {
        const token = localStorage.getItem(TOKEN_LS_KEY);
        const userId = localStorage.getItem(AUTH_USER_ID);
        // отправляем запрос чтобы удостовериться верный ли token.
        await instance(`/600/users/${userId}`);

        if (token) {
          navigate("/");
          setIsAuth(true);
        } else {
          setIsAuth(false);
          navigate("/login");
        }
      } catch (error: any) {
        if (error.response) {
          if (error.response.status === 401) {
            setIsAuth(false);
            navigate("/login");
          }
        } else {
          alert(`Ошибка: ${error.message}`);
        }
      }
    };
    signIn();
  }, []);

  const login = (data: any) => {
    localStorage.setItem(TOKEN_LS_KEY, data.accessToken);
    // на проектах конечно в localStorage не добавляеются данные об авторизованном пользователе, 
    // а делается отдельный запрос на сервер, например на "/me" с токеном и уже эти данные используются.
    localStorage.setItem(AUTH_USER_ID, data.user.id);
    navigate("/");
    changeAuthStatus(true);
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_LS_KEY);
    localStorage.removeItem(AUTH_USER_ID);
    navigate("/login");
    changeAuthStatus(false);
  };

  const changeAuthStatus = useCallback((status: boolean) => {
    setIsAuth(status);
  }, []);

  const value = { isAuth, login, logout, changeAuthStatus };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
export default AuthProvider;
