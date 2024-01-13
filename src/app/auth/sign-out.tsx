import { useEffect } from "react";
import { Navigate } from "react-router-dom";

export const SignOut = () => {
  useEffect(() => {
    localStorage.removeItem("token");
  }, []);

  return <Navigate to={"/sign-in"} />;
};
