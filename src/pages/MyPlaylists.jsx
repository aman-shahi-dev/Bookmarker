import { useDispatch, useSelector } from "react-redux";
import { PlaylistCard } from "../components/PlaylistCard";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { fetchUserPlaylists, deletePlaylistThunk, updatePlaylistThunk } from "../store/playlistSlice";

export const MyPlaylists = () => {
  const { userData } = useSelector((state) => state.auth);
  const { userPlaylists } = useSelector((state) => state.playlists);

  const dispatch = useDispatch();

  useEffect(() => {
    if (userData?.$id) {
      dispatch(fetchUserPlaylists(userData?.$id));
    }
  }, [dispatch, userData]);

  const sortedPlaylists = [...userPlaylists].sort((a, b) => {
    if (a.isCompleted !== b.isCompleted) {
      return a.isCompleted ? 1 : -1; // Completed goes to the bottom
    }
    const pA = a.priority || 0;
    const pB = b.priority || 0;
    
    // If both have 0 priority, keep original order (or we could sort by date created)
    // If one has 0, the other goes first
    if (pA === 0 && pB !== 0) return 1;
    if (pB === 0 && pA !== 0) return -1;
    
    return pA - pB; // Ascending priority (1 is highest)
  });

  return (
    <>
      <div className="relative flex flex-col items-center justify-center p-2">
        <div className="md:text-md absolute top-0 mx-auto w-fit rounded-md rounded-t-none border-b border-neutral-700 bg-neutral-600 p-2 text-center text-xs font-light tracking-wide shadow-xs shadow-neutral-700">
          Recently created playlists
        </div>
        <Link
          to="/"
          className="bg-btn hover:bg-hover right-10 mx-auto mt-10 w-fit rounded-md px-3 py-1 text-black active:scale-95"
        >
          Back
        </Link>
      </div>
      <div className="grid grid-cols-1 gap-4 overflow-y-auto p-4 md:grid-cols-6 md:gap-6 lg:grid-cols-6">
        {sortedPlaylists.length > 0 ? (
          sortedPlaylists.map((playlist, index) => (
            <Link
              to={`/playlist/${playlist.playlistId}`}
              key={playlist.$id || index}
            >
              <PlaylistCard
                imgSrc={playlist.thumbnail}
                playlistTitle={playlist.title}
                playlistDescription={playlist.description}
                isCompleted={playlist.isCompleted}
                onDelete={() => dispatch(deletePlaylistThunk(playlist.$id))}
                onToggleComplete={() => dispatch(updatePlaylistThunk({ documentId: playlist.$id, data: { isCompleted: !playlist.isCompleted } }))}
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
    </>
  );
};
