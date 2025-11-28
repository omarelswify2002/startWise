import { Link } from "react-router-dom";
import { FaRocket } from "react-icons/fa";

export default function Privacy() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 text-gray-800 pt-16">
            <Link to="/" className="inline-flex items-center justify-center mb-12">
                <FaRocket className="text-4xl text-purple-600" />
                <span className="ml-2 text-3xl font-bold text-gradient">StartWise</span>
            </Link>

            <h1 className="text-3xl font-bold text-center mb-12 text-gray-900">
                Privacy Policy
            </h1>

            <div className="max-w-4xl mx-auto space-y-6 text-gray-700 px-6 md:px-20">
                <p>
                Your privacy is important to us. StartWise collects minimal personal information necessary to provide our services effectively.
                </p>
                <p>
                We never share your data with third parties without your consent. All sensitive information, including profile details and communications, is encrypted and securely stored.
                </p>
                <p>
                By using StartWise, you agree to our privacy practices outlined in this policy. We are committed to safeguarding your data and maintaining trust.
                </p>
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
