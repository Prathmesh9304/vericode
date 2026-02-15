import Navbar from "./Components/Navbar";
import { useState } from "react";
import { Plus, Minus } from "lucide-react";

const FaqItem = ({ question, answer }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border-b border-white/10">
            <button 
                className="w-full py-6 flex items-center justify-between text-left hover:text-emerald-400 transition-colors"
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className="text-lg font-medium">{question}</span>
                {isOpen ? <Minus size={20} className="text-emerald-400"/> : <Plus size={20} />}
            </button>
            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100 pb-6' : 'max-h-0 opacity-0'}`}>
                <p className="text-gray-400 leading-relaxed pr-8">
                    {answer}
                </p>
            </div>
        </div>
    );
};

const Faq = () => {
    const faqs = [
        {
            q: "How does VeriCode analyze my code?",
            a: "VeriCode uses advanced static analysis combined with large language models to understand the context and logic of your code, providing semantic suggestions rather than just syntax checking."
        },
        {
            q: "Is my code secure?",
            a: "Yes. We process your code in ephemeral sandbox environments. We do not store your source code after analysis, and our models are trained to prioritize privacy."
        },
        {
            q: "Can I use VeriCode offline?",
            a: "Our Pro and Enterprise plans offer local processing agents that can run within your secure VPC or even on your local machine for maximum security."
        },
        {
            q: "What languages are supported?",
            a: "We currently support JavaScript, Python, Java, C++, Go, and Rust, with beta support for 10+ other languages."
        },
        {
            q: "How does the free trial work?",
            a: "The Starter plan is free forever. You can upgrade to Pro for a 14-day free trial to experience the full power of deeper analysis and unlimited requests."
        }
    ];

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-emerald-500/30">
            <Navbar />
            
            <section className="pt-24 pb-20 px-6">
                <div className="max-w-3xl mx-auto">
                    <div className="text-center mb-16">
                        <h1 className="text-4xl md:text-5xl font-bold mb-6">
                            Frequently Asked <span className="text-emerald-400">Questions</span>
                        </h1>
                        <p className="text-gray-400 text-lg">
                            Everything you need to know about VeriCode and how it works.
                        </p>
                    </div>

                    <div className="space-y-2">
                        {faqs.map((faq, i) => (
                            <FaqItem key={i} question={faq.q} answer={faq.a} />
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Faq;
