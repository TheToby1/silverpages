import * as React from "react";
import * as ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import './index.css'
import 'bootstrap/dist/css/bootstrap.min.css';

import Layout from "./components/Layout.tsx";
import ErrorPage from "./pages/ErrorPage.tsx";
import Home from "./pages/Home.tsx"
import Books from "./pages/library/Books.tsx";
import { Book } from "./pages/library/Book.tsx";
import Login from "./pages/auth/Login.tsx"
import Register from "./pages/auth/Register.tsx"
import { Shelf } from "./pages/library/Shelf.tsx";
import Shelves from "./pages/library/Shelves.tsx";
import { MyAccount } from "./pages/auth/MyAccount.tsx";
import { BookItem } from "./pages/library/BookItem.tsx";
import OpenLibraryBooks from "./pages/library/OpenLibrary.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: (<Layout >
      <ErrorPage />
    </Layout>),
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "books",
        element: <Books />,
      },
      {
        path: "book/:bookId",
        element: <Book />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },
      {
        path: "shelves",
        element: <Shelves />,
      },
      {
        path: "shelf/:shelfName",
        element: <Shelf />,
      },
      {
        path: "account",
        element: <MyAccount />,
      },
      {
        path: "bookItem/:bookId",
        element: <BookItem />,
      },
      {
        path: "openlibrary",
          element: <OpenLibraryBooks />,
      }
    ],
  },
]);


ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);