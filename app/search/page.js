'use client'
import { use, useEffect, useState } from "react"
import { useRouter } from 'next/navigation';
import { set } from "zod";

const TMDB_API_KEY = 'ac43f8daf5b557f9c487e5ac5ad50bdb';

export default function Search({ name,setSearch }) {
  const [movies, setMovies] = useState([]);
  const [visibleCount, setVisibleCount] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [endPage, setEndPage] = useState(5);
  const router = useRouter();


useEffect(() => {
  if (name === '') {
    setMovies([]);
    return;
  }

  async function fetchSearchMovies() {
    const fetchPromises = []; 
    let newMovies = [];
   
    for (let i = currentPage; i <= endPage; i++) 
    {
      const url = `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&language=en-US&query=${encodeURIComponent(name)}&page=${i}`;
      fetchPromises.push(fetch(url).then(res => res.json()));
    } 

    const results = await Promise.all(fetchPromises);

    results.forEach(p => {
      p?.results?.length ? newMovies.push(...p.results) : console.warn("Invalid response:", p);
    });

    setMovies(newMovies);
   
 
  }

  fetchSearchMovies();
}, [name]);


    const handleClick = (movieId)=> {
         router.push(`/movie/${movieId}`)
          setMovies([]);
          setSearch('');
    }

  

    const handleShowMore = () => {
         if (currentPage >= 500) return;
         setVisibleCount(prevCount => prevCount + 15);
         setCurrentPage(prevPage => prevPage+endPage);
         setEndPage(prevEndPage => prevEndPage + 5);
    };

    

  return (
    <div className="relative">
      {movies.length > 0 && (
     <div className="absolute left-1/2 top-0 transform -translate-x-[71%] z-50 bg-black text-white p-4 w-80 max-h-96 overflow-y-auto shadow-xl">
          {movies.slice(0, visibleCount).map((movie) => (
            <div onClick={()=> handleClick(movie.id)} key={movie.id} className="mb-3 border-b border-gray-700 pb-2 flex items-center gap-2 cursor-pointer">
  
               <img
               src={
               movie.poster_path
               ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
              : '/no-poster.jpg'
              }
              alt={movie.title}
              className="w-full md:w-10 rounded-lg shadow-lg object-cover"
             />
             <p className="text-sm font-semibold">{movie.title}</p>
            </div>
          
          ))}
          <span className="cursor-pointer" onClick={()=> handleShowMore()} >Show More</span>
        </div>
      )}
    </div>
  );
}
