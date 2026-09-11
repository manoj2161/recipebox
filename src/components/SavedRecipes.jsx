import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen, Heart, ArrowUpRight, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { AsideNavbar } from "./AsideNavbar";

export const SavedRecipes = ({ isLoggedIn, setIsLoggedIn }) => {
  const [myRecipes, setMyRecipes] = useState([]);
  const navigate = useNavigate();

  // Load current user's saved recipes
  useEffect(() => {
    const users = JSON.parse(localStorage.getItem("recipeBoxUsers") || "[]");

    const currentUser = JSON.parse(
      localStorage.getItem("recipeBoxCurrentUser") || "null",
    );

    if (!currentUser) {
      setMyRecipes([]);
      return;
    }

    // currentUser can be either an ID or an object
    const currentUserId =
      typeof currentUser === "object" ? currentUser.id : currentUser;

    const loggedUser = users.find((user) => user.id === currentUserId);

    // Support old "recipies" and new "myRecipes"
    setMyRecipes(loggedUser?.myRecipes || loggedUser?.recipies || []);
  }, [isLoggedIn]);

  // Remove recipe
  function removeRecipe(recipeId) {
    const currentUser = JSON.parse(
      localStorage.getItem("recipeBoxCurrentUser") || "null",
    );

    const users = JSON.parse(localStorage.getItem("recipeBoxUsers") || "[]");

    if (!currentUser) {
      toast.error("Please login first");
      return;
    }

    // Get current user's ID
    const currentUserId =
      typeof currentUser === "object" ? currentUser.id : currentUser;

    // Remove recipe from user's myRecipes
    const updatedUsers = users.map((user) => {
      if (user.id === currentUserId) {
        const savedRecipes = user.myRecipes || user.recipies || [];

        return {
          ...user,
          myRecipes: savedRecipes.filter(
            (recipe) => String(recipe.idMeal) !== String(recipeId),
          ),
        };
      }

      return user;
    });

    // Update localStorage
    localStorage.setItem("recipeBoxUsers", JSON.stringify(updatedUsers));

    // Update React state immediately
    setMyRecipes((recipes) =>
      recipes.filter((recipe) => String(recipe.idMeal) !== String(recipeId)),
    );

    // Show toast
    toast.success("Recipe removed from My Recipes");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}

      <AsideNavbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />

      <main className="min-h-screen w-full pb-24 lg:ml-64 lg:w-[calc(100%-16rem)] lg:pb-0">
        {/* Header */}

        <header className="border-b border-gray-100 bg-white px-4 py-5 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <BookOpen className="size-7 text-green-950" />

            <div>
              <h1 className="text-2xl font-bold text-green-950 sm:text-3xl">
                My Recipes
              </h1>

              <p className="text-sm text-gray-500">
                Your saved recipes in one place.
              </p>
            </div>
          </div>
        </header>

        {/* Recipes */}

        <section className="p-4 sm:p-6 lg:p-8">
          {myRecipes.length === 0 ? (
            /* Empty state */

            <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-5 py-14 text-center shadow-sm">
              <Heart className="mx-auto size-10 text-gray-300" />

              <h2 className="mt-3 text-lg font-bold text-gray-800">
                No saved recipes yet
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Search for a recipe and save your favorites.
              </p>

              <button
                onClick={() => navigate("/search")}
                className="mt-5 rounded-xl bg-green-950 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-green-900 active:scale-95"
              >
                Find Recipes
              </button>
            </div>
          ) : (
            /* Recipe cards */

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
              {myRecipes.map((recipe) => (
                <article
                  key={recipe.idMeal}
                  className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                >
                  {/* Image */}

                  <div className="relative overflow-hidden">
                    <img
                      src={recipe.strMealThumb}
                      alt={recipe.strMeal}
                      className="h-52 w-full object-cover transition duration-500 group-hover:scale-105"
                    />

                    {/* Heart */}

                    <div className="absolute right-3 top-3 flex size-9 items-center justify-center rounded-full bg-white/90 shadow-sm backdrop-blur">
                      <Heart className="size-5 fill-red-500 text-red-500" />
                    </div>
                  </div>

                  {/* Content */}

                  <div className="p-4">
                    <h2 className="truncate text-lg font-bold text-gray-900">
                      {recipe.strMeal}
                    </h2>

                    <p className="mt-1 truncate text-sm text-gray-500">
                      {recipe.strCountry || recipe.strArea || "Unknown origin"}
                    </p>

                    {/* Buttons */}

                    <div className="mt-4 grid grid-cols-2 gap-2">
                      {/* GET RECIPE */}

                      <button
                        onClick={() => navigate(`/recipe/${recipe.idMeal}`)}
                        className="flex items-center justify-center gap-1.5 rounded-xl bg-green-950 px-3 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-green-900 hover:shadow-md active:scale-95"
                      >
                        View
                        <ArrowUpRight className="size-4" />
                      </button>

                      {/* REMOVE */}

                      <button
                        onClick={() => removeRecipe(recipe.idMeal)}
                        className="flex items-center justify-center gap-1.5 rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-sm font-semibold text-red-600 transition-all duration-200 hover:border-red-300 hover:bg-red-100 active:scale-95"
                      >
                        <Trash2 className="size-4" />
                        Remove
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};
