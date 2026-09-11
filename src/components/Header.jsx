import { Search } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

export const Header = () => {
  const [recipeSearch, setRecipeSearch] = useState("");
  const navigate = useNavigate();

  function handleSearch() {
    const query = recipeSearch.trim();
    if (!query) return;
    navigate("/search", { state: { query } });
  }

  return (
    <div className="flex min-h-[100svh] w-full flex-col">
      <header className="px-4 py-4 sm:px-6 md:px-8 lg:px-12">
        <div className="flex items-center justify-between gap-3">
          <button onClick={() => navigate("/")} className="flex min-w-0 items-center">
            <img src={logo} alt="RecipeBox logo" className="size-12 object-contain sm:size-14 md:size-16 lg:size-20" />
            <span className="font-['Kaushan_Script'] text-xl font-bold text-green-950 sm:text-2xl md:text-3xl lg:text-4xl">
              RecipeBox
            </span>
          </button>

          <nav className="flex shrink-0 items-center gap-2 sm:gap-3">
            <button onClick={() => navigate("/login")} className="rounded-full border border-green-950 px-3 py-1.5 text-xs font-bold text-green-950 shadow-sm transition hover:bg-white sm:px-4 sm:text-sm md:text-base">
              Login
            </button>
            <button onClick={() => navigate("/signup")} className="rounded-full bg-green-950 px-3 py-1.5 text-xs font-bold text-white shadow-sm transition hover:bg-green-900 sm:px-4 sm:text-sm md:text-base">
              Sign Up
            </button>
          </nav>
        </div>
      </header>

      <section className="flex flex-1 items-center justify-center px-4 pb-16 sm:px-6 md:pb-20">
        <div className="w-full max-w-3xl">
          <h1 className="mb-5 text-center font-['Kaushan_Script'] text-3xl font-bold text-green-950 sm:text-4xl md:text-5xl">
            What are you cooking today?
          </h1>
          <div className="flex items-center gap-2">
            <div className="relative min-w-0 flex-1">
              <Search className="absolute left-3 top-1/2 size-5 -translate-y-1/2 text-green-950" />
              <input
                value={recipeSearch}
                onChange={(e) => setRecipeSearch(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                placeholder="Search for recipes..."
                className="h-11 w-full rounded-full border border-green-950 bg-white/90 pl-10 pr-4 text-sm outline-none transition focus:ring-2 focus:ring-green-950 sm:h-13 sm:text-base md:h-14"
              />
            </div>
            <button onClick={handleSearch} aria-label="Search" className="flex size-11 shrink-0 items-center justify-center rounded-full bg-green-950 text-white shadow-lg transition hover:bg-green-900 sm:size-13 md:size-14">
              <Search className="size-5 sm:size-6" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
