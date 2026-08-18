import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import ImageInput from "../components/common/ImageInput";
import useAuth from "../hooks/useAuth";

const PASSWORD_RULES = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
// mirrors backend strength check — adjust to match your actual User model validator exactly

export default function Register() {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [avatar, setAvatar] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const password = watch("password");

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      await registerUser({ ...data, avatar });
      toast.success("Account created!");
      navigate("/");
    } catch (err) {
      console.log(err);
      toast.error(err?.response?.data?.message || "Registration failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">Create an account</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <ImageInput label="Avatar (optional)" onChange={setAvatar} />

        <div>
          <label className="block text-sm font-medium mb-1">Username</label>
          <input
            {...register("username", { required: "Username is required", minLength: { value: 3, message: "Min 3 characters" } })}
            className="w-full border rounded px-3 py-2 text-sm"
          />
          {errors.username && <p className="text-xs text-red-500 mt-1">{errors.username.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            {...register("email", { required: "Email is required" })}
            className="w-full border rounded px-3 py-2 text-sm"
          />
          {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Bio</label>
          <input
            type="text"
            {...register("bio")}
            className="w-full border rounded px-3 py-2 text-sm"
          />
          {errors.bio && <p className="text-xs text-red-500 mt-1">{errors.bio.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Password</label>
          <input
            type="password"
            {...register("password", {
              required: "Password is required",
              pattern: {
                value: PASSWORD_RULES,
                message: "Min 8 chars, one upper, one lower, one number",
              },
            })}
            className="w-full border rounded px-3 py-2 text-sm"
          />
          {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Confirm Password</label>
          <input
            type="password"
            {...register("confirmPassword", {
              required: "Please confirm your password",
              validate: (val) => val === password || "Passwords don't match",
            })}
            className="w-full border rounded px-3 py-2 text-sm"
          />
          {errors.confirmPassword && <p className="text-xs text-red-500 mt-1">{errors.confirmPassword.message}</p>}
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-blue-600 text-white py-2 rounded text-sm disabled:opacity-50"
        >
          {submitting ? "Creating account..." : "Sign up"}
        </button>
      </form>

      <p className="text-sm text-gray-500 mt-4">
        Already have an account? <Link to="/login" className="text-blue-600">Log in</Link>
      </p>
    </div>
  );
}