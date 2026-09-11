import { useNavigate } from "react-router-dom";

export const PageNotFound = () => {
  const navigate = useNavigate();
  return (
    <main className="flex min-h-[100svh] items-center justify-center bg-[#fef9f3] px-4 text-center">
      <div><p className="text-7xl font-bold text-[#c64d26] sm:text-9xl">404</p><h1 className="mt-3 text-2xl font-bold text-gray-900">Page not found</h1><p className="mt-2 text-gray-500">The page you're looking for doesn't exist.</p><button onClick={() => navigate("/")} className="mt-6 rounded-xl bg-[#c64d26] px-5 py-2.5 font-semibold text-white hover:bg-[#ad401e]">Go Home</button></div>
    </main>
  );
};
