export const RecipeSkeleton = () => {
  return (
    <article className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      {/* Image skeleton */}
      <div className="h-52 w-full animate-pulse bg-gray-200" />

      <div className="p-4">
        {/* Title */}
        <div className="h-5 w-3/4 animate-pulse rounded bg-gray-200" />

        <div className="mt-2 h-4 w-1/2 animate-pulse rounded bg-gray-200" />

        {/* Buttons */}
        <div className="mt-4 grid grid-cols-2 gap-2">
          <div className="h-10 animate-pulse rounded-xl bg-gray-200" />
          <div className="h-10 animate-pulse rounded-xl bg-gray-200" />
        </div>
      </div>
    </article>
  );
};
