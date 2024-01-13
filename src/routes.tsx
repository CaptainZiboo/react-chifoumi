import { Routes, Route } from "react-router-dom";
import { SignIn } from "./app/auth/sign-in";
import { SignUp } from "./app/auth/sign-up";
import { RootLayout } from "./app/layout";
import { Home } from "./app/pages/home";
import { SignOut } from "./app/auth/sign-out";
import { Match } from "./app/pages/match";

export const Router = () => {
  return (
    <Routes>
      {/* Auth Routes */}
      <Route path="/sign-in" element={<SignIn />} />
      <Route path="/sign-up" element={<SignUp />} />
      <Route path="/sign-out" element={<SignOut />} />

      {/* Main Routes */}
      <Route element={<RootLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/match/:id" element={<Match />} />
      </Route>
    </Routes>
  );
};
