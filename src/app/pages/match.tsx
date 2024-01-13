import { useMatches } from "@/hooks/use-matches";
import { Navigate, useParams } from "react-router-dom";
import { MatchMove } from "./components/match-move";
import { useMemo } from "react";
import { toast } from "@/components/ui/use-toast";

import { MatchResult } from "./components/match-result";
import { MatchRound } from "./components/match-round";

export const Match: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const {
    isMoving,
    matches,
    currentTurn,
    getOpponent,
    getMove,
    getPosition,
    getWinner,
  } = useMatches();

  const match = useMemo(() => {
    return matches.find((match) => match._id === id);
  }, [matches, id]);

  if (!match) {
    toast({
      title: "Erreur",
      description: "Ce match n'existe pas.",
      variant: "destructive",
    });
    return <Navigate to={"/"} />;
  }

  if (!match.user2) {
    return (
      <div className="flex grow">
        <div className="grow flex items-center justify-center">
          En attente d'un adversaire...
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex grow">
        <div className="grow flex items-center">
          {!getWinner(match) && (
            <>
              <div className="p-10 flex flex-col items-center justify-center w-full gap-6">
                <div className="flex flex-col items-center">
                  <h1 className="text-2xl font-bold uppercase tracking-wide">
                    Partie en cours
                  </h1>
                  <h3>Vous jouez contre {getOpponent(match)?.username}</h3>
                </div>
                {isMoving && (
                  <>
                    <MatchMove match={match} />
                    {(currentTurn?.user1 || currentTurn?.user2) && (
                      <div>Votre adversaire a joué... A votre tour !</div>
                    )}
                  </>
                )}
                {!isMoving && (
                  <>
                    <p>Vous avez joué : {getMove(match)}</p>
                    <p>En attente du choix de l'adversaire...</p>
                  </>
                )}
              </div>
            </>
          )}
          {getWinner(match) && <MatchResult match={match} />}
        </div>
        <div className="bg-gray-50 h-full p-6 w-96 flex-none space-y-6 rounded-3xl">
          <div className="flex flex-col items-center gap-4">
            <p className="uppercase text-lg font-semibold"> Score </p>
            <div className="flex flex-col items-center">
              <p>
                {" "}
                Vous :{" "}
                {
                  match.turns.filter((t) => t.winner === getPosition(match))
                    .length
                }
              </p>
              <p>
                {getOpponent(match)?.username} :{" "}
                {
                  match.turns.filter(
                    (t) => t.winner === getPosition(match, { opponent: true })
                  ).length
                }
              </p>
            </div>
          </div>
          <div className="flex flex-col items-center gap-4">
            <p className="uppercase text-lg font-semibold"> Manches </p>
            <ul className="space-y-3">
              {match.turns
                .filter((t) => t.winner)
                .map((turn, i) => (
                  <MatchRound match={match} turn={turn} i={i} />
                ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};
