import axios from "axios";
import { IApplication, IUser } from "../pages/NewOrder/types";
import { BASE_URL } from "../constants";

export const instance = axios.create({
  baseURL: BASE_URL,
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
});

export const getUsers = async (): Promise<IUser[]> => {
  const res = await instance(`/users`, {
    // Не срабатывает "_select: "-password" " - который должен исключить поле из ответа сервера.
    // В реальности конечно сервер настроен так что такие данные как пароль не отправляются сервером.
    // поэтому использовал функцию трансформации у axios, для получения данных без поля "password".
    params: {
      _select: "-password",
    },
    transformResponse: [
      function (data) {
        return JSON.parse(data).map((user: IUser & { password: string }) => {
          return {
            email: user.email,
            name: user.name,
            id: user.id,
          };
        });
      },
    ],
  });
  return res.data;
};

export const findRepeatedApplications = async (query: string) => {
  const res = await instance(`/applications?${query}`);
  return res.data;
};

export const getApplications = async () => {
  const res = await instance(`/applications`);
  return res.data;
};

export const createApplication = async (item: IApplication) => {
  await instance.post(`/applications`, item);
};
