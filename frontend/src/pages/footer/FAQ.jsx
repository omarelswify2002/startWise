import { Link } from "react-router-dom";
import { FaRocket } from "react-icons/fa";

const faqs = [
    {
        question: "How does StartWise match startups with investors?",
        answer:
        "We use AI-powered algorithms to analyze startup profiles and investor preferences to create meaningful matches based on industry, growth stage, and compatibility."
    },
    {
        question: "Is StartWise free to use?",
        answer:
        "Yes! Startups can create profiles and get AI matches for free. Premium services may be introduced later for advanced analytics or features."
    },
    {
        question: "How do you verify investors and advisors?",
        answer:
        "All investors and advisors go through an identity and professional verification process to maintain a trustworthy network."
    },
    {
        question: "Can I communicate directly with investors and advisors?",
        answer:
        "Absolutely! Once matched, you can message them directly within the platform to schedule meetings and discussions."
    },
    ];

    export default function FAQ() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 text-gray-800 pt-16">
            <Link to="/" className="inline-flex items-center justify-center mb-12">
                <FaRocket className="text-4xl text-purple-600" />
                <span className="ml-2 text-3xl font-bold text-gradient">StartWise</span>
            </Link>

            <h1 className="text-3xl font-bold text-center mb-12 text-gray-900">
                Frequently Asked Questions
            </h1>

            <div className="max-w-4xl mx-auto space-y-6 px-6 md:px-20">
                {faqs.map((faq, index) => (
                <div key={index} className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all">
                    <h3 className="text-xl font-semibold mb-2">{faq.question}</h3>
                    <p className="text-gray-600">{faq.answer}</p>
                </div>
                ))}
            </div>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-12 mt-20">
                <div className="max-w-7xl mx-auto px-4">
                <div className="grid md:grid-cols-4 gap-8">
                    <div>
                    <div className="flex items-center mb-4">
                        <FaRocket className="text-2xl text-purple-400" />
                        <span className="ml-2 text-xl font-bold">StartWise</span>
                    </div>
                    <p className="text-gray-400">
                        Connecting startups with the right investors and advisors through AI-powered matching.
                    </p>
                    </div>
                    <div>
                    <h4 className="font-bold mb-4">Product</h4>
                    <ul className="space-y-2 text-gray-400">
                        <li><Link to="/features" onClick={()=>{window.scrollTo(0,0)}} className="hover:text-white">Features</Link></li>
                        <li><Link to="/faq" onClick={()=>{window.scrollTo(0,0)}} className="hover:text-white">FAQ</Link></li>
                    </ul>
                    </div>
                    <div>
                    <h4 className="font-bold mb-4">Company</h4>
                    <ul className="space-y-2 text-gray-400">
                        <li><Link to="/about" onClick={()=>{window.scrollTo(0,0)}} className="hover:text-white">About</Link></li>
                    </ul>
                    </div>
                    <div>
                    <h4 className="font-bold mb-4">Legal</h4>
                    <ul className="space-y-2 text-gray-400">
                        <li><Link to="/privacy" onClick={()=>{window.scrollTo(0,0)}} className="hover:text-white">Privacy</Link></li>
                        <li><Link to="/terms" onClick={()=>{window.scrollTo(0,0)}} className="hover:text-white">Terms</Link></li>
                    </ul>
                    </div>
                </div>
                <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
                    <p>&copy; 2025 StartWise System. All rights reserved.</p>
                </div>
                </div>
            </footer>
        </div>
    );
}
