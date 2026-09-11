import axios from "axios";
import { ChefHat, Heart, Shuffle } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import surprise from "../assets/surprise.png";
import { AsideNavbar } from "./AsideNavbar";
import { Defaultrecipes } from "./Defaultrecipes";
import { HeaderDashboard } from "./HeaderDashboard";
import { RandomRecipe } from "./RandomRecipe";

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

  const query = location.state?.query;

  useEffect(() => {
    if (query?.trim()) setSearchQuery(query.trim());
  }, [query]);

  useEffect(() => {
    const users = JSON.parse(localStorage.getItem("recipeBoxUsers")) || [];
    const currentUser = JSON.parse(localStorage.getItem("recipeBoxCurrentUser"));
    const loggedUser = users.find((user) => user.id === currentUser);
    setName(loggedUser?.name?.charAt(0)?.toUpperCase() || "");
  }, [isLoggedIn]);

  useEffect(() => {
    async function fetchDefaults() {
      try {
        const dishes = ["chicken", "rice", "beef"];
        const responses = await Promise.all(dishes.map(async (dish) => {
          const response = await axios.get(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${dish}`);
          return [dish, response.data.meals || []];
        }));
        setDefaultRecipes(Object.fromEntries(responses));
      } catch (err) {
        console.error(err);
      }
    }
    fetchDefaults();
  }, []);

  useEffect(() => {
    if (!searchQuery.trim()) return;

    const controller = new AbortController();
    async function fetchRecipes() {
      try {
        setError("");
        setRandom(null);
        const response = await axios.get(`https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(searchQuery.trim())}`, { signal: controller.signal });
        const meals = response.data.meals || [];
        setRecipes(meals);
        if (!meals.length) setError(`No recipes found for "${searchQuery.trim()}".`);
      } catch (err) {
        if (err.name !== "CanceledError" && err.name !== "AbortError") {
          console.error(err);
          setError("Something went wrong while searching.");
        }
      }
    }
    fetchRecipes();
    return () => controller.abort();
  }, [searchQuery]);

  async function handleRandom() {
    try {
      setError("");
      const response = await axios.get("https://www.themealdb.com/api/json/v1/1/random.php");
      setRandom(response.data.meals?.[0] || null);
    } catch (err) {
      console.error(err);
      setError("Unable to load a random recipe.");
    }
  }

  function saveRecipe(recipeToSave) {
    const currentUser = JSON.parse(localStorage.getItem("recipeBoxCurrentUser"));
    if (!currentUser) {
      sessionStorage.setItem("pendingRecipe", JSON.stringify(recipeToSave));
      navigate("/login");
      return;
    }

    const users = JSON.parse(localStorage.getItem("recipeBoxUsers")) || [];
    const loggedUser = users.find((user) => user.id === currentUser);
    if (!loggedUser) {
      sessionStorage.setItem("pendingRecipe", JSON.stringify(recipeToSave));
      navigate("/login");
      return;
    }

    loggedUser.recipies = loggedUser.recipies || [];
    if (loggedUser.recipies.some((recipe) => recipe.idMeal === recipeToSave.idMeal)) return;
    loggedUser.recipies.push(recipeToSave);
    localStorage.setItem("recipeBoxUsers", JSON.stringify(users));
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AsideNavbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      <main className="min-h-screen w-full pb-24 lg:ml-64 lg:w-[calc(100%-16rem)] lg:pb-0">
        <HeaderDashboard newSearch={newSearch} setNewSearch={setNewSearch} setSearchQuery={setSearchQuery} name={name} isLoggedIn={isLoggedIn} />

        <div className="space-y-6 p-3 sm:p-5 md:p-6">
          <section className="relative overflow-hidden rounded-2xl shadow-sm">
            <img src={surprise} alt="Surprise recipe" className="h-40 w-full object-cover sm:h-52 md:h-60 lg:h-64" />
            <div className="absolute inset-0 bg-black/10" />
            <div className="absolute inset-0 flex items-end justify-between gap-4 p-4 sm:p-6">
              <div className="max-w-md text-white drop-shadow-md"><h1 className="text-xl font-bold sm:text-2xl">Don't know what to cook?</h1><p className="mt-1 hidden text-sm sm:block">Let RecipeBox choose something delicious for you.</p></div>
              <button onClick={handleRandom} className="flex shrink-0 items-center gap-2 rounded-full bg-orange-700 px-4 py-2.5 text-sm font-bold text-white shadow-lg hover:bg-orange-800 sm:px-5"><Shuffle className="size-4" /> Surprise Me</button>
            </div>
          </section>

          {!searchQuery.trim() && !random && (
            <section>
              <div className="mb-4"><h2 className="text-2xl font-bold text-green-950">Explore Recipes</h2><p className="text-sm text-gray-500">Start with one of these popular ingredients.</p></div>
              <div className="grid gap-5 lg:grid-cols-3">
                <Defaultrecipes defaultRecipes={defaultRecipes.chicken} saveRecipe={saveRecipe} dishName="Chicken" />
                <Defaultrecipes defaultRecipes={defaultRecipes.beef} saveRecipe={saveRecipe} dishName="Beef" />
                <Defaultrecipes defaultRecipes={defaultRecipes.rice} saveRecipe={saveRecipe} dishName="Rice" />
              </div>
            </section>
          )}

          {random && <RandomRecipe random={random} saveRecipe={saveRecipe} />}

          {searchQuery.trim() && !random && (
            <section>
              <div className="mb-5 flex items-end justify-between gap-3"><div className="flex items-center gap-2"><ChefHat className="size-6 text-green-950" /><div><h2 className="text-2xl font-bold text-green-950 sm:text-3xl">Search Results</h2><p className="text-sm text-gray-500">{recipes.length} {recipes.length === 1 ? "recipe" : "recipes"} found</p></div></div></div>
              {error && <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">{error}</div>}
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                {recipes.map((recipe) => (
                  <article key={recipe.idMeal} className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
                    <div className="relative overflow-hidden"><img src={recipe.strMealThumb} alt={recipe.strMeal} className="h-52 w-full object-cover transition duration-500 group-hover:scale-105" /><button onClick={() => saveRecipe(recipe)} aria-label={`Save ${recipe.strMeal}`} className="absolute right-3 top-3 flex size-9 items-center justify-center rounded-full bg-white/90 text-green-950 shadow-md backdrop-blur"><Heart className="size-4" /></button></div>
                    <div className="p-4"><h3 className="line-clamp-2 min-h-12 text-lg font-bold text-gray-900">{recipe.strMeal}</h3><p className="mt-2 truncate text-sm text-gray-500">{recipe.strArea || recipe.strCountry || "Unknown origin"}</p><div className="mt-4 grid grid-cols-2 gap-2"><button onClick={() => saveRecipe(recipe)} className="rounded-xl bg-green-950 px-2 py-2.5 text-xs font-bold text-white hover:bg-green-900 sm:text-sm">Save Recipe</button><button onClick={() => navigate(`/recipe/${recipe.idMeal}`)} className="rounded-xl bg-blue-900 px-2 py-2.5 text-xs font-bold text-white hover:bg-blue-800 sm:text-sm">Get Recipe</button></div></div>
                  </article>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  );
};
