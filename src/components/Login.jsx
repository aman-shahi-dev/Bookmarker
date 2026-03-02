import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../store/authSlice";
import { useState } from "react";
import { toast } from "react-toastify";

export const Login = () => {
  const { loading } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

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
    <div className="flex w-full max-w-2xl flex-1 flex-col rounded-2xl border border-neutral-700 md:flex-row">
      <div className="relative w-full md:w-1/2">
        <div className="absolute flex w-full animate-pulse tracking-wide text-text items-center justify-center py-4 text-xl md:py-6 md:text-2xl">
          Login
        </div>
        <img
          src="https://images.unsplash.com/photo-1495909617868-3fda03e184ef?q=80&w=1202&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt=""
          className="h-full w-full rounded-2xl rounded-b-none md:rounded-r-none"
        />
      </div>
      <div className="flex flex-1 flex-col items-center justify-center rounded-2xl rounded-t-none p-4 md:rounded-t-2xl md:rounded-l-none">
        <h1 className="mb-4 text-lg text-text md:mb-10 md:text-2xl">
          Fill the details below
        </h1>

        <form
          onSubmit={handleSubmit}
          className="flex w-full flex-col gap-4 md:gap-6"
        >
          <input
            name="email"
            value={formData.email}
            onChange={handleChange}
            type="email"
            placeholder="Email"
            required
            className="w-full rounded-full bg-btn px-6 py-2 text-black transition duration-300 placeholder:text-neutral-500 focus:scale-103 focus:shadow-[0px_0px_20px_rgba(255,255,255,1)] focus:outline-none"
          />
          <input
            name="password"
            value={formData.password}
            onChange={handleChange}
            type="password"
            placeholder="Password"
            required
            className="w-full rounded-full bg-btn px-6 py-2 text-black transition duration-300 placeholder:text-neutral-500 focus:scale-103 focus:shadow-[0px_0px_20px_rgba(255,255,255,1)] focus:outline-none focus:not-placeholder-shown:font-extrabold"
          />
          <button
            type="submit"
            className="mx-auto mt-2 w-fit text-black cursor-pointer rounded-full bg-btn px-6 py-2 transition duration-300 hover:bg-hover active:scale-95 md:mt-4"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <div className="mt-4 flex w-full items-center justify-center gap-4 md:mt-6">
          <h1 className="text-sm text-text md:text-lg">
            Don't have an account?
          </h1>
          <Link
            to="/signup"
            className="rounded-full bg-btn px-4 py-2 text-sm text-black transition duration-300 hover:bg-hover active:scale-95"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
};
