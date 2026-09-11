import axios from "axios";
import toast from "react-hot-toast";
import { ChefHat, Heart, Shuffle, ArrowUpRight, Bookmark } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import surprise from "../assets/surprise.png";
import { AsideNavbar } from "./AsideNavbar";
import { Defaultrecipes } from "./Defaultrecipes";
import { HeaderDashboard } from "./HeaderDashboard";
import { RandomRecipe } from "./RandomRecipe";
import { RecipeSkeleton } from "./RecipeSkeleton";

export const SearchResult = ({ isLoggedIn, setIsLoggedIn }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const [recipes, setRecipes] = useState([]);
  const [random, setRandom] = useState(null);
  const [error, setError] = useState("");
  const [newSearch, setNewSearch] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [defaultRecipes, setDefaultRecipes] = useState({});
  const [name, setName] = useState("");
  const [savedRecipeIds, setSavedRecipeIds] = useState([]);
  const [loading, setLoading] = useState(false);

  // Loading state for default recipes
  const [loadingDefaults, setLoadingDefaults] = useState(true);

  const query = location.state?.query;

  // Accept clearSearch from AsideNavbar
  const clearSearch = location.state?.clearSearch;

  // --------------------------------------------------
  // Load current user's name and saved recipes
  // --------------------------------------------------

  useEffect(() => {
    const users = JSON.parse(localStorage.getItem("recipeBoxUsers") || "[]");

    const currentUser = JSON.parse(
      localStorage.getItem("recipeBoxCurrentUser") || "null",
    );

    if (!currentUser) {
      setSavedRecipeIds([]);
      setName("");
      return;
    }

    const currentUserId =
      typeof currentUser === "object" ? currentUser.id : currentUser;

    const loggedUser = users.find((user) => user.id === currentUserId);

    if (!loggedUser) {
      setSavedRecipeIds([]);
      setName("");
      return;
    }

    setName(loggedUser.name?.charAt(0).toUpperCase() || "");

    const savedRecipes = loggedUser.myRecipes || loggedUser.recipies || [];

    const savedIds = savedRecipes.map((recipe) => String(recipe.idMeal));

    setSavedRecipeIds(savedIds);
  }, [isLoggedIn]);

  // --------------------------------------------------
  // Handle search / Home
  // --------------------------------------------------

  useEffect(() => {
    if (clearSearch) {
      setNewSearch("");
      setSearchQuery("");
      setRecipes([]);
      setRandom(null);
      setError("");
      setLoading(false);

      return;
    }

    if (query) {
      setNewSearch(query);
      setSearchQuery(query);
    }
  }, [query, clearSearch]);

  // --------------------------------------------------
  // Fetch default recipes
  // --------------------------------------------------

  useEffect(() => {
    async function fetchDefaults() {
      try {
        setLoadingDefaults(true);

        const dishes = ["chicken", "rice", "beef"];

        const responses = await Promise.all(
          dishes.map(async (dish) => {
            const response = await axios.get(
              `https://www.themealdb.com/api/json/v1/1/filter.php?i=${dish}`,
            );

            return [dish, response.data.meals || []];
          }),
        );

        setDefaultRecipes(Object.fromEntries(responses));
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingDefaults(false);
      }
    }

    fetchDefaults();
  }, []);

  // --------------------------------------------------
  // Search recipes
  // --------------------------------------------------

  useEffect(() => {
    if (!searchQuery.trim()) {
      setRecipes([]);
      setError("");
      setLoading(false);

      return;
    }

    const controller = new AbortController();

    async function fetchRecipes() {
      try {
        setLoading(true);
        setError("");
        setRandom(null);

        const response = await axios.get(
          `https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(
            searchQuery.trim(),
          )}`,
          {
            signal: controller.signal,
          },
        );

        const meals = response.data.meals || [];

        setRecipes(meals);

        if (!meals.length) {
          setError(`No recipes found for "${searchQuery.trim()}".`);
        }
      } catch (err) {
        if (err.name !== "CanceledError" && err.name !== "AbortError") {
          console.error(err);

          setError("Something went wrong while searching.");
        }
      } finally {
        setLoading(false);
      }
    }

    fetchRecipes();

    return () => controller.abort();
  }, [searchQuery]);

  // --------------------------------------------------
  // Random recipe
  // --------------------------------------------------

  async function handleRandom() {
    try {
      setError("");
      setRandom(null);
      setLoading(true);

      const response = await axios.get(
        "https://www.themealdb.com/api/json/v1/1/random.php",
      );

      setRandom(response.data.meals?.[0] || null);
    } catch (err) {
      console.error(err);

      setError("Unable to load a random recipe.");
    } finally {
      setLoading(false);
    }
  }

  // --------------------------------------------------
  // Save recipe
  // --------------------------------------------------

  function saveRecipe(recipeToSave) {
    const currentUser = JSON.parse(
      localStorage.getItem("recipeBoxCurrentUser") || "null",
    );

    if (!currentUser) {
      toast.error("Please login to save recipes");

      navigate("/login");

      return;
    }

    const users = JSON.parse(localStorage.getItem("recipeBoxUsers") || "[]");

    const currentUserId =
      typeof currentUser === "object" ? currentUser.id : currentUser;

    let recipeAlreadyExists = false;
    let recipeSaved = false;

    const updatedUsers = users.map((user) => {
      if (user.id === currentUserId) {
        const myRecipes = user.myRecipes || user.recipies || [];

        recipeAlreadyExists = myRecipes.some(
          (recipe) => String(recipe.idMeal) === String(recipeToSave.idMeal),
        );

        if (recipeAlreadyExists) {
          return user;
        }

        recipeSaved = true;

        return {
          ...user,
          myRecipes: [...myRecipes, recipeToSave],
        };
      }

      return user;
    });

    if (recipeAlreadyExists) {
      toast.error("Recipe already exists in My Recipes");

      return;
    }

    if (!recipeSaved) {
      toast.error("User not found");

      return;
    }

    localStorage.setItem("recipeBoxUsers", JSON.stringify(updatedUsers));

    setSavedRecipeIds((prev) => {
      const id = String(recipeToSave.idMeal);

      if (prev.includes(id)) {
        return prev;
      }

      return [...prev, id];
    });

    toast.success("Recipe saved successfully!");
  }

  // --------------------------------------------------
  // UI
  // --------------------------------------------------

  return (
    <div className="min-h-screen bg-gray-50">
      <AsideNavbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />

      <main className="min-h-screen w-full pb-24 lg:ml-64 lg:w-[calc(100%-16rem)] lg:pb-0">
        <HeaderDashboard
          newSearch={newSearch}
          setNewSearch={setNewSearch}
          setSearchQuery={setSearchQuery}
          name={name}
          isLoggedIn={isLoggedIn}
        />

        <div className="space-y-6 p-3 sm:p-5 md:p-6">
          {/* SURPRISE ME */}

          <section className="relative overflow-hidden rounded-2xl shadow-sm">
            <img
              src={surprise}
              alt="Surprise recipe"
              className="h-40 w-full object-cover sm:h-52 md:h-60 lg:h-64"
            />

            <div className="absolute inset-0 bg-black/10" />

            <div className="absolute inset-0 flex items-end justify-between gap-4 p-4 sm:p-6">
              <div className="max-w-md text-white drop-shadow-md">
                <h1 className="text-xl font-bold sm:text-2xl">
                  Don't know what to cook?
                </h1>

                <p className="mt-1 hidden text-sm sm:block">
                  Let RecipeBox choose something delicious for you.
                </p>
              </div>

              <button
                onClick={handleRandom}
                className="flex shrink-0 items-center gap-2 rounded-full bg-orange-700 px-4 py-2.5 text-sm font-bold text-white shadow-lg transition hover:bg-orange-800 active:scale-95 sm:px-5"
              >
                <Shuffle className="size-4" />
                Surprise Me
              </button>
            </div>
          </section>

          {/* DEFAULT RECIPES */}

          {!searchQuery.trim() && !random && (
            <section>
              <div className="mb-4">
                <h2 className="text-2xl font-bold text-green-950">
                  Explore Recipes
                </h2>

                <p className="text-sm text-gray-500">
                  Start with one of these popular ingredients.
                </p>
              </div>

              {/* DEFAULT RECIPE SKELETON */}

              {loadingDefaults ? (
                <div className="grid gap-5 lg:grid-cols-3">
                  <RecipeSkeleton />
                  <RecipeSkeleton />
                  <RecipeSkeleton />
                </div>
              ) : (
                <div className="grid gap-5 lg:grid-cols-3">
                  <Defaultrecipes
                    defaultRecipes={defaultRecipes.chicken}
                    saveRecipe={saveRecipe}
                    savedRecipeIds={savedRecipeIds}
                    dishName="Chicken"
                  />

                  <Defaultrecipes
                    defaultRecipes={defaultRecipes.beef}
                    saveRecipe={saveRecipe}
                    savedRecipeIds={savedRecipeIds}
                    dishName="Beef"
                  />

                  <Defaultrecipes
                    defaultRecipes={defaultRecipes.rice}
                    saveRecipe={saveRecipe}
                    savedRecipeIds={savedRecipeIds}
                    dishName="Rice"
                  />
                </div>
              )}
            </section>
          )}

          {/* RANDOM RECIPE */}

          {random && <RandomRecipe random={random} saveRecipe={saveRecipe} />}

          {/* SEARCH RESULTS */}

          {searchQuery.trim() && !random && (
            <section>
              <div className="mb-5 flex items-end justify-between gap-3">
                <div className="flex items-center gap-2">
                  <ChefHat className="size-6 text-green-950" />

                  <div>
                    <h2 className="text-2xl font-bold text-green-950 sm:text-3xl">
                      Search Results
                    </h2>

                    {!loading && (
                      <p className="text-sm text-gray-500">
                        {recipes.length}
                        {recipes.length === 1 ? " recipe" : " recipes"} found
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* ERROR */}

              {error && !loading && (
                <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
                  {error}
                </div>
              )}

              {/* SEARCH SKELETON */}

              {loading && (
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                  {Array.from({
                    length: 8,
                  }).map((_, index) => (
                    <RecipeSkeleton key={index} />
                  ))}
                </div>
              )}

              {/* SEARCH RESULTS */}

              {!loading && (
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                  {recipes.map((recipe) => {
                    const saved = savedRecipeIds.includes(
                      String(recipe.idMeal),
                    );

                    return (
                      <article
                        key={recipe.idMeal}
                        className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                      >
                        {/* IMAGE */}

                        <div className="relative overflow-hidden">
                          <img
                            src={recipe.strMealThumb}
                            alt={recipe.strMeal}
                            className="h-52 w-full object-cover transition duration-500 group-hover:scale-105"
                          />

                          {/* HEART */}

                          <button
                            onClick={() => saveRecipe(recipe)}
                            aria-label={`Save ${recipe.strMeal}`}
                            className="absolute right-3 top-3 flex size-9 items-center justify-center rounded-full bg-white/90 shadow-md backdrop-blur transition hover:scale-110 active:scale-95"
                          >
                            <Heart
                              className={`size-4 transition ${
                                saved
                                  ? "fill-red-500 text-red-500"
                                  : "text-green-950"
                              }`}
                            />
                          </button>
                        </div>

                        {/* CONTENT */}

                        <div className="p-4">
                          <h3 className="line-clamp-2 min-h-12 text-lg font-bold text-gray-900">
                            {recipe.strMeal}
                          </h3>

                          <p className="mt-2 truncate text-sm text-gray-500">
                            {recipe.strArea ||
                              recipe.strCountry ||
                              "Unknown origin"}
                          </p>

                          {/* BUTTONS */}

                          <div className="mt-4 grid grid-cols-2 gap-2">
                            {/* SAVE */}

                            <button
                              onClick={() => saveRecipe(recipe)}
                              disabled={saved}
                              className={`flex items-center justify-center gap-1.5 rounded-xl px-2 py-2.5 text-xs font-semibold transition-all duration-200 active:scale-95 sm:text-sm ${
                                saved
                                  ? "cursor-default border border-gray-200 bg-gray-100 text-gray-400"
                                  : "border border-green-200 bg-green-50 text-green-900 hover:border-green-300 hover:bg-green-100"
                              }`}
                            >
                              <Bookmark className="size-4" />

                              {saved ? "Saved" : "Save"}
                            </button>

                            {/* VIEW */}

                            <button
                              onClick={() =>
                                navigate(`/recipe/${recipe.idMeal}`)
                              }
                              className="flex items-center justify-center gap-1.5 rounded-xl bg-green-950 px-2 py-2.5 text-xs font-semibold text-white shadow-sm transition-all duration-200 hover:bg-green-900 hover:shadow-md active:scale-95 sm:text-sm"
                            >
                              View
                              <ArrowUpRight className="size-4" />
                            </button>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}
            </section>
          )}
        </div>
      </main>
    </div>
  );
};
