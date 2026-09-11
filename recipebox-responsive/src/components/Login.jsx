import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthLayout } from "./AuthLayout";

export const Login = ({ setIsLoggedIn }) => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loader, setLoader] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  }

  function savePendingRecipe() {
    const pending = sessionStorage.getItem("pendingRecipe");
    if (!pending) return;

    const recipe = JSON.parse(pending);
    const users = JSON.parse(localStorage.getItem("recipeBoxUsers")) || [];
    const currentUser = JSON.parse(localStorage.getItem("recipeBoxCurrentUser"));
    const loggedUser = users.find((user) => user.id === currentUser);
    if (!loggedUser) return;

    loggedUser.recipies = loggedUser.recipies || [];
    if (!loggedUser.recipies.some((item) => item.idMeal === recipe.idMeal)) loggedUser.recipies.push(recipe);
    localStorage.setItem("recipeBoxUsers", JSON.stringify(users));
    sessionStorage.removeItem("pendingRecipe");
  }

  function handleLogin(e) {
    e.preventDefault();
    const newErrors = {};
    const users = JSON.parse(localStorage.getItem("recipeBoxUsers")) || [];
    const email = formData.email.trim().toLowerCase();
    const existingUser = users.find((user) => user.email.toLowerCase() === email);

    if (!email) newErrors.email = "Email is required";
    else if (!existingUser) newErrors.email = "User does not exist";
    if (!formData.password.trim()) newErrors.password = "Password is required";
    else if (existingUser && formData.password !== existingUser.password) newErrors.password = "Incorrect password";

    if (Object.keys(newErrors).length) return setErrors(newErrors);

    localStorage.setItem("recipeBoxCurrentUser", JSON.stringify(existingUser.id));
    savePendingRecipe();
    setLoader(true);
    setTimeout(() => {
      setLoader(false);
      setIsLoggedIn(true);
      navigate("/search");
    }, 600);
  }

  return (
    <AuthLayout title="Welcome Back!" message={<>Good food is always a<br />Good Idea.</>}>
      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-8">
        <h1 className="text-center text-4xl font-bold text-green-950 sm:text-5xl">Login</h1>
        <form onSubmit={handleLogin} className="mt-7 space-y-5">
          <div>
            <label htmlFor="email" className="mb-1.5 block text-sm font-semibold text-gray-700">Email</label>
            <div className="relative"><Mail className="absolute left-3 top-1/2 size-5 -translate-y-1/2 text-green-950" /><input id="email" type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email address" className="h-12 w-full rounded-xl border border-gray-300 pl-10 pr-4 outline-none focus:border-green-950 focus:ring-2 focus:ring-green-100" /></div>
            {errors.email && <p className="mt-1 text-xs font-semibold text-red-500">{errors.email}</p>}
          </div>

          <div>
            <label htmlFor="password" className="mb-1.5 block text-sm font-semibold text-gray-700">Password</label>
            <div className="relative"><Lock className="absolute left-3 top-1/2 size-5 -translate-y-1/2 text-green-950" /><input id="password" type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleChange} placeholder="Password" className="h-12 w-full rounded-xl border border-gray-300 pl-10 pr-11 outline-none focus:border-green-950 focus:ring-2 focus:ring-green-100" /><button type="button" onClick={() => setShowPassword((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">{showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}</button></div>
            {errors.password && <p className="mt-1 text-xs font-semibold text-red-500">{errors.password}</p>}
          </div>

          <div className="text-right"><button type="button" onClick={() => navigate("/forgot")} className="text-sm font-semibold text-green-950 hover:underline">Forgot Password?</button></div>
          <button type="submit" disabled={loader} className="flex h-12 w-full items-center justify-center rounded-xl bg-green-950 font-bold text-white transition hover:bg-green-900 disabled:opacity-70">{loader ? <span className="size-5 animate-spin rounded-full border-2 border-white border-t-transparent" /> : "Login"}</button>
          <p className="text-center text-sm text-gray-600">Don't have an account? <button type="button" onClick={() => navigate("/signup")} className="font-bold text-green-950 hover:underline">Sign Up</button></p>
        </form>
      </div>
    </AuthLayout>
  );
};
