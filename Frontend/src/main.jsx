import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import AuthContext from "./context/AuthContext.jsx";
import UserContext from "./context/UserContext.jsx";
import  ConnectionProvider  from "./context/ConnectionContext.jsx";
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthContext>
      <UserContext>
        <ConnectionProvider>
          <App />
        </ConnectionProvider>
      </UserContext>
    </AuthContext>
  </StrictMode>
);
