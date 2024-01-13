import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useMatches } from "@/hooks/use-matches";
import { getMoveName } from "@/lib/move";
import { Match } from "@/types/matches";
import { IMove, MoveSchema } from "@/validation/move";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

interface MatchMoveProps {
  match: Match;
}

export const MatchMove: React.FC<MatchMoveProps> = ({ match }) => {
  const { move } = useMatches();

  const form = useForm<IMove>({
    resolver: zodResolver(MoveSchema),
    defaultValues: {
      move: "paper",
    },
  });

  const onSubmit = async (values: IMove) => {
    const moved = await move(match, values);
    if (moved) {
      form.reset();
    }
  };

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col items-center gap-6 p-10"
        >
          <FormField
            control={form.control}
            name="move"
            render={({ field }) => (
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="flex gap-10"
              >
                <FormItem className="group/test">
                  <FormControl>
                    <RadioGroupItem value="rock" className="peer sr-only" />
                  </FormControl>
                  <FormLabel>
                    <img src="/rock.jpg" alt="Rock" />
                  </FormLabel>
                </FormItem>
                <FormItem>
                  <FormControl>
                    <RadioGroupItem value="paper" className="peer sr-only" />
                  </FormControl>
                  <FormLabel>
                    <img src="/paper.jpg" alt="Paper" />
                  </FormLabel>
                </FormItem>
                <FormItem>
                  <FormControl>
                    <RadioGroupItem value="scissors" className="peer sr-only" />
                  </FormControl>
                  <FormLabel>
                    <img src="/scissors.jpg" alt="Scissors" />
                  </FormLabel>
                </FormItem>
              </RadioGroup>
            )}
          />
          <p>Vous avez sélectionné : {getMoveName(form.watch("move"))}</p>

          <div>
            <Button type="submit">Jouer</Button>
          </div>
        </form>
      </Form>
    </>
  );
};
