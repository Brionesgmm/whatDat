import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import ErrorPage from "./routes/Error";
import AddCategory from "./components/AddCategory";
import MainScreen from "./components/MainScreen";
import GameScreen from "./components/GameScreen";
import EditCategory from "./components/EditCategory";
import CategoryContext from "./components/CategoryContext";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainScreen />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/add-category",
    element: <AddCategory />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/edit-category",
    element: <EditCategory />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/game",
    element: <GameScreen />,
    errorElement: <ErrorPage />,
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <RouterProvider router={router}>
      <CategoryContext.Provider
        value={{ allCategories: [] }}
      ></CategoryContext.Provider>
    </RouterProvider>
  </React.StrictMode>
);
