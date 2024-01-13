export type Move = "rock" | "paper" | "scissors";

export interface Player {
  _id: string;
  username: string;
}

export interface Turn {
  user1?: Move | "?";
  user2?: Move | "?";
  winner?: string;
}

export interface Match {
  user1: Player;
  user2: Player | null;
  turns: Turn[];
  winner?: Player;
  _id: string;
}
