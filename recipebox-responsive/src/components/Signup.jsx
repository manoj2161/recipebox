import { Eye, EyeOff, Lock, Mail, User } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthLayout } from "./AuthLayout";

export const Signup = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loader, setLoader] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", password: "", cpassword: "" });
  const [errors, setErrors] = useState({});

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  }

  function handleSignup(e) {
    e.preventDefault();
    const newErrors = {};
    const users = JSON.parse(localStorage.getItem("recipeBoxUsers")) || [];
    const email = formData.email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!email) newErrors.email = "Email is required";
    else if (!emailRegex.test(email)) newErrors.email = "Enter a valid email";
    else if (users.some((user) => user.email.toLowerCase() === email)) newErrors.email = "User already exists";
    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 6) newErrors.password = "Password should be at least 6 characters";
    if (!formData.cpassword) newErrors.cpassword = "Confirm password is required";
    else if (formData.cpassword !== formData.password) newErrors.cpassword = "Passwords do not match";

    if (Object.keys(newErrors).length) return setErrors(newErrors);

    users.push({ id: crypto.randomUUID(), name: formData.name.trim(), email, password: formData.password, cpassword: formData.cpassword, recipies: [] });
    localStorage.setItem("recipeBoxUsers", JSON.stringify(users));
    setLoader(true);
    setTimeout(() => { setLoader(false); navigate("/login"); }, 600);
  }

  const fieldClass = "h-12 w-full rounded-xl border border-gray-300 pl-10 pr-4 outline-none focus:border-green-950 focus:ring-2 focus:ring-green-100";

  return (
    <AuthLayout title="Create Your Account" message={<>Start your recipe<br />journey.</>}>
      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-8">
        <h1 className="text-center text-4xl font-bold text-green-950 sm:text-5xl">Sign Up</h1>
        <form onSubmit={handleSignup} className="mt-7 space-y-4">
          <div><label htmlFor="name" className="mb-1.5 block text-sm font-semibold text-gray-700">Full Name</label><div className="relative"><User className="absolute left-3 top-1/2 size-5 -translate-y-1/2 text-green-950" /><input id="name" name="name" value={formData.name} onChange={handleChange} placeholder="Full name" className={fieldClass} /></div>{errors.name && <p className="mt-1 text-xs font-semibold text-red-500">{errors.name}</p>}</div>
          <div><label htmlFor="email" className="mb-1.5 block text-sm font-semibold text-gray-700">Email</label><div className="relative"><Mail className="absolute left-3 top-1/2 size-5 -translate-y-1/2 text-green-950" /><input id="email" type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email address" className={fieldClass} /></div>{errors.email && <p className="mt-1 text-xs font-semibold text-red-500">{errors.email}</p>}</div>
          <div><label htmlFor="password" className="mb-1.5 block text-sm font-semibold text-gray-700">Password</label><div className="relative"><Lock className="absolute left-3 top-1/2 size-5 -translate-y-1/2 text-green-950" /><input id="password" type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleChange} placeholder="At least 6 characters" className={fieldClass + " pr-11"} /><button type="button" onClick={() => setShowPassword((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">{showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}</button></div>{errors.password && <p className="mt-1 text-xs font-semibold text-red-500">{errors.password}</p>}</div>
          <div><label htmlFor="cpassword" className="mb-1.5 block text-sm font-semibold text-gray-700">Confirm Password</label><div className="relative"><Lock className="absolute left-3 top-1/2 size-5 -translate-y-1/2 text-green-950" /><input id="cpassword" type={showConfirm ? "text" : "password"} name="cpassword" value={formData.cpassword} onChange={handleChange} placeholder="Confirm password" className={fieldClass + " pr-11"} /><button type="button" onClick={() => setShowConfirm((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">{showConfirm ? <EyeOff className="size-5" /> : <Eye className="size-5" />}</button></div>{errors.cpassword && <p className="mt-1 text-xs font-semibold text-red-500">{errors.cpassword}</p>}</div>
          <button type="submit" disabled={loader} className="flex h-12 w-full items-center justify-center rounded-xl bg-green-950 font-bold text-white hover:bg-green-900 disabled:opacity-70">{loader ? <span className="size-5 animate-spin rounded-full border-2 border-white border-t-transparent" /> : "Create Account"}</button>
          <p className="text-center text-sm text-gray-600">Already have an account? <button type="button" onClick={() => navigate("/login")} className="font-bold text-green-950 hover:underline">Login</button></p>
        </form>
      </div>
    </AuthLayout>
  );
};
