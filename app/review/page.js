import { useEffect, useState } from "react";
import Image from "next/image";
import useSWR from 'swr';

const fetcher = (url) => fetch(url).then((res) => res.json());
export default function Review({ movieId }) {
  const {
    data,
    error,
    isLoading,
  } = useSWR(movieId ? `/api/review/${movieId}` : null, fetcher, {
    refreshInterval: 5000,
  });

  const reviews = Array.isArray(data) ? data : [];

  return (
    <div className="flex flex-col mt-16 h-[35rem] w-[60rem] bg-gradient-to-b from-white to-gray-100 border border-gray-200 rounded-2xl shadow-xl transition-shadow p-6 overflow-y-auto">
      <div className=" sticky top-0 bg-white text-gray-700 text-2xl font-bold mb-4 border-b border-gray-300 pb-2 flex justify-between">
        <p>Comments</p>
        <p>Rating</p>
      </div>

      <div>
        {reviews.map((m) => (
          <div
            key={m.id}
            className="flex flex-col mt-5 border-b border-gray-200 pb-4 last:border-b-0 "
          >
            <div className="flex items-center gap-3 mb-2">
              <Image
                src={m.user.profileImage || "/defaultProfile.png"}
                alt="Profile"
                width={30}
                height={30}
                className="rounded-full border border-gray-300 bg-white"
              />
              <p className="font-sans font-bold text-lg text-gray-900">
                {m.user.username}
              </p>
              <span className="text-gray-500 text-xs font-light whitespace-nowrap text-left">
                {new Date(m.createdAt).toLocaleDateString("az-AZ") + " \u00A0/ \u00A0" + new Date(m.createdAt).toLocaleTimeString("az-AZ", {
                hour: "2-digit",
                minute: "2-digit",
                })}
              </span>
              <div className="ml-auto flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className={`text-yellow-400 text-2xl ${
                      star <= m.rating ? "opacity-100" : "opacity-30"
                    }`}
                  >
                    ★
                  </span>
                ))}
              </div>
            </div>

            <p className="text-gray-700 ml-11">{m.text}</p>
          </div>
        ))}
      </div>

     {reviews.length === 0 && (
        <p className="text-center text-gray-500 mt-10">No Comments</p>
        )}
    </div>
  );
}
