import axios from "axios";
import { ArrowLeft, Heart, Share2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export const FullRecipe = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [fullRecipe, setRecipe] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchFullRecipe() {
      try {
        setError("");
        const response = await axios.get(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
        const recipe = response.data.meals?.[0];
        if (!recipe) throw new Error("Recipe not found");
        setRecipe(recipe);
      } catch (err) {
        console.error(err);
        setError("Unable to load this recipe.");
      }
    }
    fetchFullRecipe();
  }, [id]);

  const ingredients = useMemo(() => {
    if (!fullRecipe) return [];
    const list = [];
    for (let i = 1; i <= 20; i++) {
      const ingredient = fullRecipe[`strIngredient${i}`]?.trim();
      const measure = fullRecipe[`strMeasure${i}`]?.trim();
      if (ingredient) list.push({ ingredient, measure });
    }
    return list;
  }, [fullRecipe]);

  const steps = useMemo(() => {
    if (!fullRecipe?.strInstructions) return [];
    return fullRecipe.strInstructions.split(/\r?\n/).map((s) => s.trim()).filter(Boolean);
  }, [fullRecipe]);

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
    if (!loggedUser.recipies.some((item) => item.idMeal === recipeToSave.idMeal)) {
      loggedUser.recipies.push(recipeToSave);
      localStorage.setItem("recipeBoxUsers", JSON.stringify(users));
    }
  }

  if (!fullRecipe) {
    return <div className="flex min-h-[100svh] items-center justify-center px-4 text-center">{error ? <div><p className="font-semibold text-red-600">{error}</p><button onClick={() => navigate(-1)} className="mt-4 rounded-lg bg-green-950 px-4 py-2 text-sm font-bold text-white">Go Back</button></div> : <div className="size-8 animate-spin rounded-full border-4 border-green-950 border-t-transparent" />}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-gray-200 bg-white/95 px-3 py-3 shadow-sm backdrop-blur sm:px-6">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 rounded-lg px-2 py-2 text-sm font-semibold text-green-950 hover:bg-green-50 sm:text-base"><ArrowLeft className="size-5" /> Back</button>
        <div className="flex items-center gap-1 sm:gap-2">
          <button onClick={() => saveRecipe(fullRecipe)} aria-label="Save recipe" className="flex size-10 items-center justify-center rounded-full border border-gray-200 bg-white text-green-950 hover:bg-green-50"><Heart className="size-5" /></button>
          <button onClick={() => navigator.share?.({ title: fullRecipe.strMeal, url: window.location.href })} aria-label="Share recipe" className="flex size-10 items-center justify-center rounded-full border border-gray-200 bg-white text-green-950 hover:bg-green-50"><Share2 className="size-5" /></button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-3 py-4 sm:px-6 sm:py-6 lg:px-8">
        <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="grid md:grid-cols-[minmax(280px,420px)_1fr]">
            <img src={fullRecipe.strMealThumb} alt={fullRecipe.strMeal} className="h-72 w-full object-cover sm:h-96 md:h-full md:min-h-[360px]" />
            <div className="flex flex-col justify-center p-5 sm:p-7 lg:p-10">
              <span className="w-fit rounded-full bg-orange-100 px-3 py-1 text-xs font-bold text-orange-800">{fullRecipe.strCategory || "Recipe"}</span>
              <h1 className="mt-3 text-3xl font-bold leading-tight text-gray-900 sm:text-4xl lg:text-5xl">{fullRecipe.strMeal}</h1>
              <p className="mt-3 text-sm font-medium text-gray-500">{fullRecipe.strArea || "Unknown origin"}</p>
              <button onClick={() => saveRecipe(fullRecipe)} className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-green-950 px-5 py-3 font-bold text-white hover:bg-green-900 sm:w-fit"><Heart className="size-5" /> Save to My Recipes</button>
            </div>
          </div>
        </section>

        <div className="mt-5 grid gap-5 lg:grid-cols-[360px_1fr]">
          <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
            <h2 className="text-2xl font-bold text-green-950">Ingredients</h2>
            <div className="mt-5 space-y-3">
              {ingredients.map(({ ingredient, measure }) => <div key={`${ingredient}-${measure}`} className="flex gap-3 border-b border-gray-100 pb-3 text-sm"><span className="min-w-20 font-semibold text-gray-500">{measure || "As needed"}</span><span className="font-medium text-gray-800">{ingredient}</span></div>)}
            </div>
          </section>

          <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
            <h2 className="text-2xl font-bold text-green-950">Instructions</h2>
            <div className="mt-5 space-y-5">
              {steps.map((step, index) => <div key={index} className="flex gap-3"><span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-green-950 text-sm font-bold text-white">{index + 1}</span><p className="text-sm leading-7 text-gray-700 sm:text-base">{step}</p></div>)}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};
