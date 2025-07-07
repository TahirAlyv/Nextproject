import Link from "next/link";

export default function Page() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white shadow-lg rounded-2xl p-10 w-full max-w-sm text-center space-y-8">
        <h1 className="text-3xl font-bold text-gray-800">Welcome</h1>
        <p className="text-gray-500">Select an option to continue:</p>

        <div className="flex flex-col space-y-4">
          <Link
            href="/login"
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg transition"
          >
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}
