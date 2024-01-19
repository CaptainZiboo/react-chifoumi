import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { MatchesProvider } from "@/context/matches";
import { getAuth } from "@/lib/storage";
import { Link, Navigate, Outlet } from "react-router-dom";

export const RootLayout: React.FC = () => {
  const auth = getAuth();

  if (!auth) return <Navigate to={"/sign-in"} />;

  return (
    <>
      <MatchesProvider>
        <div className="w-full h-full flex flex-col p-4">
          <div className="w-full">
            <NavigationMenu>
              <NavigationMenuList className="">
                <NavigationMenuItem>
                  <Link to={"/sign-out"}>
                    {" "}
                    Connecté en tant que {getAuth().username} | Déconnexion
                  </Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>
          <Outlet />
        </div>
      </MatchesProvider>
    </>
  );
};
