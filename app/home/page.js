'use client';
import { useEffect, useState } from "react";
import MovieCard from "../movie/page";

const TMDB_API_KEY =  'ac43f8daf5b557f9c487e5ac5ad50bdb'

export default function Home() {

  const [popularMovies, setPopularMovies] = useState([]);
  const [topRatedMovies, setTopRatedMovies] = useState([]);
  const [watchlistId , setWatchlistId] = useState([]);
  
  useEffect(() => {
    const fetchMovies = async () => {
      const resPopular = await fetch(
        `https://api.themoviedb.org/3/movie/popular?api_key=${TMDB_API_KEY}&language=en-US&page=1`
      );
      const dataPopular = await resPopular.json();
      setPopularMovies(dataPopular.results);

      const resTopRated = await fetch(
        `https://api.themoviedb.org/3/movie/top_rated?api_key=${TMDB_API_KEY}&language=en-US&page=1`
      );
      const dataTopRated = await resTopRated.json();
      setTopRatedMovies(dataTopRated.results);
    };

    fetchMovies();
  }, []);



    useEffect(()=> {
      async function fetchWatchlist() {
          const res = await fetch('/api/watchlist', {
              method: 'GET',
              headers: {
                  'Content-Type': 'application/json',
              },
          });

          if (!res.ok) {
              console.log("Failed to fetch watchlist");
              return;
          }

          const data = await res.json();
          setWatchlistId(data.watchlist);
          console.log("Watchlist data:", data.watchlist);
      }
       fetchWatchlist(); 
  },[]);
  

 
return (
<div className="mt-10 flex items-center flex-col">

 
  <div className="w-full max-w-[1600px] px-6 mx-auto">
    <div className="flex items-center mb-2">
      <span className="text-2xl text-green-800 font-bold mr-2">|</span>
      <span className="text-xl font-semibold text-shadow-xs">Popular Movies</span>
    </div>
  </div>

 
  <div className="grid grid-cols-8 gap-3 p-6 max-w-[1600px] mx-auto">
    {popularMovies.slice(0, 16).map((p_movie) => (
      <MovieCard key={p_movie.id} movie={p_movie} watchlistId={watchlistId} />
    ))}
  </div>

 
  <div className="w-full max-w-[1600px] px-6 mx-auto">
    <div className="flex items-center mb-2">
      <span className="text-2xl text-green-800 font-bold mr-2">|</span>
      <span className="text-xl font-semibold text-shadow-xs">Top Rated Movies</span>
    </div>
  </div>

 
  <div className="grid grid-cols-8 gap-3 p-6 max-w-[1600px] mx-auto">
    {topRatedMovies.slice(0, 16).map((movie) => (
    <MovieCard key={movie.id} movie={movie} watchlistId={watchlistId} />
  ))}
  </div>

</div>

);

}