import { ChevronLeft, ChevronRight, Heart } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const Defaultrecipes = ({ defaultRecipes, saveRecipe, dishName }) => {
  const [index, setIndex] = useState(0);
  const navigate = useNavigate();

  if (!defaultRecipes?.length) return null;

  const maxIndex = Math.max(0, defaultRecipes.length - 1);

  return (
    <section className="min-w-0 flex-1 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="mb-4 flex items-end justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-green-950 sm:text-2xl">{dishName} Recipes</h2>
          <p className="mt-1 text-xs font-medium text-gray-500 sm:text-sm">Popular {dishName.toLowerCase()} ideas</p>
        </div>
        <div className="flex gap-1">
          <button disabled={index === 0} onClick={() => setIndex((i) => Math.max(0, i - 1))} className="flex size-9 items-center justify-center rounded-full border border-gray-200 bg-white disabled:opacity-30"><ChevronLeft className="size-5" /></button>
          <button disabled={index === maxIndex} onClick={() => setIndex((i) => Math.min(maxIndex, i + 1))} className="flex size-9 items-center justify-center rounded-full border border-gray-200 bg-white disabled:opacity-30"><ChevronRight className="size-5" /></button>
        </div>
      </div>

      <div className="overflow-hidden">
        <div className="flex gap-3 transition-transform duration-500" style={{ transform: `translateX(calc(-${index} * (100% + 0.75rem)))` }}>
          {defaultRecipes.map((recipe) => (
            <article key={recipe.idMeal} className="group min-w-[calc(100%-0rem)] shrink-0 overflow-hidden rounded-xl border border-gray-100 bg-gray-50 sm:min-w-[calc(50%-0.375rem)] lg:min-w-[calc(33.333%-0.5rem)]">
              <div className="relative overflow-hidden">
                <img src={recipe.strMealThumb} alt={recipe.strMeal} className="h-44 w-full object-cover transition duration-500 group-hover:scale-105 sm:h-40" />
                <button onClick={() => saveRecipe(recipe)} aria-label={`Save ${recipe.strMeal}`} className="absolute right-2 top-2 flex size-9 items-center justify-center rounded-full bg-white/90 text-green-950 shadow-sm backdrop-blur">
                  <Heart className="size-4" />
                </button>
              </div>
              <div className="p-3">
                <h3 className="truncate text-sm font-bold text-gray-900">{recipe.strMeal}</h3>
                <p className="mt-1 truncate text-xs text-gray-500">{recipe.strCountry || "Unknown origin"}</p>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <button onClick={() => saveRecipe(recipe)} className="rounded-lg bg-green-950 px-2 py-2 text-xs font-bold text-white hover:bg-green-900">Save</button>
                  <button onClick={() => navigate(`/recipe/${recipe.idMeal}`)} className="rounded-lg bg-blue-900 px-2 py-2 text-xs font-bold text-white hover:bg-blue-800">View</button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
