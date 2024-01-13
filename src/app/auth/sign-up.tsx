import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { requests } from "@/lib/requests";
import { IRegister, RegisterSchema } from "@/validation/register";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";

export const SignUp = () => {
  const navigate = useNavigate();

  const form = useForm<IRegister>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (values: IRegister) => {
    try {
      await requests.register(values);
      const response = await requests.login(values);

      // Save token in localStorage
      localStorage.setItem(
        "auth",
        JSON.stringify({
          token: response.token,

          username: values.username,
        })
      );

      toast({
        title: "Connexion réussie",
        description: `Vous êtes maintenant connecté en tant que ${values.username}.`,
      });

      // Redirect to home page
      navigate("/");
    } catch (error) {
      toast({
        title: "Erreur de connexion",
        description: `Veuillez vérifier vos identifiants.`,
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <div className="flex w-full h-full justify-center items-center">
        <div className="flex flex-col gap-4">
          <h1 className="font-bold text-xl">Inscription</h1>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="Username" {...field} />
                    </FormControl>
                    <FormDescription>
                      Choisissez votre nom d'utilisateur.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mot de passe</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="************"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Choisissez votre mot de passe.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">S'inscrire</Button>
            </form>
          </Form>
          <Link to="/sign-in">Déjà inscrit ? Connectez-vous</Link>
        </div>
      </div>
    </>
  );
};
