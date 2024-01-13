import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Router } from "./routes.tsx";
import "./assets/index.css";
import { Toaster } from "./components/ui/toaster.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <main className="flex w-full h-screen">
        <Router />
      </main>
      <Toaster />
    </BrowserRouter>
  </React.StrictMode>
);
