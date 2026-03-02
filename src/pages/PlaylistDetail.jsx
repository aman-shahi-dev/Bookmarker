import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import {
  fetchPlaylistVideos,
  resetActivePlaylist,
} from "../store/playlistSlice";
import { IconArrowLeft } from "@tabler/icons-react";

export const PlaylistDetail = ({ playlistName }) => {
  const { playlistId } = useParams();
  const dispatch = useDispatch();
  const { activeVideos, loading, error } = useSelector(
    (state) => state.playlists,
  );

  useEffect(() => {
    dispatch(fetchPlaylistVideos(playlistId));
    return () => dispatch(resetActivePlaylist()); // cleanup
  }, [dispatch, playlistId]);

  return (
    <div className="flex h-full w-full flex-col">
      <h1 className="p-4 text-center text-lg font-bold tracking-tight md:text-xl">
        {playlistName || "Playlist Name"}
      </h1>
      <hr className="border-neutral-600" />
      <div className="grid grid-cols-1 gap-4 overflow-y-auto p-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
        {activeVideos.map((video, idx) => (
          <div
            key={video.title || idx}
            className="flex h-80 w-full flex-col items-center justify-start rounded-xl border border-neutral-700 shadow-[0px_0px_10px_rgba(255,255,255,0.1)]"
          >
            <div className="h-2/3 w-full rounded-xl">
              <img
                src={video.snippet.thumbnails.medium.url}
                alt=""
                className="h-full w-full rounded-t-xl object-cover"
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
