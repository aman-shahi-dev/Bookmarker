import { IconTrash, IconCheck } from "@tabler/icons-react";

export const PlaylistCard = ({
  imgSrc,
  playlistTitle,
  playlistDescription,
  isCompleted,
  onDelete,
  onToggleComplete,
}) => {
  const handleDelete = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onDelete) onDelete();
  };

  const handleToggleComplete = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onToggleComplete) onToggleComplete();
  };

  return (
    <div className={`relative flex h-full max-h-80 min-h-[320px] w-full flex-col items-center justify-between rounded-xl border p-1 transition-all duration-300 ${isCompleted ? 'bg-neutral-800/80 border-green-500 opacity-70 grayscale-[50%] shadow-[0px_0px_15px_rgba(34,197,94,0.4)]' : 'border-neutral-700 bg-[#ffffff]/30 shadow-[0px_0px_10px_rgba(255,255,255,0.1)]'}`}>
      
      {/* Top: Image */}
      <div className="h-full max-h-40 min-h-40 w-full rounded-xl p-1">
        <img
          src={imgSrc}
          alt={playlistTitle}
          className="h-full w-full rounded-xl border border-white/30 object-cover shadow-2xl shadow-white"
        />
      </div>

      {/* Middle: Text Content */}
      <div className="flex w-full flex-1 flex-col items-center justify-start overflow-hidden px-2 py-3">
        <h2 className={`w-full px-2 text-center text-sm font-bold wrap-break-word text-white ${playlistDescription ? 'line-clamp-1 mb-2' : 'line-clamp-2'}`}>
          {playlistTitle || "PLAYLIST NAME"}
        </h2>
        {playlistDescription && (
          <p className="w-full px-2 text-center text-xs font-medium text-neutral-300 wrap-break-word line-clamp-2">
            {playlistDescription}
          </p>
        )}
      </div>

      {/* Bottom: Action Icons */}
      <div className="flex w-full justify-end items-center gap-2 p-2">
        <button
          onClick={handleToggleComplete}
          className={`flex h-8 w-8 items-center justify-center rounded-full transition hover:scale-110 ${isCompleted ? 'bg-green-600 text-white shadow-md shadow-green-500/50' : 'bg-transparent text-white border border-white hover:border-green-500 hover:text-green-500'}`}
          title={isCompleted ? "Mark as Incomplete" : "Mark as Completed"}
        >
          <IconCheck size={18} stroke={1.5} />
        </button>
        <button
          onClick={handleDelete}
          className="flex h-8 w-8 items-center justify-center text-white transition hover:scale-110 hover:text-red-500 bg-transparent"
          title="Delete Playlist"
        >
          <IconTrash size={22} stroke={1.2} />
        </button>
      </div>
    </div>
  );
};



