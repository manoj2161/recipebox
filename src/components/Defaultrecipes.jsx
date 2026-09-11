import { Toaster } from "react-hot-toast";
import {
  ChevronLeft,
  ChevronRight,
  Heart,
  ArrowUpRight,
  Bookmark,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const Defaultrecipes = ({
  defaultRecipes,
  saveRecipe,
  dishName,
  savedRecipeIds,
}) => {
  const [index, setIndex] = useState(0);

  const navigate = useNavigate();

  if (!defaultRecipes?.length) return null;

  // Number of cards visible
  // Small devices = 1
  // Medium + Large devices = 2
  const getVisibleCards = () => {
    if (typeof window === "undefined") return 1;

    if (window.innerWidth < 640) return 1;

    return 2;
  };

  const visibleCards = getVisibleCards();

  const maxIndex = Math.max(0, defaultRecipes.length - visibleCards);

  return (
    <section className="min-w-0 flex-1 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
      <Toaster position="top-right" />

      {/* HEADER */}

      <div className="mb-4 flex items-end justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-green-950 sm:text-2xl">
            {dishName} Recipes
          </h2>

          <p className="mt-1 text-xs font-medium text-gray-500 sm:text-sm">
            Popular {dishName.toLowerCase()} ideas
          </p>
        </div>

        {/* CAROUSEL BUTTONS */}

        <div className="flex gap-1">
          {/* PREVIOUS */}

          <button
            disabled={index === 0}
            onClick={() => setIndex((i) => Math.max(0, i - 1))}
            className="flex size-9 items-center justify-center rounded-full border border-gray-200 bg-white transition hover:bg-gray-50 disabled:cursor-default disabled:opacity-30"
          >
            <ChevronLeft className="size-5" />
          </button>

          {/* NEXT */}

          <button
            disabled={index === maxIndex}
            onClick={() => setIndex((i) => Math.min(maxIndex, i + 1))}
            className="flex size-9 items-center justify-center rounded-full border border-gray-200 bg-white transition hover:bg-gray-50 disabled:cursor-default disabled:opacity-30"
          >
            <ChevronRight className="size-5" />
          </button>
        </div>
      </div>

      {/* CAROUSEL */}

      <div className="overflow-hidden">
        <div
          className="flex gap-3 transition-transform duration-500 ease-in-out"
          style={{
            transform:
              visibleCards === 1
                ? `translateX(-${index * 100}%)`
                : `translateX(calc(-${index} * (50% + 0.375rem)))`,
          }}
        >
          {defaultRecipes.map((recipe) => {
            // Check if recipe is already saved
            const saved = savedRecipeIds?.includes(String(recipe.idMeal));

            return (
              <article
                key={recipe.idMeal}
                className="group basis-full shrink-0 overflow-hidden rounded-xl border border-gray-100 bg-gray-50 sm:basis-[calc(50%_-_0.375rem)]"
              >
                {/* IMAGE */}

                <div className="relative overflow-hidden">
                  <img
                    src={recipe.strMealThumb}
                    alt={recipe.strMeal}
                    className="h-44 w-full object-cover transition duration-500 group-hover:scale-105 sm:h-40"
                  />

                  {/* HEART */}

                  <button
                    onClick={() => {
                      if (!saved) {
                        saveRecipe(recipe);
                      }
                    }}
                    aria-label={`Save ${recipe.strMeal}`}
                    disabled={saved}
                    className={`absolute right-2 top-2 flex size-9 items-center justify-center rounded-full bg-white/90 shadow-sm backdrop-blur ${
                      saved ? "cursor-default" : "transition hover:scale-110"
                    }`}
                  >
                    <Heart
                      className={`size-4 transition ${
                        saved ? "fill-red-500 text-red-500" : "text-green-950"
                      }`}
                    />
                  </button>
                </div>

                {/* CONTENT */}

                <div className="p-3">
                  {/* TITLE */}

                  <h3 className="truncate text-sm font-bold text-gray-900">
                    {recipe.strMeal}
                  </h3>

                  {/* COUNTRY */}

                  <p className="mt-1 truncate text-xs text-gray-500">
                    {recipe.strArea || recipe.strCountry || "Unknown origin"}
                  </p>

                  {/* ACTION BUTTONS */}

                  <div className="mt-3 grid grid-cols-2 gap-2">
                    {/* SAVE */}

                    <button
                      onClick={() => {
                        if (!saved) {
                          saveRecipe(recipe);
                        }
                      }}
                      disabled={saved}
                      className={`flex items-center justify-center gap-1.5 rounded-xl px-2 py-2.5 text-xs font-semibold transition-all duration-200 active:scale-95 ${
                        saved
                          ? "cursor-default border border-gray-200 bg-gray-100 text-gray-400"
                          : "border border-green-200 bg-green-50 text-green-900 hover:border-green-300 hover:bg-green-100"
                      }`}
                    >
                      <Bookmark />

                      {saved ? "Saved" : "Save"}
                    </button>

                    {/* VIEW */}

                    <button
                      onClick={() => navigate(`/recipe/${recipe.idMeal}`)}
                      className="flex items-center justify-center gap-1.5 rounded-xl bg-green-950 px-2 py-2.5 text-xs font-semibold text-white transition-all duration-200 hover:bg-green-900 active:scale-95"
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
      </div>
    </section>
  );
};
