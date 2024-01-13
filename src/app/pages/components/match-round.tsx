import { FcCheckmark, FcDislike, FcCollaboration } from "react-icons/fc";
import { useMatches } from "@/hooks/use-matches";
import { Match, Turn } from "@/types/matches";

interface MatchRoundProps {
  match: Match;
  turn: Turn;
  i: number;
}

export const MatchRound: React.FC<MatchRoundProps> = ({ match, turn, i }) => {
  const { getMove, getPosition } = useMatches();

  return (
    <li>
      <div>
        <p>
          <span className="font-semibold">{i + 1}.</span>{" "}
          {getMove(match, { turn })} (vous) contre{" "}
          {getMove(match, { turn, opponent: true })}
        </p>
        <p className="flex items-center gap-1">
          {turn.winner === getPosition(match) && (
            <>
              {" "}
              <FcCheckmark /> Gagnée{" "}
            </>
          )}

          {turn.winner === getPosition(match, { opponent: true }) && (
            <>
              {" "}
              <FcDislike /> Perdue{" "}
            </>
          )}

          {turn.winner === "draw" && (
            <>
              {" "}
              <FcCollaboration /> Egalité{" "}
            </>
          )}
        </p>
      </div>
    </li>
  );
};
