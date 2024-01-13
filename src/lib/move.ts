import { Move } from "@/types/matches";

export const getMoveName = (move: Move): string => {
  switch (move) {
    case "rock":
      return "Pierre";
    case "paper":
      return "Papier";
    case "scissors":
      return "Sciseaux";
  }
};
