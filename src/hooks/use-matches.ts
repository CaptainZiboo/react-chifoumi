import { MatchesContext } from "@/context/matches";
import { useContext } from "react";

export const useMatches = () => {
  const state = useContext(MatchesContext);

  if (!state) {
    throw new Error("useMatches must be used within a MatchesProvider");
  }

  return { ...state };
};
