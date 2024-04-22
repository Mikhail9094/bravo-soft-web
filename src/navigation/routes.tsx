import MainLayout from "../Components/MainLayout";
import AuthPage from "../pages/Auth";
import InfoAboutOrdersPage from "../pages/InfoAboutOrders";
import MainPage from "../pages/Main";
import NewOrderPage from "../pages/NewOrder";

export const publicRoutes = [{ path: "/login", element: <AuthPage /> }];

export const privateRoutes = {
  path: "/",
  element: <MainLayout />,
  indexElement: <MainPage />,
  children: [
    { path: "/new-order", element: <NewOrderPage /> },
    { path: "/orders", element: <InfoAboutOrdersPage /> },
  ],
};
