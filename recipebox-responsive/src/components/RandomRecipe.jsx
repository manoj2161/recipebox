import { ArrowRight, Heart, Shuffle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const RandomRecipe = ({ random, saveRecipe }) => {
  const navigate = useNavigate();
  if (!random) return null;

  return (
    <article className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="bg-green-950 px-4 py-3 text-white sm:px-5">
        <div className="flex items-center gap-2"><Shuffle className="size-5" /><h2 className="text-lg font-bold sm:text-xl">Random Recipe for You</h2></div>
      </div>
      <div className="grid gap-5 p-4 sm:p-5 md:grid-cols-[240px_1fr] md:items-center">
        <img src={random.strMealThumb} alt={random.strMeal} className="h-56 w-full rounded-xl object-cover sm:h-64 md:h-48" />
        <div>
          <h3 className="text-2xl font-bold text-gray-900 sm:text-3xl">{random.strMeal}</h3>
          <p className="mt-2 text-sm font-medium text-gray-500">{random.strCategory || "Recipe"} · {random.strArea || random.strCountry || "Unknown origin"}</p>
          <div className="mt-5 flex flex-col gap-2 sm:flex-row">
            <button onClick={() => saveRecipe(random)} className="flex items-center justify-center gap-2 rounded-xl bg-green-950 px-4 py-2.5 text-sm font-bold text-white hover:bg-green-900"><Heart className="size-4" /> Save Recipe</button>
            <button onClick={() => navigate(`/recipe/${random.idMeal}`)} className="flex items-center justify-center gap-2 rounded-xl bg-blue-900 px-4 py-2.5 text-sm font-bold text-white hover:bg-blue-800">Get Recipe <ArrowRight className="size-4" /></button>
          </div>
        </div>
      </div>
    </article>
  );
};
