'use client';

import { useEffect,useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from 'js-cookie';

export default function ProfilePage() {
  const [user, setUser] = useState([]);
  const router = useRouter();

  useEffect(()=> {
    const fetchUser = async () => {
      try {
        const response = await fetch('/api/profile', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }

        const data = await response.json();
        setUser(data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUser();
  
  },[])

  const handleEdit = () => {
    router.push('/profiledit');
  };

    const handleNavigate = () => {
    router.push('/watchlist');
  };

const handleLogout = async () => {
  await fetch('/api/logout', { method: 'POST' });
  router.push('/login');
};

  return (
    <div className="flex flex-col items-center px-4 bg-gray-100 h-screen">
    <div className="flex flex-col justify-between gap-1 w-[800px] h-[300px] shadow-lg rounded-xl p-6 bg-white mt-20">
    <div className="flex flex-col gap-4">
      <div className="flex gap-4">
        <img 
        src={user?.profileImage || "/defaultprofile.png"} 
        alt="Profil Şəkli"
        className="rounded-full w-[120px] h-[120px] object-cover"
        />
        <div className="flex justify-between w-full items-center">
              <div className="flex flex-col items-start">
                <span className="text-2xl font-semibold">{user.username}</span>
                <span className="text-sm font-sans text-gray-700 font-semibold">{user.gmail}</span>
              </div>
                <span onClick={()=> handleEdit()} className=" text-center cursor-pointer text-2xl font-semibold rounded bg-green-600 hover:bg-green-700 text-white p-2 font-poppins text-[20px] h-[45px]  w-[55px]">
                Edit
              </span>
        </div>
      </div>

    </div>
    <div className="flex justify-between items-center mt-4">
      <span onClick={()=> handleNavigate()} className="cursor-pointer text-center w-[80px] text-white rounded bg-yellow-700 p-1 ">Watchlist</span>
      <span onClick={()=> handleLogout()} className="cursor-pointer text-center w-[80px] text-white rounded bg-red-700 p-1 ">Logout</span>
    </div>
  </div>
    
</div>

  );
}