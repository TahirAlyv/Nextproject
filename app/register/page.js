'use client'
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { useState } from 'react';

export default function RegisterPage() {
  const [error, setError] = useState('');
  const router = useRouter();

  const schema = z.object({
    username: z.string().min(3, 'Username must be at least 3 characters'),
    email: z.string().email('Invalid email'),
    password: z.string().min(5, 'Password must be at least 5 characters'),
    profileImage: z.any().optional()
  });

  const {
    register,
    handleSubmit, 
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  async function fetchSubmit(data) {
    setError('');
    try {
      const payload = {
        username: data.username,
        email: data.email,
        password: data.password,
      };

      const result = await axios.post('/api/register', payload);

      console.log("Qeydiyyat uğurlu:", result.data);
      router.push('/login'); 
      reset();
    } catch (error) {
      console.error("Qeydiyyat xətası:", error);
      setError(error.response?.data?.error || 'Registration failed');
    }
  } 

  return (
    <form onSubmit={handleSubmit(fetchSubmit)}>
      <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
        <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md space-y-6">
          <h2 className="text-3xl font-bold text-center text-gray-800">Register</h2>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div>
            <input 
              type="text"
              placeholder="Username.."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              {...register("username")}
            />
            {errors.username && (
              <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>
            )}
          </div>

          <div>
            <input
              type="text"
              placeholder="Email.."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>

          <div>
            <input
              type="password"
              placeholder="Password.."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              {...register("password")}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Create Account
          </button>
          <p className="text-center text-gray-600 mt-4">
            Already have an account?{' '}
            <a href="/login" className="text-blue-600 hover:underline">
              Login
            </a>
            </p>
        </div>
      </div>
    </form>
  )
}