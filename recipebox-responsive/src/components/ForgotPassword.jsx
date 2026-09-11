import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthLayout } from "./AuthLayout";

export const ForgotPassword = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loader, setLoader] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "", cpassword: "" });
  const [errors, setErrors] = useState({});

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    const users = JSON.parse(localStorage.getItem("recipeBoxUsers")) || [];
    const email = formData.email.trim().toLowerCase();
    const user = users.find((item) => item.email.toLowerCase() === email);
    const newErrors = {};
    if (!email) newErrors.email = "Email is required";
    else if (!user) newErrors.email = "User does not exist";
    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 6) newErrors.password = "Password should be at least 6 characters";
    if (!formData.cpassword) newErrors.cpassword = "Confirm password is required";
    else if (formData.cpassword !== formData.password) newErrors.cpassword = "Passwords do not match";
    if (Object.keys(newErrors).length) return setErrors(newErrors);

    localStorage.setItem("recipeBoxUsers", JSON.stringify(users.map((item) => item.id === user.id ? { ...item, password: formData.password, cpassword: formData.cpassword } : item)));
    setLoader(true);
    setTimeout(() => { setLoader(false); setSuccess(true); setFormData({ email: "", password: "", cpassword: "" }); }, 600);
  }

  const inputClass = "h-12 w-full rounded-xl border border-gray-300 pl-10 pr-11 outline-none focus:border-green-950 focus:ring-2 focus:ring-green-100";

  return (
    <AuthLayout title="Forgot Password" message={<>No worries,<br />change your old password.</>}>
      <div className="relative rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-8">
        {success && <div className="mb-5 rounded-xl bg-green-100 px-4 py-3 text-center text-sm font-semibold text-green-800">Password changed successfully.</div>}
        <h1 className="text-center text-3xl font-bold text-green-950 sm:text-4xl">Set New Password</h1>
        <form onSubmit={handleSubmit} className="mt-7 space-y-5">
          <div><label htmlFor="email" className="mb-1.5 block text-sm font-semibold text-gray-700">Email</label><div className="relative"><Mail className="absolute left-3 top-1/2 size-5 -translate-y-1/2 text-green-950" /><input id="email" type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email address" className={inputClass} /></div>{errors.email && <p className="mt-1 text-xs font-semibold text-red-500">{errors.email}</p>}</div>
          <div><label htmlFor="password" className="mb-1.5 block text-sm font-semibold text-gray-700">New Password</label><div className="relative"><Lock className="absolute left-3 top-1/2 size-5 -translate-y-1/2 text-green-950" /><input id="password" type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleChange} placeholder="New password" className={inputClass} /><button type="button" onClick={() => setShowPassword((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">{showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}</button></div>{errors.password && <p className="mt-1 text-xs font-semibold text-red-500">{errors.password}</p>}</div>
          <div><label htmlFor="cpassword" className="mb-1.5 block text-sm font-semibold text-gray-700">Confirm New Password</label><div className="relative"><Lock className="absolute left-3 top-1/2 size-5 -translate-y-1/2 text-green-950" /><input id="cpassword" type={showConfirm ? "text" : "password"} name="cpassword" value={formData.cpassword} onChange={handleChange} placeholder="Confirm new password" className={inputClass} /><button type="button" onClick={() => setShowConfirm((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">{showConfirm ? <EyeOff className="size-5" /> : <Eye className="size-5" />}</button></div>{errors.cpassword && <p className="mt-1 text-xs font-semibold text-red-500">{errors.cpassword}</p>}</div>
          <button type="submit" disabled={loader} className="flex h-12 w-full items-center justify-center rounded-xl bg-green-950 font-bold text-white hover:bg-green-900 disabled:opacity-70">{loader ? <span className="size-5 animate-spin rounded-full border-2 border-white border-t-transparent" /> : "Update Password"}</button>
          <p className="text-center text-sm text-gray-600">Go back to login? <button type="button" onClick={() => navigate("/login")} className="font-bold text-green-950 hover:underline">Login</button></p>
        </form>
      </div>
    </AuthLayout>
  );
};
