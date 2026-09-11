import { Bookmark, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const HeaderDashboard = ({
  newSearch,
  setNewSearch,
  setSearchQuery,
  name,
  isLoggedIn,
}) => {
  const navigate = useNavigate();

  function submitSearch() {
    if (!newSearch.trim()) return;

    setSearchQuery(newSearch.trim());
  }

  return (
    <header className="sticky top-0 z-30 flex flex-col gap-3 border-b border-gray-100 bg-gray-50/95 px-3 py-3 backdrop-blur sm:px-5 md:flex-row md:items-center md:justify-between md:px-6">
      <div className="flex min-w-0 flex-1 items-center gap-2">
        <div className="relative min-w-0 flex-1 md:max-w-2xl">
          <Search className="absolute left-3 top-1/2 size-5 -translate-y-1/2 text-green-950" />

          <input
            value={newSearch}
            onChange={(e) => setNewSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                submitSearch();
              }
            }}
            placeholder="Search recipes, e.g. chicken, pasta..."
            className="h-11 w-full rounded-full border border-gray-300 bg-white pl-10 pr-12 text-sm outline-none focus:border-green-950 focus:ring-2 focus:ring-green-100 sm:h-12"
          />

          <button
            onClick={submitSearch}
            aria-label="Search"
            className="absolute right-1 top-1/2 flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-green-950 text-white"
          >
            <Search className="size-4" />
          </button>
        </div>
      </div>

      <div className="flex items-center justify-end gap-2">
        {isLoggedIn ? (
          <>
            <button
              onClick={() => navigate("/myrecipes")}
              aria-label="Saved recipes"
              className="flex size-10 items-center justify-center rounded-full border border-gray-200 bg-white text-green-950 shadow-sm transition hover:bg-green-50"
            >
              <Bookmark className="size-5" />
            </button>

            <button
              className="flex size-10 items-center justify-center rounded-full bg-green-950 text-sm font-bold text-white shadow-sm"
              title="Profile"
            >
              {name || "U"}
            </button>
          </>
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="rounded-full bg-green-950 px-4 py-2 text-sm font-bold text-white shadow-sm hover:bg-green-900 sm:px-5"
          >
            Login
          </button>
        )}
      </div>
    </header>
  );
};
