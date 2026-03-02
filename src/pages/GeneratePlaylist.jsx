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
        className="relative mt-2 flex w-full flex-col items-center justify-center gap-4 p-4 md:flex-row"
      >
        <Link
          to="/"
          className="left-10 rounded-full bg-btn p-2 text-black hover:bg-hover active:scale-95 md:absolute lg:left-20"
        >
          <IconArrowLeft />
        </Link>

        <input
          placeholder="Paste Youtube playlist link here..."
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required
          className="flex w-full max-w-lg rounded-full bg-btn px-6 py-2 text-black placeholder:text-neutral-700 focus:bg-hover focus:outline-none"
        />

        <button
          disabled={loading}
          type="submit"
          className="cursor-pointer rounded-full bg-[#3A3A3A] px-8 py-2 font-bold text-white transition hover:bg-[#2A2A2A] active:scale-95 disabled:opacity-50"
        >
          {loading ? "Generating..." : "Generate Playlist"}
        </button>
      </form>

      <hr className="border-neutral-600" />

      <div className="grid grid-cols-1 gap-4 overflow-y-auto p-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
        {userPlaylists.length > 0 ? (
          userPlaylists.map((playlist, index) => (
            <Link
              to={`/playlist/${playlist.playlistId}`}
              key={playlist.$id || index}
            >
              <PlaylistCard
                imgSrc={playlist.thumbnail}
                playlistNumber={index + 1}
                playlistTitle={playlist.title}
              />
            </Link>
          ))
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center py-20 text-neutral-500">
            <p className="text-xl">No playlists generated yet.</p>
            <p className="text-sm">Paste a link above to start learning!</p>
          </div>
        )}
      </div>
    </div>
  );
};
