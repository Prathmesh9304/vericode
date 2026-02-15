import Navbar from "./Components/Navbar";
import { Check, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const Pricing = () => {
    const plans = [
        {
            name: "Starter",
            price: "$0",
            desc: "For individuals exploring AI coding.",
            features: ["Basic Code Analysis", "500 daily requests", "Community Support", "Basic Refactoring"],
            cta: "Get Started",
            highlight: false
        },
        {
            name: "Pro",
            price: "$29",
            desc: "For professional developers.",
            features: ["Deep Code Analysis", "Unlimited requests", "Priority Support", "Advanced Refactoring", "VS Code Extension"],
            cta: "Start Free Trial",
            highlight: true
        },
        {
            name: "Enterprise",
            price: "Custom",
            desc: "For large teams and organizations.",
            features: ["On-premise deployment", "Dedicated Success Manager", "Custom Integrations", "SLA Support", "SSO & Security"],
            cta: "Contact Sales",
            highlight: false
        }
    ];

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-emerald-500/30">
            <Navbar />
            
            <section className="pt-24 pb-20 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16 max-w-3xl mx-auto">
                        <h1 className="text-4xl md:text-6xl font-bold mb-6">
                            Simple, transparent <br />
                            <span className="text-emerald-400">pricing</span>
                        </h1>
                        <p className="text-gray-400 text-xl">
                            Choose the plan that fits your needs. No hidden fees.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {plans.map((plan, i) => (
                            <div 
                                key={i} 
                                className={`relative p-8 rounded-2xl border ${
                                    plan.highlight 
                                    ? "bg-white/10 border-emerald-500/50 shadow-[0_0_30px_rgba(16,185,129,0.15)]" 
                                    : "bg-white/5 border-white/10 hover:border-emerald-500/30"
                                } transition-all duration-300 flex flex-col`}
                            >
                                {plan.highlight && (
                                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-emerald-500 text-white px-4 py-1 rounded-full text-sm font-bold">
                                        Most Popular
                                    </div>
                                )}
                                <div className="mb-8">
                                    <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
                                    <div className="flex items-baseline mb-2">
                                        <span className="text-4xl font-bold">{plan.price}</span>
                                        {plan.price !== "Custom" && <span className="text-gray-400 ml-2">/month</span>}
                                    </div>
                                    <p className="text-gray-400 text-sm h-10">{plan.desc}</p>
                                </div>

                                <div className="space-y-4 mb-8 flex-1">
                                    {plan.features.map((feature, f) => (
                                        <div key={f} className="flex items-center gap-3 text-sm text-gray-300">
                                            <div className={`p-1 rounded-full ${plan.highlight ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/10 text-gray-400'}`}>
                                                <Check size={14} />
                                            </div>
                                            {feature}
                                        </div>
                                    ))}
                                </div>

                                <button className={`w-full py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
                                    plan.highlight 
                                    ? "bg-emerald-500 hover:bg-emerald-600 text-white" 
                                    : "bg-white text-black hover:bg-gray-200"
                                }`}>
                                    {plan.cta}
                                    {plan.highlight && <ArrowRight size={18} />}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Pricing;
