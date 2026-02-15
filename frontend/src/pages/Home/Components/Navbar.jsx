import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Menu, X, LogOut, User } from "lucide-react";
import { useAuth } from "../../../context/AuthContext";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
      logout();
      navigate('/');
  };

  const navLinks = [
    { name: "Pricing", path: "/pricing" },
    { name: "FAQ", path: "/faq" },
    { name: "About", path: "/about" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-900/80 backdrop-blur-md border-b border-white/5">
      <div className="w-full px-6 md:px-12">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center group">
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-blue-500 group-hover:opacity-80 transition-opacity font-mono">
              &lt;/&gt;
            </span>
            <span className="ml-2 text-xl font-bold text-white hidden sm:block">VeriCode</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className="relative text-sm font-medium text-gray-400 hover:text-white transition-colors py-1 group"
                >
                  {link.name}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-emerald-400 transition-all duration-300 group-hover:w-full" />
                </Link>
            ))}

            {user ? (
                <div className="flex items-center gap-4 border-l border-white/10 pl-6">
                    <div className="text-sm font-medium text-emerald-400 flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center">
                            <User className="w-4 h-4" />
                        </div>
                        {user.username}
                    </div>
                    <button 
                        onClick={handleLogout}
                        className="p-2 text-gray-400 hover:text-white transition-colors"
                        title="Logout"
                    >
                        <LogOut className="w-4 h-4" />
                    </button>
                    <Link
                        to="/chat"
                        className="px-5 py-2 text-sm font-medium text-black bg-white rounded-full hover:bg-gray-200 transition-all transform hover:scale-105"
                    >
                        Go to Chat
                    </Link>
                </div>
            ) : (
                <div className="flex items-center gap-4 border-l border-white/10 pl-6">
                    <Link
                        to="/login"
                        className="text-sm font-medium text-gray-400 hover:text-white transition-colors"
                    >
                        Log in
                    </Link>
                    <Link
                        to="/signup"
                        className="px-5 py-2 text-sm font-medium text-black bg-white rounded-full hover:bg-gray-200 transition-all transform hover:scale-105"
                    >
                        Sign Up
                    </Link>
                </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-400 hover:text-white p-1"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden bg-gray-900 border-b border-white/10 absolute w-full left-0 top-16 shadow-2xl">
          <div className="px-6 py-4 space-y-4 flex flex-col">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={
                  link.type === "cta"
                    ? "text-sm font-medium text-emerald-400 hover:text-emerald-300"
                    : "text-sm text-gray-400 hover:text-white transition-colors"
                }
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
