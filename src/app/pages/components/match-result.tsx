import { FcCheckmark, FcDislike, FcCollaboration } from "react-icons/fc";
import { useMatches } from "@/hooks/use-matches";
import { getAuth } from "@/lib/storage";
import { Match } from "@/types/matches";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";

interface MatchResultProps {
  match: Match;
}

export const MatchResult: React.FC<MatchResultProps> = ({ match }) => {
  const { getWinner, getOpponent, createMatch, currentMatch } = useMatches();
  const navigate = useNavigate();

  const onCreateMatch = async () => {
    const created = await createMatch();
    if (created) navigate(`/match/${currentMatch?._id}`);
  };

  return (
    <div className="flex flex-col w-full items-center gap-20">
      <div className="flex flex-col items-center space-y-8">
        {getWinner(match) === getAuth().username && (
          <>
            <FcCheckmark className="w-72 h-72" />
            <p className="font-semibold text-3xl">Vous avez gagné, bravo !</p>
          </>
        )}
        {getWinner(match) === getOpponent(match)?.username && (
          <>
            <FcDislike className="w-72 h-72" />
            <p className="font-semibold text-3xl">
              Vous avez perdu, dommage...
            </p>
          </>
        )}
        {getWinner(match) === "draw" && (
          <>
            <FcCollaboration className="w-72 h-72" />
            <p className="font-semibold text-3xl">
              Egalité, personne n'a gagné...
            </p>
          </>
        )}
      </div>
      <div className="flex items-center gap-4">
        <Button>
          <Link to="/">Retour à l'accueil</Link>
        </Button>

        <Button onClick={onCreateMatch}> Rejouer </Button>
      </div>
    </div>
  );
};
