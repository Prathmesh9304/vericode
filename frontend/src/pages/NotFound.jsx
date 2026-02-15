import { Link } from 'react-router-dom';
import { Home, AlertTriangle } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[20%] w-[500px] h-[500px] bg-red-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[10%] w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[120px]" />
      </div>

      <div className="text-center z-10">
        <div className="flex justify-center mb-6">
            <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/10">
                <AlertTriangle className="w-12 h-12 text-red-500" />
            </div>
        </div>
        
        <h1 className="text-9xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500 mb-4">
          404
        </h1>
        
        <h2 className="text-3xl font-bold mb-4">Page Not Found</h2>
        
        <p className="text-gray-400 max-w-md mx-auto mb-8 text-lg">
          Oops! The page you're looking for seems to have vanished into the void.
        </p>

        <Link
          to="/"
          className="inline-flex items-center gap-2 px-8 py-3 bg-white text-black rounded-full font-semibold transition-transform hover:scale-105 active:scale-95"
        >
          <Home className="w-5 h-5" />
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
