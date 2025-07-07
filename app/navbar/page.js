'use client'
import Link from 'next/link';
import Image from 'next/image';
 import { useState } from 'react';
import Search from '../search/page';

export default function Navbar() {

    const [seacrh,setSearch]=useState('');

    const handleChange = (e)=> {
        setSearch(e.target.value)
    }

  return (
    <> 
    <nav className="bg-black text-white px-6 py-4 shadow-md w-full">
      <ul className="flex items-center justify-center gap-8 max-w-5xl mx-auto text-lg">
        
        <li className="flex items-center gap-3">
          <Image src="/home.png" alt="Home" width={28} height={28}  />
          <Link href="/home" className="hover:underline">Home</Link>
        </li>

        <li className="w-80">
          <input
            type="text"
            value={seacrh}
            onChange={handleChange}
            placeholder="Search..."
            className="w-full px-4 py-2 rounded bg-gray-800 text-white text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </li>

        <li className="flex items-center gap-3">
          <Image src="/user.png" alt="Profile" width={28} height={28} className="invert" />
          <Link href="/profile" className="hover:underline">Profile</Link>
        </li>

        <li className="flex items-center gap-3">
          <Image src="/watchlist.png" alt="Watchlist" width={28} height={28} className="invert" />
          <Link href="/watchlist" className="hover:underline">Watchlist</Link>
        </li>

      </ul>
    
    </nav>
    <Search name={seacrh} setSearch={setSearch} />
 </>
 
  );
}
