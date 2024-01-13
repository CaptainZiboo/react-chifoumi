import fetcher from "@/lib/fetcher";
import { ILogin } from "@/validation/login";
import { IRegister } from "@/validation/register";

export const requests = {
  register: ({ username, password }: IRegister) => {
    return fetcher.post("/register", {
      username,
      password,
    });
  },

  login: ({ username, password }: ILogin) => {
    return fetcher.post("/login", {
      username,
      password,
    });
  },

  matches: {
    get: (id?: string) => {
      if (id) {
        return fetcher.get(`/matches/${id}`);
      } else {
        return fetcher.get(`/matches`);
      }
    },

    create: () => {
      return fetcher.post(`/matches`);
    },
  },

  match: (id: string) => ({
    turn: (turnId: number) => ({
      move: (move: "rock" | "paper" | "scissors") => {
        return fetcher.post(`/matches/${id}/turns/${turnId}`, {
          move,
        });
      },
    }),
  }),
};
