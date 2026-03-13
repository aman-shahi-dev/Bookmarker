import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { PlaylistActions } from "../components/PlaylistActions";
import { useEffect } from "react";
import { useState } from "react";
import { toast } from "react-toastify";
import {
  generateAndSavePlaylist,
  fetchUserPlaylists,
} from "../store/playlistSlice";
import { extractPlaylistId } from "../services/youtube";

export const Home = () => {
  const { status, loading, userData } = useSelector((state) => state.auth);
  const [url, setUrl] = useState("");
  const dispatch = useDispatch();

  const { userPlaylists } = useSelector((state) => state.playlists);

  useEffect(() => {
    if (userData?.$id) {
      dispatch(fetchUserPlaylists(userData?.$id));
    }
  }, [dispatch, userData]);

  const handleGenerate = async (e) => {
    e.preventDefault();

    const playlistId = extractPlaylistId(url);
    if (!playlistId)
      return toast.error("Please enter a valid Youtube playlist link");

    const alreadyExists = userPlaylists?.find(
      (p) => p.playlistId === playlistId,
    );

    if (alreadyExists)
      return toast.error("You have already added this playlist!");

    const result = await dispatch(
      generateAndSavePlaylist({ url, userId: userData.$id }),
    );

    if (generateAndSavePlaylist.fulfilled.match(result)) {
      setUrl("");
      toast.success("Playlist generated and added to your playlists! ✅");
    } else {
      toast.error("Failed to generate playlist. Try again!");
    }
  };

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
          <h1 className="text-text mt-12 mb-6 text-2xl font-bold tracking-tight md:text-6xl">
            Welcome {userData?.name.split(" ")[0]} !
          </h1>
          <form
            onSubmit={handleGenerate}
            className="relative mt-2 flex w-full flex-col items-center justify-center gap-4 p-2 md:flex-row"
          >
            <input
              placeholder="Paste Youtube playlist link here..."
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
              className="bg-btn focus:bg-hover flex w-full max-w-lg rounded-md px-6 py-2 text-black placeholder:text-neutral-700 focus:outline-none"
            />

            <button
              disabled={loading}
              type="submit"
              className="flex cursor-pointer items-center justify-center rounded-md bg-[#3A3A3A] px-3 py-2 font-bold text-white transition hover:bg-[#2A2A2A] active:scale-95 disabled:opacity-50"
            >
              {loading ? "Generating..." : "Generate Playlist"}
            </button>
          </form>
          <PlaylistActions />
        </>
      ) : (
        <>
          <h1 className="text-text mt-35 mb-6 text-2xl font-bold tracking-tight text-shadow-lg md:text-6xl">
            Stop Scrolling. Start Learning
          </h1>
          <h2 className="mt-2 max-w-xl px-10 text-center text-lg tracking-tight text-neutral-400 md:text-xl">
            Turn any messy YouTube playlist into a beautiful, structured course
            in one click. Organize your learning, track your progress, and stay
            focused.
          </h2>
          <Link
            to="/signup"
            className="bg-btn hover:bg-hover mt-10 rounded-full bg-linear-to-br px-6 py-2 text-xl text-black transition duration-300 active:scale-95 md:px-10 md:py-4 md:text-2xl"
          >
            Try it now
          </Link>
        </>
      )}
    </div>
  );
};
