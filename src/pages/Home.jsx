import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { PlaylistActions } from "../components/PlaylistActions";

export const Home = () => {
  const { status, loading, userData } = useSelector((state) => state.auth);

  if (loading)
    return (
      <h1 className="flex flex-1 animate-pulse flex-col items-center justify-center bg-black text-2xl text-white md:text-4xl">
        Loading...
      </h1>
    );

  return (
    <div className="flex flex-1 flex-col items-center justify-start">
      {status ? (
        <>
          <h1 className="mt-20 mb-6 text-2xl font-bold tracking-tight text-text md:text-6xl">
            Welcome {userData?.name.split(" ")[0]} !
          </h1>
          <PlaylistActions />
        </>
      ) : (
        <>
          <h1 className="mt-35 mb-6 text-2xl font-bold tracking-tight text-text text-shadow-lg md:text-6xl">
            Stop Scrolling. Start Learning
          </h1>
          <h2 className="mt-2 max-w-xl px-10 text-center text-lg tracking-tight text-neutral-400 md:text-xl">
            Turn any messy YouTube playlist into a beautiful, structured course
            in one click. Organize your learning, track your progress, and stay
            focused.
          </h2>
          <Link
            to="/signup"
            className="mt-10 rounded-full bg-btn bg-linear-to-br px-6 py-2 text-xl text-black transition duration-300 hover:bg-hover active:scale-95 md:px-10 md:py-4 md:text-2xl"
          >
            Try it now
          </Link>
        </>
      )}
    </div>
  );
};
