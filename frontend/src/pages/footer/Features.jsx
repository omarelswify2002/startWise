import { Link } from 'react-router-dom';
import { FaRocket } from 'react-icons/fa';

const features = [
    {
        title: "AI Matching System",
        description:
        "StartWise uses an intelligent matching engine to connect startups with the most relevant investors and advisors based on goals, industry, and growth stage.",
        icon: "🤝",
    },
    {
        title: "Verified Profiles",
        description:
        "Every user is verified through email and identity checks to ensure trustworthy networking and secure collaboration opportunities.",
        icon: "✅",
    },
    {
        title: "Growth Analytics",
        description:
        "Get insights into your performance, interactions, and engagement with other members of the ecosystem to make smarter decisions.",
        icon: "📊",
    },
    {
        title: "Real-Time Messaging",
        description:
        "Stay connected with potential partners, investors, or advisors through secure in-app chat for smoother collaboration.",
        icon: "💬",
    },
    {
        title: "Project Portfolio",
        description:
        "Showcase your startup or investment portfolio with detailed project info, milestones, and funding history.",
        icon: "🚀",
    },
    ];

    export default function Features() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 text-gray-800 pt-16">
            <Link to="/" className="inline-flex items-center justify-center mb-12">
                <FaRocket className="text-4xl text-purple-600" />
                <span className="ml-2 text-3xl font-bold text-gradient">StartWise</span>
            </Link>

            <h1 className="text-3xl font-bold text-center mb-12 text-gray-900">
                Powerful Features for Every Visionary
            </h1>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 px-20 gap-10">
                {features.map((feature, index) => (
                <div
                    key={index}
                    className="p-6 border rounded-2xl shadow-md bg-white hover:shadow-lg transition-all"
                >
                    <div className="text-5xl mb-4">{feature.icon}</div>
                    <h2 className="text-2xl font-semibold mb-2">{feature.title}</h2>
                    <p className="text-gray-600">{feature.description}</p>
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