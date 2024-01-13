import { Button } from "@/components/ui/button";
import { useMatches } from "@/hooks/use-matches";
import { Match } from "@/types/matches";
import { FcCheckmark, FcClock } from "react-icons/fc";
import { Link } from "react-router-dom";

interface MatchCardProps {
  match: Match;
}

export const MatchCard: React.FC<MatchCardProps> = ({ match }) => {
  const { getWinner, getOpponent } = useMatches();

  return (
    <li className="bg-gray-50 p-6 rounded-2xl space-y-4">
      {" "}
      <div>
        <p>
          {" "}
          Match contre{" "}
          {getOpponent(match)?.username ? (
            <span className="font-semibold">
              {getOpponent(match)?.username}
            </span>
          ) : (
            "... (en attente d'un adversaire)"
          )}
        </p>
        <div>
          <p className="flex items-center gap-1">
            {getWinner(match) ? (
              <>
                <FcCheckmark /> Match terminé
              </>
            ) : (
              <>
                <FcClock /> Match en cours
              </>
            )}{" "}
          </p>
        </div>
      </div>
      <div>
        <Button>
          <Link to={`/match/${match._id}`}>Voir le match</Link>
        </Button>
      </div>
    </li>
  );
};
