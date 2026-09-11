import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen, Heart } from "lucide-react";
import { AsideNavbar } from "./AsideNavbar";

export const SavedRecipes = ({ isLoggedIn, setIsLoggedIn }) => {
  const [myRecipes, setMyRecipes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const users = JSON.parse(localStorage.getItem("recipeBoxUsers")) || [];
    const currentUser = JSON.parse(localStorage.getItem("recipeBoxCurrentUser"));
    const loggedUser = users.find((user) => user.id === currentUser);
    setMyRecipes(loggedUser?.recipies || []);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <AsideNavbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      <main className="min-h-screen w-full pb-24 lg:ml-64 lg:w-[calc(100%-16rem)] lg:pb-0">
        <header className="border-b border-gray-100 bg-white px-4 py-5 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3"><BookOpen className="size-7 text-green-950" /><div><h1 className="text-2xl font-bold text-green-950 sm:text-3xl">My Recipes</h1><p className="text-sm text-gray-500">Your saved recipes in one place.</p></div></div>
        </header>

        <section className="p-4 sm:p-6 lg:p-8">
          {myRecipes.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-5 py-14 text-center shadow-sm">
              <Heart className="mx-auto size-10 text-gray-300" />
              <h2 className="mt-3 text-lg font-bold text-gray-800">No saved recipes yet</h2>
              <p className="mt-1 text-sm text-gray-500">Search for a recipe and save your favorites.</p>
              <button onClick={() => navigate("/search")} className="mt-5 rounded-xl bg-green-950 px-5 py-2.5 text-sm font-bold text-white">Find Recipes</button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
              {myRecipes.map((recipe) => (
                <article key={recipe.idMeal} className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
                  <img src={recipe.strMealThumb} alt={recipe.strMeal} className="h-52 w-full object-cover" />
                  <div className="p-4">
                    <h2 className="truncate text-lg font-bold text-gray-900">{recipe.strMeal}</h2>
                    <p className="mt-1 text-sm text-gray-500">{recipe.strCountry || recipe.strArea || "Unknown origin"}</p>
                    <button onClick={() => navigate(`/recipe/${recipe.idMeal}`)} className="mt-4 w-full rounded-xl bg-blue-900 px-4 py-2.5 text-sm font-bold text-white hover:bg-blue-800">Get Recipe</button>
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
