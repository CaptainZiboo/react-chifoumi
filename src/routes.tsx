import { Routes, Route } from "react-router-dom";
import { SignIn } from "./app/auth/sign-in";
import { SignUp } from "./app/auth/sign-up";
import { SignOut } from "./app/auth/sign-out";

export const Router = () => {
  return (
    <Routes>
      {/* Auth Routes */}
      <Route path="/sign-in" element={<SignIn />} />
      <Route path="/sign-up" element={<SignUp />} />
      <Route path="/sign-out" element={<SignOut />} />
    </Routes>
  );
};
