import React, {
  createContext,
  useReducer,
  useEffect,
  useState,
  useCallback,
  useRef,
  useMemo,
} from "react";
import { Match, Move, Player, Turn } from "@/types/matches";
import { requests } from "../lib/requests";
import { toast } from "@/components/ui/use-toast";
import { useNavigate, useParams } from "react-router-dom";
import { getAuth } from "@/lib/storage";
import {
  fetchEventSource,
  EventSourceMessage,
} from "@microsoft/fetch-event-source";
import { Events } from "@/types/events";

// Matches context interface
interface MatchesState {
  matches: Match[];
}

type MatchesAction =
  | { type: "CREATE_MATCH"; payload: Match }
  | { type: "UPDATE_MATCH"; payload: Match }
  | { type: "SET_MATCHES"; payload: Match[] }
  | {
      type: "TURN_ENDED";
      payload: {
        matchId: string;
        newTurnId: number;
        winner: string;
      };
    }
  | { type: "MATCH_ENDED"; payload: { matchId: string; winner: string } };

const matchesReducer = (
  state: MatchesState,
  action: MatchesAction
): MatchesState => {
  switch (action.type) {
    case "SET_MATCHES":
      return {
        ...state,
        matches: action.payload,
      };
    case "CREATE_MATCH":
      return {
        ...state,
        matches: [...state.matches, action.payload],
      };
    case "UPDATE_MATCH":
      return {
        ...state,
        matches: state.matches.map((match) => {
          if (match._id === action.payload._id) {
            return action.payload;
          }
          return match;
        }),
      };
    default:
      return state;
  }
};

const initialState: MatchesState = {
  matches: [],
};

interface IMatchesContext extends MatchesState {
  currentTurn?: Turn;
  createMatch: () => Promise<boolean>;
  getPosition: (
    match: Match,
    options?: { opponent?: boolean }
  ) => "user1" | "user2" | null;
  getOpponent: (match: Match) => Player | null;
  move: (match: Match, { move }: { move: Move }) => Promise<boolean>;
  getMove: (
    match: Match,
    options?: { opponent?: boolean; turn?: Turn }
  ) => string | null;
  loading: boolean;
  isMoving: boolean;
  getWinner: (match: Match) => string | null;
  wonTurn: (match: Match, turn: Turn) => boolean;
}

const MatchesContext = createContext<IMatchesContext>({
  ...initialState,
  createMatch: async () => false,
  getPosition: () => null,
  getOpponent: () => null,
  move: async () => false,
  getMove: () => null,
  getWinner: () => null,
  wonTurn: () => false,
  loading: false,
  isMoving: false,
});

// Définir le reducer pour gérer les actions
interface MatchesProviderProps {
  children: React.ReactNode;
}

