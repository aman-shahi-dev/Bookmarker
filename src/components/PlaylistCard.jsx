export const PlaylistCard = ({ imgSrc, playlistNumber, playlistTitle }) => {
  return (
    <div className="flex h-80 w-full flex-col items-center justify-start rounded-xl border border-neutral-700 shadow-[0px_0px_10px_rgba(255,255,255,0.1)]">
      <div className="h-2/3 w-full rounded-xl">
        <img
          src={imgSrc}
          alt=""
          className="h-full w-full rounded-t-xl object-cover"
        />
      </div>
      <div className="flex flex-1 flex-col items-center justify-evenly p-2 md:p-4">
        <h1 className="mx-auto w-fit rounded-full bg-neutral-400 px-3 py-0.5 text-center text-xs font-bold text-black">
          Playlist {playlistNumber}
        </h1>
        <h2 className="mb-4 truncate px-2 text-center text-sm font-bold text-wrap md:mb-6">
          {playlistTitle}
        </h2>
      </div>
    </div>
  );
};
