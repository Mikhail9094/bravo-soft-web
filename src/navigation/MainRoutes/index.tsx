import { useContext } from "react";
import {  Route, Routes } from "react-router-dom";
import { AuthContext  } from "../../contexts/authContext";
import { privateRoutes, publicRoutes } from "../routes";

function MainRoutes() {
  const { isAuth } = useContext(AuthContext );
  return (
    <Routes>
      {!isAuth &&
        publicRoutes.map((route) => (
          <Route path={route.path} element={route.element} key={route.path} />
        ))}

      {isAuth && (
        <Route path={privateRoutes.path} element={privateRoutes.element}>
          <Route index element={privateRoutes.indexElement} />
          {privateRoutes.children.map((route) => (
            <Route path={route.path} element={route.element} key={route.path} />
          ))}
        </Route>
      )}
    </Routes>
  );
}

export default MainRoutes;