// Créer le provider pour le contexte
const MatchesProvider: React.FC<MatchesProviderProps> = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [state, dispatch] = useReducer(matchesReducer, {
    matches: [],
  });
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  // SSE stream
  const sse = useRef<{
    controller: AbortController;
    _id: string;
  } | null>(null);

  const getWinner = useCallback((match: Match): string | null => {
    if ("winner" in match) return match.winner?.username || "draw";
    return null;
  }, []);

  const currentTurn: Turn | undefined = useMemo(() => {
    if (!id) return;
    const match = state.matches.find((match) => match._id === id);
    if (!match) return;
    const turn = match.turns[match.turns.length - 1];
    if (!turn) return;
    if (!turn.winner) return turn;
    return;
  }, [id, state.matches]);

  const getMatch = useCallback(
    async (id: string) => {
      try {
        const match = await requests.matches.get(id);
        dispatch({ type: "UPDATE_MATCH", payload: match });
        return match;
      } catch (error: any) {
        if (error.response?.status === 401) {
          navigate("/sign-out");
        }
        toast({
          title: "Impossible de récupérer le match !",
          description: "Une erreur inconnue est survenue...",
          variant: "destructive",
        });
      }
    },
    [navigate]
  );

  const getPosition = (
    match: Match,
    options?: { opponent?: boolean }
  ): "user1" | "user2" | null => {
    const { username } = getAuth();

    if (match.user1.username === username && !options?.opponent) {
      return "user1";
    }

    if (match.user2?.username === username && !options?.opponent) {
      return "user2";
    }

    if (match.user1.username === username && options?.opponent) {
      return "user2";
    }

    if (match.user2?.username === username && options?.opponent) {
      return "user1";
    }

    return null;
  };

  const createMatch = async () => {
    try {
      setLoading(true);
      const response = await requests.matches.create();

      dispatch({ type: "CREATE_MATCH", payload: response.match });

      return true;
    } catch (error: any) {
      const { response, data } = error;

      if (response?.status === 401) {
        toast({
          title: "Votre session a expiré !",
          description: "Redirection vers la page de connexion...",
          variant: "destructive",
        });
        navigate("/sign-out");
      }

      if (data?.match) {
        toast({
          title: "Vous participez déjà à un match.",
          description: "Redirection vers le match en cours...",
          variant: "destructive",
        });

        // Return current match
        return true;
      }

      // Handling request error
      switch (response?.status) {
        default:
          toast({
            title: "Impossible de rejoindre un match !",
            description: "Une erreur inconnue est survenue...",
            variant: "destructive",
          });
          return false;
      }
    } finally {
      setLoading(false);
    }
  };

  const move = async (match: Match, { move }: { move: Move }) => {
    try {
      await requests
        .match(match._id)
        .turn(
          match.turns.findIndex((t) => !t.winner) + 1 || match.turns.length + 1
        )
        .move(move);
      return true;
      await getMatch(match._id);
    } catch (error) {
      toast({
        title: "Impossible de jouer le coup !",
        description: "Une erreur inconnue est survenue...",
        variant: "destructive",
      });
      return false;
    }
  };

  const getMove = (
    match: Match,
    options?: { opponent?: boolean; turn?: Turn }
  ) => {
    const position = getPosition(match, { opponent: options?.opponent });

    const turn = options?.turn ? options.turn : currentTurn;

    if (!position) return null;

    const value: Move | "?" | undefined = turn?.[position];

    switch (value) {
      case "rock":
        return "Pierre";
      case "paper":
        return "Feuille";
      case "scissors":
        return "Ciseaux";
      default:
        return null;
    }
  };

  const wonTurn = useCallback((match: Match, turn: Turn) => {
    const position = getPosition(match);
    if (!position) return false;
    return turn?.winner === position;
  }, []);

  const getOpponent = useCallback((match: Match): Player | null => {
    if (!match.user2) return null;
    const position = getPosition(match, { opponent: true });
    if (!position) return null;
    return match[position];
  }, []);

  // Register SSE events for current match
  useEffect(() => {
    (async () => {
      // On a essayé, mais franchement... Je comprends pas, ca ne fonctionne pas
      if (id && id !== sse.current?._id) {
        sse.current?.controller?.abort();

        // Create new sse stream with a switch on message
        sse.current = {
          controller: new AbortController(),
          _id: id,
        };

        try {
          await fetchEventSource(
            `${import.meta.env.VITE_BACKEND_URL}/matches/${id}/subscribe`,
            {
              headers: {
                Authorization: `Bearer ${getAuth()?.token}`,
              },
              signal: sse.current.controller.signal,

              async onmessage(ev: EventSourceMessage) {
                const match = await getMatch(id);

                const data: Events[] = JSON.parse(ev.data);
                const event: Events = data[data.length - 1];

                if (!event) return;

                switch (event.type) {
                  case "PLAYER1_JOIN":
                    if (getPosition(match) === "user1") return;
                    toast({
                      title: "Un joueur a rejoint le match !",
                      description: `Votre adversaire est ${event.payload.user}.`,
                    });
                    break;
                  case "PLAYER2_JOIN":
                    if (getPosition(match) === "user2") return;
                    toast({
                      title: "Un joueur a rejoint le match !",
                      description: `Votre adversaire est ${event.payload.user}.`,
                    });
                    break;
                  case "TURN_ENDED":
                    toast({
                      description: `Vous avez ${
                        event.payload.winner === getPosition(match)
                          ? "gagné"
                          : "perdu"
                      } la manche ${event.payload.newTurnId - 1} !`,
                    });
                    break;
                  case "PLAYER1_MOVED":
                    if (getPosition(match) === "user1") return;
                    toast({
                      title: "Votre adversaire a joué !",
                    });
                    break;
                  case "PLAYER2_MOVED":
                    if (getPosition(match) === "user2") return;
                    toast({
                      title: "Votre adversaire a joué !",
                    });
                    break;
                  case "NEW_TURN":
                    toast({
                      title: "Une nouvelle manche a commencé !",
                    });
                    break;
                  case "MATCH_ENDED":
                    dispatch({
                      type: "MATCH_ENDED",
                      payload: {
                        matchId: event.matchId,
                        winner: event.payload.winner,
                      },
                    });
                    break;
                  default:
                    break;
                }
              },
            }
          );
        } catch (error) {
          toast({
            title: "Impossible de se connecter au serveur !",
            description: "Une erreur inconnue est survenue...",
            variant: "destructive",
          });
        }
      } else {
        // Close sse stream
        sse.current?.controller.abort();
        sse.current = null;
      }
    })();

    return () => {
      sse.current?.controller.abort();
      sse.current = null;
    };
  }, [id, getMatch]);

  // Load matches on component mount
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const response = await requests.matches.get();

        dispatch({ type: "SET_MATCHES", payload: response });
      } catch (error: any) {
        const { response } = error;

        // Handling request error
        switch (response?.status) {
          case 401:
            toast({
              title: "Votre session a expiré !",
              description: "Redirection vers la page de connexion...",
              variant: "destructive",
            });
            navigate("/sign-out");
            break;
          default:
            toast({
              title: "Impossible de récupérer les matches !",
              description: "Une erreur inconnue est survenue...",
              variant: "destructive",
            });
            throw error;
        }
      } finally {
        setLoading(false);
      }
    })();
  }, [navigate]);

  const isMoving = useMemo(() => {
    if (!id) return false;
    const match = state.matches.find((match) => match._id === id);
    if (!match) return false;
    if (match.turns.length === 0) return true;
    const turn = match.turns[match.turns.length - 1];
    if (turn.winner) return true;
    const position = getPosition(match);
    if (!position) return false;
    if (!turn[position]) return true;
    return false;
  }, [id, state.matches]);

  return (
    <MatchesContext.Provider
      value={{
        ...state,
        getWinner,
        currentTurn,
        createMatch,
        getPosition,
        getOpponent,
        loading,
        isMoving,
        move,
        getMove,
        wonTurn,
      }}
    >
      {loading && "Loading..."}
      {!loading && children}
    </MatchesContext.Provider>
  );
};

export { MatchesContext, MatchesProvider };
