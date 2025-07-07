'use client'

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const router = useRouter();

    async function handleSubmit(e) {
        e.preventDefault();
        setError('');
 

        const res = await fetch('/api/login', {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        
        });
        console.log("res", res.ok);
        if (res.ok) {
            console.log("Result is okay", res.ok);
            router.push('/home');
        }
        else {
            const data = await res.json();
            setError(data.error || 'Some errors happened');
        }
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
            <form onSubmit={handleSubmit}
                className="bg-white shadow-md rounded px-8 pt-6 pb-8 w-full max-w-md"
            >
                <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

                <input type="text"
                    placeholder="Username"
                    className="w-full mb-4 px-4 py-2 border rounded"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />

                <input type="password"
                    placeholder="Password"
                    className="w-full mb-4 px-4 py-2 border rounded"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

                <button type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                >
                    Sign IN
                </button>
                <p className="text-center text-gray-600 mt-4">
                    Don't have an account?{' '}
                    <a href="/register" className="text-blue-600 hover:underline">
                        Register
                    </a>
                </p>
            </form>
        </div>
    )
}