import { StrictMode, Suspense, lazy } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router";
import App from "./App.jsx";
import OnboardingPage from "./pages/OnboardingPage.jsx";
import "./styles/index.css";

const MainPage = lazy(() => import("./pages/MainPage"));
const SearchPage = lazy(() => import("./pages/SearchPage"));
const MyPage = lazy(() => import("./pages/MyPage"));
const DetailPage = lazy(() => import("./pages/DetailPage"));
const CategoryPage = lazy(() => import("./pages/CategoryPage"));
const AiRoo = lazy(() => import("./pages/Airoo"));

const router = createBrowserRouter([
  {
    path: "/",
    element: <OnboardingPage />,
  },
  {
    element: <App />,
    children: [
      { path: "home", element: <Suspense><MainPage key="kids" /></Suspense> },
      { path: "junior", element: <Suspense><MainPage key="junior" mode="junior" /></Suspense> },
      { path: "search", element: <Suspense><SearchPage /></Suspense> },
      { path: "mypage", element: <Suspense><MyPage /></Suspense> },
      { path: "movie/:movieId", element: <Suspense><DetailPage /></Suspense> },
      { path: "category", element: <Suspense><CategoryPage /></Suspense> },
      { path: "airon", element: <Suspense><AiRoo /></Suspense> },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
