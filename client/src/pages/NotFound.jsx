import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="w-screen h-screen bg-black flex items-center justify-center">
      <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-1 rounded-xl shadow-lg">
        <div className="bg-black text-center text-white p-10 rounded-xl w-[90vw] max-w-md">
          <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 mb-4">
            404
          </h1>
          <h2 className="text-2xl font-semibold mb-2">Page Not Found</h2>
          <p className="text-gray-400 mb-6">
            The page you're looking for doesn't exist.
          </p>
          <Link
            to="/home"
            className="inline-block px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium rounded-lg hover:opacity-90 transition-opacity"
          >
            Go to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default NotFound;