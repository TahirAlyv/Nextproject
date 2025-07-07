'use client';
import { useEffect,useState } from "react";
import { useRouter } from 'next/navigation';
 
export default function Watchlist() {
    const [watchlistId , setWatchlistId] = useState([]);
    const [movielist, setMovielist] = useState([]);
    const TMDB_API_KEY = 'ac43f8daf5b557f9c487e5ac5ad50bdb'

    const router = useRouter();

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


    useEffect(() => {
    async function fetchMovies() {
        if (!watchlistId || watchlistId.length === 0) return;

        const moviePromises = watchlistId.map(async (item) => {
            const res = await fetch(`https://api.themoviedb.org/3/movie/${item.movieId}?api_key=${TMDB_API_KEY}&language=en-US`);
            if (!res.ok) {
                console.log("Failed to fetch movie details for ID:", item.movieId);
                return null;
            }
            return res.json();
        });

        const movies = await Promise.all(moviePromises);
        const filteredMovies = movies.filter(movie => movie !== null);
        setMovielist(filteredMovies);
        console.log("Fetched movies:", filteredMovies); 
    }

    fetchMovies();
}, [watchlistId]);


    const handleClick = (movieId)=> {
         router.push(`/movie/${movieId}`)
    }

    const handleRemove = async (movieId) => {
        const res = await fetch('/api/watchlist', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ movieId }),
        });
        if (!res.ok) {
            console.log("Failed to remove movie from watchlist");
            return;
        }
        const data = await res.json();
        console.log("Movie removed from watchlist:", data);

        const newMovieList = movielist.filter(movie => movie.id !== movieId);
        setMovielist(newMovieList);
    }

    return (
         <div className="flex flex-col items-center p-6  min-h-[calc(100vh-80px)] bg-gray-100">
              <div className="w-[1300px] h-auto max-h-[calc(100vh-120px)] bg-white rounded-xl shadow-xl p-6 overflow-y-auto overflow-x-hidden ">
               {movielist.length > 0 ? (
                 <div className="flex flex-col gap-6">
                   {movielist.map((movie) => (
                     <div key={movie.id} className="flex bg-white rounded-lg shadow-lg overflow-hidden ">
                       <img
                         src={
                           movie.poster_path
                             ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                             : '/no-poster.jpg'
                         }
                         alt={movie.title}
                         className="w-32 h-48 object-cover"
                       />
                       <div className="p-4 flex flex-col">
                         <span onClick={()=> handleClick(movie.id)} className="cursor-pointer font-semibold text-lg mb-2">{movie.title}</span>
                         <span className="text-gray-600 text-sm line-clamp-4">{movie.overview}</span>
                       </div>

                       <div className="ml-auto flex items-start self-end mb-1">
                            <button onClick={()=> handleRemove(movie.id)} className="cursor-pointer bg-red-900 text-white px-4 py-2 rounded hover:bg-red-800 ">Remove</button>
                        </div>
                        
                     </div>
                   ))}
                 </div>
               ) : (
                <div className="w-full h-40 flex justify-center items-center">
                    <div>Movie not found</div>
                </div>
               )}
             </div>
        </div>

    );
}