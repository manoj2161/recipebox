import { useNavigate } from "react-router-dom";
import { Home, LogOut, NotepadText, ShoppingBasket } from "lucide-react";
import logo from "../assets/logo.png";

export const AsideNavbar = ({ isLoggedIn, setIsLoggedIn }) => {
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem("recipeBoxCurrentUser");

    setIsLoggedIn(false);

    navigate("/");
  }

  function handleHome() {
    navigate("/search", {
      state: {
        clearSearch: Date.now(),
      },
    });
  }

  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-gray-200 bg-white px-4 py-6 shadow-sm lg:flex">
        <button
          onClick={handleHome}
          className="mb-8 flex items-center justify-center"
        >
          <img
            src={logo}
            alt="RecipeBox logo"
            className="h-24 w-24 object-contain"
          />
        </button>

        <nav className="space-y-2">
          <button
            onClick={handleHome}
            className="flex h-11 w-full items-center gap-3 rounded-xl px-4 font-semibold text-green-950 transition hover:bg-green-100"
          >
            <Home className="size-5" />

            <span>Home</span>
          </button>

          {isLoggedIn && (
            <button
              onClick={() => navigate("/myrecipes")}
              className="flex h-11 w-full items-center gap-3 rounded-xl px-4 font-semibold text-green-950 transition hover:bg-green-100"
            >
              <NotepadText className="size-5" />

              <span>My Recipes</span>
            </button>
          )}

          {isLoggedIn && (
            <button
              onClick={() => navigate("/shoppinglist")}
              className="flex h-11 w-full items-center gap-3 rounded-xl px-4 font-semibold text-green-950 transition hover:bg-green-100"
            >
              <ShoppingBasket className="size-5" />

              <span>Shopping</span>
            </button>
          )}
        </nav>

        {isLoggedIn && (
          <button
            onClick={handleLogout}
            className="mt-auto flex h-11 w-full items-center gap-3 rounded-xl px-4 font-semibold text-red-600 transition hover:bg-red-50"
          >
            <LogOut className="size-5" />

            <span>Logout</span>
          </button>
        )}
      </aside>

      <nav className="fixed inset-x-0 bottom-0 z-50 flex min-h-16 items-center justify-around border-t border-gray-200 bg-white/95 px-2 pb-[env(safe-area-inset-bottom)] shadow-[0_-4px_18px_rgba(0,0,0,0.08)] backdrop-blur lg:hidden">
        <button
          onClick={handleHome}
          className="flex min-w-16 flex-col items-center gap-1 py-2 text-green-950"
        >
          <Home className="size-5" />

          <span className="text-[10px] font-semibold">Home</span>
        </button>

        {/* MY RECIPES */}

        {isLoggedIn && (
          <button
            onClick={() => navigate("/myrecipes")}
            className="flex min-w-16 flex-col items-center gap-1 py-2 text-green-950"
          >
            <NotepadText className="size-5" />

            <span className="text-[10px] font-semibold">My Recipes</span>
          </button>
        )}

        {/* SHOPPING */}

        {isLoggedIn && (
          <button
            onClick={() => navigate("/shoppinglist")}
            className="flex min-w-16 flex-col items-center gap-1 py-2 text-green-950"
          >
            <ShoppingBasket className="size-5" />

            <span className="text-[10px] font-semibold">Shopping</span>
          </button>
        )}

        {/* LOGOUT */}

        {isLoggedIn && (
          <button
            onClick={handleLogout}
            className="flex min-w-16 flex-col items-center gap-1 py-2 text-red-600"
          >
            <LogOut className="size-5" />

            <span className="text-[10px] font-semibold">Logout</span>
          </button>
        )}
      </nav>
    </>
  );
};
