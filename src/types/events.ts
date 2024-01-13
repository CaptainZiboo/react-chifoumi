export type Events =
  | {
      type: "PLAYER1_JOIN" | "PLAYER2_JOIN";
      matchId: string;
      payload: {
        user: string;
      };
    }
  | {
      type: "NEW_TURN";
      matchId: string;
      payload: {
        turnId: number;
      };
    }
  | {
      type: "TURN_ENDED";
      matchId: string;
      payload: {
        newTurnId: number;
        winner: string;
      };
    }
  | {
      type: "PLAYER1_MOVED" | "PLAYER2_MOVED";
      matchId: string;
      payload: {
        turn: number;
      };
    }
  | {
      type: "MATCH_ENDED";
      matchId: string;
      payload: {
        winner: string;
      };
    };
