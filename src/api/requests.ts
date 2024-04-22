import axios from "axios";
import { IApplication, IUser } from "../pages/NewOrder/types";
import { BASE_URL, TOKEN_LS_KEY } from "../constants";

const ApiClient = () => {
  const instance = axios.create({
    baseURL: BASE_URL,
    headers: { Authorization: `Bearer ${localStorage.getItem(TOKEN_LS_KEY)}` },
  });

  instance.interceptors.request.use(async (request) => {
    const token = localStorage.getItem("token");
    if (token !== undefined) {
      request.headers.set("Authorization", `Bearer ${token}`);
    }
    return request;
  });

  return instance;
};

export const apiClient = ApiClient();

export const getUsers = async (): Promise<IUser[]> => {
  const res = await apiClient(`/users`, {
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
  const res = await apiClient(`/applications?${query}`);
  return res.data;
};

export const getApplications = async () => {
  const res = await apiClient(`/applications`);
  return res.data;
};

export const createApplication = async (item: IApplication) => {
  await apiClient.post(`/applications`, item);
};
