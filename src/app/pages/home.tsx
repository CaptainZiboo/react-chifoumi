import { Button } from "@/components/ui/button";
import { useMatches } from "@/hooks/use-matches";
import { useNavigate } from "react-router-dom";
import { MatchCard } from "./components/match-card";
import { useMemo } from "react";

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const { matches, createMatch, getWinner } = useMatches();

  const match = useMemo(() => {
    return matches.find((m) => !getWinner(m));
  }, [matches, getWinner]);

  const onCreateMatch = async () => {
    await createMatch();
    if (match) navigate(`/match/${match?._id}`);
  };

  return (
    <>
      <div className="p-6">
        <div className="w-full flex justify-between">
          <h1 className="font-semibold text-xl">Liste des matchs</h1>
          <Button onClick={onCreateMatch}>
            {" "}
            {match ? "Rejoindre le match en cours" : "Créér un match"}{" "}
          </Button>
        </div>
        <div className="p-10">
          {matches && (
            <ul className="flex flex-wrap gap-8">
              {matches.map((m, i) => (
                <MatchCard key={i} match={m} />
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
};
