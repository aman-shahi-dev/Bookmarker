import { PlaylistCard } from "../components/PlaylistCard";
import { IconArrowLeft } from "@tabler/icons-react";
import { Link } from "react-router-dom";
import {
  generateAndSavePlaylist,
  fetchUserPlaylists,
} from "../store/playlistSlice";
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { extractPlaylistId } from "../services/youtube";
import { toast } from "react-toastify";

export const GeneratePlaylist = () => {
  const [url, setUrl] = useState("");
  const dispatch = useDispatch();

  const { loading, userPlaylists } = useSelector((state) => state.playlists);
  const { userData } = useSelector((state) => state.auth);

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

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
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
          className="flex cursor-pointer items-center justify-center rounded-md bg-[#3A3A3A] px-3 py-1 font-bold text-white transition hover:bg-[#2A2A2A] active:scale-95 disabled:opacity-50"
        >
          {loading ? "Generating..." : "Generate Playlist"}
        </button>
        <Link
          to="/"
          className="bg-btn hover:bg-hover right-10 rounded-md px-3 py-1 text-black active:scale-95 md:absolute lg:right-40"
        >
          Back
        </Link>
      </form>

      <hr className="border-neutral-600" />

    </div>
  );
};
