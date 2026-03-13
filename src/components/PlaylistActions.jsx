import { Link } from "react-router-dom";
import { IconPlaylist, IconPlaylistAdd } from "@tabler/icons-react";

export const PlaylistActions = () => {
  return (
    <div className="mt-10 flex flex-col items-center justify-evenly gap-4 md:w-120 md:flex-row">
      <Link
        to="/my-playlists"
        className="bg-btn hover:bg-hover flex items-center justify-center gap-2 rounded-full px-6 py-4 text-sm font-bold text-black active:scale-95 md:text-xl"
      >
        <IconPlaylist /> My Playlists
      </Link>
    </div>
  );
};
