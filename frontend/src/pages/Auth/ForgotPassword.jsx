import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, call API to send reset link
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center p-4 relative overflow-hidden">
       {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[50%] w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px]" />
      </div>

      <div className="w-full max-w-md bg-white/5 border border-white/10 rounded-2xl p-8 shadow-xl backdrop-blur-sm">
        <div className="mb-8 text-center">
          <div className="flex justify-start mb-6">
            <Link to="/" className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors group">
              <ArrowRight className="w-4 h-4 rotate-180 group-hover:-translate-x-1 transition-transform" />
             <span>Back to Home</span>
            </Link>
          </div>
          <h1 className="text-3xl font-bold mb-2">Reset Password</h1>
          <p className="text-gray-400">
            {submitted 
                ? "Check your inbox for instructions" 
                : "Enter your email to receive reset instructions"
            }
          </p>
        </div>

        {submitted ? (
            <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 mb-6">
                    <CheckCircle className="w-8 h-8" />
                </div>
                <p className="text-gray-300 mb-8">
                    If an account exists for <strong>{email}</strong>, we have sent password reset instructions.
                </p>
                <Link to="/login" className="inline-flex items-center text-emerald-400 hover:text-emerald-300 gap-2 font-medium">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Login
                </Link>
            </div>
        ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Email Address</label>
                    <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="name@example.com"
                        className="w-full bg-black/20 border border-white/10 rounded-lg py-2.5 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all"
                        required
                    />
                    </div>
                </div>

                <button
                    type="submit"
                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                    Send Reset Link
                    <ArrowRight className="w-4 h-4" />
                </button>
                 <div className="mt-6 text-center text-sm">
                    <Link to="/login" className="text-gray-400 hover:text-white flex items-center justify-center gap-2 transition-colors">
                        <ArrowLeft className="w-4 h-4" />
                        Back to Login
                    </Link>
                </div>
            </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
