'use client';

import useSWR from 'swr';
import { useParams } from 'next/navigation';
import Comment from '@/app/comment/page';
import Review from '@/app/review/page';

const TMDB_API_KEY =  'ac43f8daf5b557f9c487e5ac5ad50bdb'
const fetcher = (url) => fetch(url).then((res) => res.json());

export default function MovieDetailPage() {
  const { id } = useParams();

  const { data, error, isLoading } = useSWR(
    `https://api.themoviedb.org/3/movie/${id}?api_key=${TMDB_API_KEY}&language=en-US`,
    fetcher
  );

  if (isLoading) return <div className="p-6 text-center">Yüklənir...</div>;
  if (error) return <div className="p-6 text-red-500">Film məlumatı alınmadı.</div>;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex flex-col md:flex-row gap-8 bg-white shadow-xl rounded-xl overflow-hidden p-4">
        {/* Poster */}
        <img
          src={
            data.poster_path
              ? `https://image.tmdb.org/t/p/w500${data.poster_path}`
              : '/no-poster.jpg'
          }
          alt={data.title}
          className="w-full md:w-64 rounded-lg shadow-lg object-cover"
        />

        {/* Movie Info */}
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{data.title}</h1>
            <p className="text-gray-600 text-sm italic mb-4">
              {data.tagline || 'No tagline available.'}
            </p>

            <p className="text-gray-800 mb-4 leading-relaxed">{data.overview}</p>

            <div className="flex flex-wrap gap-4 text-sm text-gray-700">
              <p>
                <span className="font-semibold">🎬 Janr:</span>{' '}
                {data.genres?.map((g) => g.name).join(', ') || 'Yoxdur'}
              </p>
              <p>
                <span className="font-semibold">📅 İl:</span>{' '}
                {data.release_date?.split('-')[0] || 'Yoxdur'}
              </p>
              <p>
                <span className="font-semibold">🕒 Uzunluq:</span>{' '}
                {data.runtime ? `${data.runtime} dəq.` : 'Naməlum'}
              </p>
              <p>
                <span className="font-semibold text-yellow-500">⭐ IMDB:</span>{' '}
                {data.vote_average?.toFixed(1)} / 10
              </p>
            </div>
          </div>

          <div className="mt-6 text-xs text-gray-400">
            Film ID: {data.id} — <span className="uppercase">{data.original_language}</span>
          </div>
        </div>
      </div>

      <Review movieId={id}/>
      <Comment movieId={id}/> 
    </div>

    
  );
}
