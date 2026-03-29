import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../store/authSlice";
import { useState } from "react";
import { toast } from "react-toastify";
import {
  loginWithGoogle,
  loginWithGithub,
  loginWithLinkedin,
} from "../services/appwrite/auth";
import {
  IconBrandGoogle,
  IconBrandGithub,
  IconBrandLinkedin,
} from "@tabler/icons-react";

export const Login = () => {
  const { loading } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await dispatch(login(formData));
      if (login.fulfilled.match(result)) {
        toast.success("Logged in successfully");
        navigate("/");
      } else {
        toast.error(result.error.message || "Login failed");
      }
    } catch (error) {
      toast.error(error.message || "Unexpected error");
    }
  };

  return (
    <div className="m-6 flex w-full max-w-2xl flex-col rounded-2xl border border-neutral-700 md:min-h-96 md:flex-row">
      <div className="relative w-full md:w-1/2">
        <div className="text-text absolute flex w-full animate-pulse items-center justify-center py-4 text-xl tracking-wide md:py-6 md:text-2xl">
          Login
        </div>
        <img
          src="https://images.unsplash.com/photo-1495909617868-3fda03e184ef?q=80&w=1202&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt=""
          className="h-48 w-full rounded-2xl rounded-b-none object-cover md:h-full md:min-h-64 md:rounded-r-none"
        />
      </div>

      <div className="flex flex-1 flex-col items-center justify-center rounded-2xl rounded-t-none px-4 py-2 md:rounded-t-2xl md:rounded-l-none">
        <h1 className="text-text mb-3 text-lg md:mb-6 md:text-2xl mt-1">
          Fill the details below
        </h1>
        <form
          onSubmit={handleSubmit}
          className="flex w-full flex-col gap-3 md:gap-6"
        >
          <input
            name="email"
            value={formData.email}
            onChange={handleChange}
            type="email"
            placeholder="Email"
            required
            className="bg-btn w-full rounded-full px-6 py-2 text-black transition duration-300 placeholder:text-neutral-500 focus:scale-103 focus:shadow-[0px_0px_20px_rgba(255,255,255,1)] focus:outline-none"
          />
          <input
            name="password"
            value={formData.password}
            onChange={handleChange}
            type="password"
            placeholder="Password"
            required
            className="bg-btn w-full rounded-full px-6 py-2 text-black transition duration-300 placeholder:text-neutral-500 focus:scale-103 focus:shadow-[0px_0px_20px_rgba(255,255,255,1)] focus:outline-none focus:not-placeholder-shown:font-extrabold"
          />
          <button
            type="submit"
            className="bg-btn hover:bg-hover mx-auto mt-1 w-fit cursor-pointer rounded-full px-6 py-2 text-black transition duration-300 active:scale-95 md:mt-4"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Divider */}
        <div className="my-4 flex w-full items-center gap-3 md:my-6">
          <div className="h-px flex-1 bg-neutral-700" />
          <span className="text-sm text-neutral-500">or continue with</span>
          <div className="h-px flex-1 bg-neutral-700" />
        </div>

        {/* OAuth Buttons */}
        <div className="grid w-full grid-cols-3 gap-2">
          <button
            onClick={loginWithGoogle}
            className="bg-btn hover:bg-hover flex cursor-pointer items-center justify-center gap-1 rounded-full px-2 py-2 text-sm text-black transition duration-300 active:scale-95"
          >
            <IconBrandGoogle size={16} />
            <span className="hidden sm:inline">Google</span>
          </button>
          <button
            onClick={loginWithGithub}
            className="bg-btn hover:bg-hover flex cursor-pointer items-center justify-center gap-1 rounded-full px-2 py-2 text-sm text-black transition duration-300 active:scale-95"
          >
            <IconBrandGithub size={16} />
            <span className="hidden sm:inline">GitHub</span>
          </button>
          <button
            onClick={loginWithLinkedin}
            className="bg-btn hover:bg-hover flex cursor-pointer items-center justify-center gap-1 rounded-full px-2 py-2 text-sm text-black transition duration-300 active:scale-95"
          >
            <IconBrandLinkedin size={16} />
            <span className="hidden sm:inline">LinkedIn</span>
          </button>
        </div>

        <div className="mt-3 flex w-full items-center justify-center gap-4 p-1 md:mt-6">
          <h1 className="text-text text-sm md:text-md">
            Don't have an account?
          </h1>
          <Link
            to="/signup"
            className="bg-btn hover:bg-hover rounded-full px-4 py-2 text-sm text-black transition duration-300 active:scale-95"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
};
