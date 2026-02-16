import Navbar from "./Components/Navbar";
import {PrathmeshBhoir, OmPimple, JayZore} from "../../assets/profileImages"

const About = () => {
    const teamMembers = [
        {
            name: "Prathmesh Bhoir",
            role: "Student",
            img: PrathmeshBhoir,
        },
        {
            name: "Om Pimple",
            role: "Student",
            img: OmPimple,
        },
        {
            name: "Jay Zore",
            role: "Student",
            img: JayZore,
        }
    ];

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-emerald-500/30">
            <Navbar />
            
            <section className="pt-24 pb-20 px-6">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-20">
                        <h1 className="text-4xl md:text-6xl font-bold mb-6">
                            We are building the <br />
                            <span className="text-emerald-400">operating system</span> for AI code.
                        </h1>
                        <p className="text-gray-400 text-xl leading-relaxed max-w-2xl mx-auto">
                            VeriCode was founded on the belief that AI shouldn't just write code, but understand its intent, safety, and performance implications.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-12 mb-20">
                        <div className="bg-white/5 border border-white/10 p-8 rounded-2xl">
                            <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
                            <p className="text-gray-400 leading-relaxed">
                                To empower every developer with an AI companion that doesn't just autocomplete, but actively collaborates, reviews, and improves the codebase in real-time.
                            </p>
                        </div>
                        <div className="bg-white/5 border border-white/10 p-8 rounded-2xl">
                            <h3 className="text-2xl font-bold mb-4">Our Vision</h3>
                            <p className="text-gray-400 leading-relaxed">
                                A world where software is bug-free, secure, and optimized by default, allowing humans to focus on creative problem-solving and architecture.
                            </p>
                        </div>
                    </div>

                    {/* Team Section */}
                    <div className="mb-20">
                        <h2 className="text-3xl font-bold mb-12 text-center">Meet the Team</h2>
                        <div className="grid md:grid-cols-3 gap-8">
                            {teamMembers.map((member, i) => (
                                <div key={i} className="group relative">
                                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-blue-500/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                    <div className="relative bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-emerald-500/30 transition-colors">
                                        <div className="mb-6 overflow-hidden rounded-xl aspect-square">
                                            <img 
                                                src={member.img} 
                                                alt={member.name} 
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                            />
                                        </div>
                                        <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                                        <div className="text-emerald-400 text-sm font-medium mb-3">{member.role}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                     <div className="text-center">
                        <div className="inline-block p-1 rounded-full bg-gradient-to-r from-emerald-500/20 to-blue-500/20 border border-emerald-500/30 mb-8">
                             <div className="px-6 py-2 rounded-full bg-[#0a0a0a]">
                                 <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-400 font-bold">
                                     Join the revolution
                                 </span>
                             </div>
                        </div>
                     </div>
                </div>
            </section>
        </div>
    );
};

export default About;
