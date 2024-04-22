import { useContext } from "react";
import styles from "./mainLayout.module.scss";
import { Link, Outlet } from "react-router-dom";
import { AuthContext } from "../../contexts/authContext";

function MainLayout() {
  const { logout } = useContext(AuthContext);

  return (
    <div className={styles.wrapper}>
      <header className={styles.header}>
        <button onClick={logout} className={styles.exit}>
          Выход
        </button>
      </header>
      <main className={styles.main}>
        <Outlet />
      </main>
      <nav className={styles.nav}>
        <div className={styles.links}>
          <Link to="/new-order" className={styles.links__item}>
            Форма для заявки
          </Link>
          <Link to="/orders" className={styles.links__item}>
            Сводная таблица
          </Link>
        </div>
      </nav>
    </div>
  );
}

export default MainLayout;
