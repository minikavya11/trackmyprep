import { Routes, Route } from "react-router-dom";
import {
  SignedIn,
  SignedOut,
  RedirectToSignIn,
} from "@clerk/clerk-react";

import Dashboard from "./pages/Dashboard";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignupPage";
import { Toaster } from "sonner";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";

const App = () => (
  <>
    <Toaster position="top-right" richColors />
  <Routes>
    {/* Public Auth Pages */}
    
    <Route path="/sign-in/*" element={<SignInPage />} />
    <Route path="/sign-up/*" element={<SignUpPage />} />

    {/* Protected Dashboard with auth checks */}
    <Route
      path="/"
      element={
        <>
          <SignedIn>
            <Dashboard />
          </SignedIn>
          <SignedOut>
            <RedirectToSignIn />
          </SignedOut>
        </>
      }
    />
     <Route path="/profile" element={<Profile />} />
      <Route path="/edit-profile" element={<EditProfile />} />
  </Routes>
  
  </>
);

export default App;
