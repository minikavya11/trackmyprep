import React from "react";
import ReactDOM from "react-dom/client";
import { ClerkProvider } from "@clerk/clerk-react";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import './index.css';

const clerkPubKey = "pk_test_Y2FzdWFsLW1vbmFyY2gtMTUuY2xlcmsuYWNjb3VudHMuZGV2JA";

ReactDOM.createRoot(document.getElementById("root")).render(
  <ClerkProvider publishableKey={clerkPubKey}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </ClerkProvider>
);
