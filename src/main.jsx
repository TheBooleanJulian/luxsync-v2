import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import PortfolioGallery from "../PhotoGallery.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <PortfolioGallery />
  </StrictMode>
);
