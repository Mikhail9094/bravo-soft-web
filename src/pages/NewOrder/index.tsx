import React, { useContext, useEffect, useState } from "react";
import { createApplication, findRepeatedApplications, getUsers } from "../../api/requests";
import { IApplication, IUser } from "./types";
import styles from "./buyPage.module.scss";
import Loading from "../../Components/Loading";
import { useNavigate } from "react-router";
import { AuthContext } from "../../contexts/authContext";
import { AUTH_USER_ID } from "../../constants";

function NewOrderPage() {
  const [users, setUsers] = useState<IUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [info, setInfo] = useState({ successful: "", needsFixed: "", error: "" });
  const { changeAuthStatus } = useContext(AuthContext);
  const [application, setApplication] = useState<IApplication>({
    customerId: Number(localStorage.getItem(AUTH_USER_ID)),
    document: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    const loadUsers = async () => {
      try {
        setIsLoading(true);
        const data = await getUsers();
        setUsers(data);
        setIsLoading(false);
      } catch (error: any) {
        setIsLoading(false);
        if (error.response) {
          if (error.response.status === 401) {
            navigate("/login");
            changeAuthStatus(false);
          } else {
            setInfo((prev) => ({
              ...prev,
              error: `Ошибка: ${error.message}`,
            }));
          }
        } else {
          alert("Ошибка: " + error.message);
        }
      }
    };

    loadUsers();
  }, [changeAuthStatus]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setInfo((prev) => ({ ...prev, successful: "" }));
    const query = `customerId=${application.customerId}&document=${application.document}`;
    try {
      const arrDuplicate = await findRepeatedApplications(query);

      if (arrDuplicate.length) {
        setInfo((prev) => ({
          ...prev,
          needsFixed: "Вы уже отправляли заявку на этот документ, она уже была учтена",
        }));
        return;
      }

      if (application.document === "" || application.customerId === 0) {
        setInfo((prev) => ({ ...prev, needsFixed: "Необходимо заполнить все поля" }));
        return;
      }

      await createApplication(application);
      setInfo((prev) => ({ ...prev, successful: "Спасибо! Ваша заявка принята." }));
    } catch (error: any) {
      if (error.response) {
        if (error.response.status === 401) {
          navigate("/login");
          changeAuthStatus(false);
        } else {
          setInfo((prev) => ({
            ...prev,
            error: `Ошибка: ${error.message}`,
          }));
        }
      } else {
        alert("Ошибка: " + error.message);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setApplication({ ...application, [name]: value });
    setInfo((prev) => ({ ...prev, successful: "", needsFixed: "", error: "" }));
  };

  return (
    <>
      {!isLoading ? (
        <div className={styles.auth}>
          <form onSubmit={handleSubmit}>
            <label htmlFor="name">Конструктора:</label>
            {/* Из условия задачи не совсем понял: 
                список сотрудников доступен, если не делать страницу авторизации 
                или в обеих случаях пользователям досупен выбор из всех. Как бы они все админы и могут за других отправлять заявки.
                Поэтому реализовал что список доступен авторизованным пользователя. А вообще логичнее для авторизованных не делать выбор из сотрудников. 
                А оставить только заполнение имени докумпента и отправка уже заявки с данными авторизованного пользователя.
           */}
            <select
              id="name"
              name="customerId"
              value={Number(application?.customerId)}
              onChange={handleChange}
              className={styles.auth__list}
            >
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
            </select>

            <label htmlFor="document">Наименование документа:</label>
            <input
              id="document"
              name="document"
              type="text"
              value={application.document}
              onChange={handleChange}
            />
            {(info.needsFixed || info.error) && (
              <p className={styles.auth__message}>{info.needsFixed || info.error}</p>
            )}
            {info.successful && (
              <p className={styles.auth__message} style={{ color: "green" }}>
                {info.successful}
              </p>
            )}
            <button type="submit" className={styles.auth__button}>
              Отправить заявку
            </button>
          </form>
        </div>
      ) : (
        <Loading />
      )}
    </>
  );
}

export default NewOrderPage;
