import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import {
  fetchPlaylistVideos,
  fetchUserPlaylists,
  resetActivePlaylist,
} from "../store/playlistSlice";
import { IconArrowLeft } from "@tabler/icons-react";

export const PlaylistDetail = () => {
  const { playlistId } = useParams();
  const dispatch = useDispatch();

  const { activeVideos, userPlaylists, loading, error } = useSelector(
    (state) => state.playlists,
  );
  const { userData } = useSelector((state) => state.auth);

  const currentPlaylist = userPlaylists.find(
    (p) => p.playlistId === playlistId,
  );

  const playlistName = currentPlaylist?.title || "Playlist Name";

  useEffect(() => {
    dispatch(fetchPlaylistVideos(playlistId));
    // Re-fetch playlists from DB if Redux was reset by a page refresh
    if (userPlaylists.length === 0 && userData?.$id) {
      dispatch(fetchUserPlaylists(userData.$id));
    }
    return () => dispatch(resetActivePlaylist()); // cleanup
  }, [dispatch, playlistId, userData]);

  return (
    <div className="flex h-full w-full flex-col">
      <div className="flex items-center justify-between px-4">
        <h1 className="p-4 text-center text-sm tracking-tight md:text-xl md:w-full">
          {playlistName || "Playlist Name"}
        </h1>
        <Link
          to="/generate-playlist"
          className="bg-btn hover:bg-hover  rounded-md px-3 py-1 text-black active:scale-95 md:absolute lg:right-40"
        >
          Back
        </Link>
      </div>
      <hr className="border-neutral-600" />
      <div className="grid grid-cols-1 gap-4 overflow-y-auto p-4 md:grid-cols-6 md:gap-6 lg:grid-cols-6">
        {activeVideos.map((video, idx) => (
          <div
            key={video.title || idx}
            className="flex h-full max-h-80 w-full flex-col items-center justify-start rounded-xl border border-neutral-700 bg-linear-to-br from-yellow-500 to-yellow-700 p-1 shadow-[0px_0px_10px_rgba(255,255,255,0.1)]"
          >
            <div className="h-full max-h-40 min-h-40 w-full rounded-xl p-1">
              <img
                src={video.snippet.thumbnails.medium.url}
                alt=""
                className="h-full w-full rounded-xl border border-yellow-600 object-cover shadow-2xl shadow-yellow-100"
              />
            </div>
            <div className="flex flex-1 flex-col items-center justify-evenly p-2 md:p-4">
              <h1 className="mb-4 truncate text-center text-sm font-bold text-wrap md:mb-6">
                {video.snippet.title}
              </h1>
              <a
                className="mx-auto w-fit rounded-full bg-neutral-600 px-3 py-0.5 transition duration-300 hover:bg-neutral-700 active:scale-95"
                href={`https://youtube.com/watch?v=${video.snippet.resourceId.videoId}`}
                target="_blank"
              >
                Watch
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
