import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';

function MovieCard({ movie, watchlistId }) {
  const router = useRouter();


  const [isInWatchlist, setIsInWatchlist] = useState(false);

  useEffect(() => {
    if (Array.isArray(watchlistId) && movie?.id) {
      const found = watchlistId.some(item => item.movieId === String(movie.id));
      setIsInWatchlist(found);
    }
  }, [watchlistId, movie?.id]);

  const handleClick = () => {
    router.push(`/movie/${movie.id}`);
  };

  const handleToggleWatchlist = async (movieId) => {
    try {
      if (!isInWatchlist) {
        const res = await fetch(`/api/watchlist`, {
          method: "POST",
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ movieId }),
        });
        if (!res.ok) throw new Error("Failed to add movie to watchlist");
        setIsInWatchlist(true);
        console.log("Movie added to watchlist successfully");
      } else {
        const res = await fetch(`/api/watchlist`, {
          method: "DELETE",
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ movieId }),
        });
        if (!res.ok) throw new Error("Failed to remove movie from watchlist");
        setIsInWatchlist(false);
        console.log("Movie removed from watchlist successfully");
      }
    } catch (error) {
      console.error("Error updating watchlist:", error);
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-xl overflow-hidden transform hover:scale-101 transition duration-300">
      <img
        src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : '/no-poster.jpg'}
        alt={movie.title}
        className="w-full h-auto object-contain bg-black"
      />
      <div className="p-4">
        <span
          onClick={handleClick}
          className="cursor-pointer font-semibold text-md text-gray-800 line-clamp-2 h-12 overflow-hidden block"
        >
          {movie.title}
        </span>
        <img
          onClick={() => handleToggleWatchlist(movie.id)}
          className="cursor-pointer transition-transform duration-200 hover:scale-110 hover:brightness-125 mt-5"
          src={isInWatchlist ? "/watchlistAdded.png" : "/watchlist.png"}
          alt="Watchlist"
          width="28"
          height="28"
        />
        <div className="flex justify-between items-center mt-6 text-sm text-gray-600">
          <span className="text-yellow-500 font-semibold">★ {movie.vote_average?.toFixed(1)}</span>
          <span className="text-gray-500">{movie.release_date?.split('-')[0]}</span>
        </div>
      </div>
    </div>
  );
}

export default React.memo(MovieCard);
