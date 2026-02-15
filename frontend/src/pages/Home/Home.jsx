import { Link } from "react-router-dom";
import { ArrowRight, Code, RefreshCw, Zap, Users, Shield, Cpu, Globe } from "lucide-react";
import Navbar from "./Components/Navbar";

function Home() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white overflow-hidden font-sans selection:bg-emerald-500/30">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-24 pb-20 px-6 sm:px-8 lg:px-12 max-w-7xl mx-auto">
        {/* Background Gradients */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
          <div className="absolute top-[-10%] left-[20%] w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[10%] w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[120px]" />
        </div>

        <div className="text-center max-w-4xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-emerald-400 mb-8 animate-fade-in-up">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Next-Gen AI Development
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 leading-[1.1]">
            Build the <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-teal-200 to-blue-400">
              Future of Code
            </span>
          </h1>

          <p className="text-lg md:text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            VeriCode empowers your team with intelligent code analysis,
            automated refactoring, and AI-driven architectural insights.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              to="/login"
              className="group relative px-8 py-4 bg-white text-black rounded-full font-semibold transition-transform hover:scale-105 active:scale-95 flex items-center gap-2"
            >
              Get Started
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              <div className="absolute inset-0 rounded-full bg-white blur-lg opacity-20 group-hover:opacity-40 transition-opacity" />
            </Link>
            <Link
              to="/about"
              className="px-8 py-4 rounded-full font-semibold text-white border border-white/10 hover:bg-white/5 transition-colors"
            >
              Learn More
            </Link>
          </div>
        </div>

        {/* Dashboard Preview / Floating UI */}
        <div className="mt-20 relative mx-auto max-w-5xl">
            <div className="relative rounded-xl border border-white/10 bg-gray-900/50 backdrop-blur-xl shadow-2xl overflow-hidden aspect-video">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-blue-500/5" />
                {/* Mock UI Elements */}
                <div className="p-4 border-b border-white/10 flex items-center gap-4">
                    <div className="flex gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
                        <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50" />
                    </div>
                </div>
                <div className="p-8 grid grid-cols-2 gap-8 h-full">
                    <div className="flex flex-col gap-4">
                         <div className="h-4 w-3/4 bg-white/10 rounded animate-pulse" />
                         <div className="h-4 w-1/2 bg-white/10 rounded animate-pulse delay-75" />
                         <div className="h-32 w-full bg-white/5 rounded-lg border border-white/5 mt-4" />
                    </div>
                     <div className="flex flex-col gap-4">
                         <div className="h-full w-full bg-gradient-to-br from-emerald-500/10 to-transparent rounded-lg border border-emerald-500/20 flex items-center justify-center">
                            <Zap className="text-emerald-400 w-12 h-12" />
                         </div>
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Intelligence <span className="text-gray-500">Embedded</span>
            </h2>
            <p className="text-gray-400 max-w-xl text-lg">
              Our suite of AI tools integrates seamlessly into your workflow, providing real-time assistance and deep insights.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
             {[
              {
                icon: <Code className="w-6 h-6" />,
                title: "Deep Analysis",
                desc: "Pattern recognition detects potential bugs before they reach production."
              },
              {
                icon: <RefreshCw className="w-6 h-6" />,
                title: "Auto Refactoring",
                desc: "Transformation engines modernize legacy codebases instantly."
              },
              {
                icon: <Cpu className="w-6 h-6" />,
                title: "Performance AI",
                desc: "Identifies bottlenecks and suggests optimized logic structures."
              },
              {
                icon: <Shield className="w-6 h-6" />,
                title: "Security Scan",
                desc: "Vulnerability detection powered by global threat intelligence."
              },
              {
                icon: <Globe className="w-6 h-6" />,
                title: "Global Scale",
                desc: "Infrastructure designed to support distributed teams worldwide."
              },
              {
                icon: <Users className="w-6 h-6" />,
                title: "Team Sync",
                desc: "Collaborative insights that keep every developer aligned."
              }
             ].map((service, i) => (
               <div key={i} className="group p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-emerald-500/30 hover:bg-white/[0.07] transition-all duration-300">
                  <div className="w-12 h-12 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-6 group-hover:scale-110 transition-transform">
                    {service.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-3">{service.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{service.desc}</p>
               </div>
             ))}
          </div>
        </div>
      </section>
      
      {/* Footer Minimal */}
      <footer className="py-12 px-6 border-t border-white/10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-gray-500 text-sm">
            © 2024 VeriCode AI. All rights reserved.
          </div>
          <div className="flex gap-6">
             <a href="#" className="text-gray-500 hover:text-white transition-colors">Twitter</a>
             <a href="#" className="text-gray-500 hover:text-white transition-colors">GitHub</a>
             <a href="#" className="text-gray-500 hover:text-white transition-colors">Discord</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;
