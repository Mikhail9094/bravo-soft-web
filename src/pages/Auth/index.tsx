import styles from "./authPage.module.scss";
import { useContext, useState } from "react";
import { ICredentials } from "./types";
import { instance } from "../../api/requests";
import { AuthContext } from "../../contexts/authContext";

function AuthPage() {
  const [credentials, setCredentials] = useState<ICredentials>({ email: "", password: "" });
  const { login } = useContext(AuthContext);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await instance.post("/login", credentials);
      login(response.data);
    } catch (error: any) {
      if (error.response) {
        if (error.response.status === 400) {
          setError("Логин или пароль введены неверно ");
        } else {
          setError("Ошибка: " + error.message);
        }
      } else {
        setError("Ошибка: " + error.message);
      }
    }
  };

  return (
    <div className={styles.auth}>
      <h1>Авторизация</h1>
      <h3>Введите свои учётные данные для входа в систему.</h3>
      <form onSubmit={handleSubmit}>
        <label htmlFor="email">Email:</label>
        <input
          id="email"
          name="email"
          type="email"
          value={credentials.email}
          onChange={(e) => setCredentials((prev) => ({ ...prev, email: e.target.value }))}
          placeholder="Введите email"
          required
        />

        <label htmlFor="password">Password:</label>
        <input
          id="password"
          name="password"
          type="password"
          value={credentials.password}
          onChange={(e) => setCredentials((prev) => ({ ...prev, password: e.target.value }))}
          placeholder="Введите пароль"
          required
        />
        {error && <p className={styles.auth__error}>{error}</p>}
        <button type="submit" className={styles.button}>
          Войти
        </button>
      </form>
    </div>
  );
}

export default AuthPage;
