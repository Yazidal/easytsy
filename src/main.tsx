// Update your router configuration
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import App from "./App.tsx";
import { AddProductPage } from "./components/pages/add-product.tsx"; // Create this component
import CategoryPage from "./components/pages/category.tsx";
import Home from "./components/pages/Home.tsx";
import DashboardPage from "./components/pages/products.tsx";
import "./index.css";
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<App />}>
          <Route index element={<Home />} />
          <Route path="products">
            <Route index element={<DashboardPage />} />
            <Route path="add" element={<AddProductPage />} />
          </Route>
          <Route path="adminsettings">
            <Route path="categories" element={<CategoryPage />} />
            <Route path="shipping" element={<CategoryPage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
