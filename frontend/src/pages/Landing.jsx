import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { 
  Scale, Upload, Brain, Shield, Zap, FileText, 
  CheckCircle, ArrowRight, Star, Users, Clock,
  AlertTriangle, BarChart3, Lock
} from 'lucide-react';

export default function Landing() {
  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Analysis',
      description: 'Advanced NLP algorithms analyze your contracts, extracting key terms, obligations, and potential risks in seconds.'
    },
    {
      icon: Shield,
      title: 'Risk Detection',
      description: 'Automatically identify risky clauses including liability limitations, indemnifications, and unfavorable terms.'
    },
    {
      icon: Zap,
      title: 'Instant Results',
      description: 'Get comprehensive contract summaries and risk assessments within moments, not hours.'
    },
    {
      icon: Lock,
      title: 'Secure & Private',
      description: 'Your documents are encrypted and never stored permanently. Your legal data stays yours.'
    }
  ];

  const steps = [
    { num: 1, title: 'Upload Contract', desc: 'Simply drag and drop your PDF contract' },
    { num: 2, title: 'AI Analysis', desc: 'Our AI reads and understands every clause' },
    { num: 3, title: 'Get Insights', desc: 'Receive detailed risk assessment & summary' }
  ];

  const stats = [
    { value: '10K+', label: 'Contracts Analyzed' },
    { value: '500+', label: 'Risk Clauses Detected Daily' },
    { value: '99%', label: 'Accuracy Rate' },
    { value: '<30s', label: 'Average Analysis Time' }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 bg-gradient-to-b from-indigo-50 via-white to-white overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 rounded-full text-indigo-700 text-sm font-medium mb-6">
              <Zap size={16} />
              AI-Powered Contract Intelligence
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight mb-6">
              Analyze Contracts
              <span className="block bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                in Seconds
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              LegalMind uses advanced AI to instantly analyze legal contracts, identify risks, 
              and provide actionable insights. Save hours of manual review.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link 
                to="/register"
                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:opacity-90 transition-all shadow-2xl shadow-indigo-500/30 flex items-center justify-center gap-2"
              >
                Start Free Analysis
                <ArrowRight size={20} />
              </Link>
              <Link 
                to="/login"
                className="w-full sm:w-auto px-8 py-4 bg-white text-gray-700 font-semibold rounded-xl border-2 border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 transition-all flex items-center justify-center gap-2"
              >
                Sign In
              </Link>
            </div>

            <p className="mt-4 text-sm text-gray-500">
              Free tier includes 5 contract analyses • No credit card required
            </p>
          </div>

          {/* Hero Image/Preview */}
          <div className="mt-16 relative">
            <div className="bg-gradient-to-b from-gray-900 to-gray-800 rounded-2xl shadow-2xl p-4 md:p-8 max-w-5xl mx-auto">
              <div className="bg-gray-950 rounded-xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-gray-900 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-gray-400 text-sm mb-3">
                      <FileText size={16} />
                      Contract Summary
                    </div>
                    <div className="space-y-2">
                      <div className="h-3 bg-gray-800 rounded w-full"></div>
                      <div className="h-3 bg-gray-800 rounded w-5/6"></div>
                      <div className="h-3 bg-gray-800 rounded w-4/6"></div>
                    </div>
                  </div>
                  <div className="bg-gray-900 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-gray-400 text-sm mb-3">
                      <AlertTriangle size={16} />
                      Risk Analysis
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-red-500"></div>
                        <div className="h-3 bg-gray-800 rounded flex-1"></div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                        <div className="h-3 bg-gray-800 rounded flex-1"></div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        <div className="h-3 bg-gray-800 rounded flex-1"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Floating badges */}
            <div className="hidden md:block absolute -left-4 top-1/2 -translate-y-1/2 bg-white rounded-xl shadow-xl p-4 border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle className="text-green-600" size={20} />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Low Risk</p>
                  <p className="text-sm text-gray-500">Contract Approved</p>
                </div>
              </div>
            </div>
            
            <div className="hidden md:block absolute -right-4 top-1/3 bg-white rounded-xl shadow-xl p-4 border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                  <Brain className="text-indigo-600" size={20} />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">AI Analysis</p>
                  <p className="text-sm text-gray-500">7 Clauses Reviewed</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, idx) => (
              <div key={idx} className="text-center">
                <p className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  {stat.value}
                </p>
                <p className="text-gray-600 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Powerful Features for
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"> Legal Teams</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to review contracts faster and with more confidence
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, idx) => (
              <div 
                key={idx} 
                className="group p-6 bg-white rounded-2xl border border-gray-200 hover:border-indigo-300 hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  <feature.icon className="text-white" size={28} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="py-24 px-4 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600">
              Three simple steps to contract clarity
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, idx) => (
              <div key={idx} className="relative text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6">
                  {step.num}
                </div>
                {idx < steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-indigo-300 to-purple-300"></div>
                )}
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-600">
              Start free, upgrade when you need more
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Plan */}
            <div className="bg-white rounded-2xl border-2 border-gray-200 p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Free</h3>
              <p className="text-gray-600 mb-6">Perfect for trying out LegalMind</p>
              <div className="mb-6">
                <span className="text-5xl font-bold text-gray-900">$0</span>
                <span className="text-gray-600">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2 text-gray-700">
                  <CheckCircle className="text-green-500" size={20} />
                  5 contract analyses
                </li>
                <li className="flex items-center gap-2 text-gray-700">
                  <CheckCircle className="text-green-500" size={20} />
                  AI-powered summaries
                </li>
                <li className="flex items-center gap-2 text-gray-700">
                  <CheckCircle className="text-green-500" size={20} />
                  Risk detection
                </li>
                <li className="flex items-center gap-2 text-gray-700">
                  <CheckCircle className="text-green-500" size={20} />
                  PDF export
                </li>
              </ul>
              <Link 
                to="/register"
                className="block w-full py-3 text-center border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
              >
                Get Started
              </Link>
            </div>

            {/* Pro Plan */}
            <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl p-8 text-white relative overflow-hidden">
              <div className="absolute top-4 right-4 bg-white/20 backdrop-blur px-3 py-1 rounded-full text-sm font-medium">
                Most Popular
              </div>
              <h3 className="text-2xl font-bold mb-2">Pro</h3>
              <p className="text-indigo-100 mb-6">For professionals and teams</p>
              <div className="mb-6">
                <span className="text-5xl font-bold">$29</span>
                <span className="text-indigo-200">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2">
                  <CheckCircle className="text-indigo-200" size={20} />
                  100 contract analyses
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="text-indigo-200" size={20} />
                  Everything in Free
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="text-indigo-200" size={20} />
                  Priority processing
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="text-indigo-200" size={20} />
                  Advanced risk scoring
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="text-indigo-200" size={20} />
                  Email support
                </li>
              </ul>
              <Link 
                to="/register"
                className="block w-full py-3 text-center bg-white text-indigo-600 font-semibold rounded-xl hover:bg-indigo-50 transition-colors"
              >
                Start Pro Trial
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 bg-gradient-to-br from-indigo-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Transform Your Contract Review?
          </h2>
          <p className="text-xl text-indigo-100 mb-8">
            Join thousands of legal professionals using LegalMind to save time and reduce risk
          </p>
          <Link 
            to="/register"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-indigo-600 font-semibold rounded-xl hover:bg-indigo-50 transition-colors shadow-2xl"
          >
            Start Free Today
            <ArrowRight size={20} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center">
                <Scale className="text-white" size={24} />
              </div>
              <span className="text-xl font-bold text-white">LegalMind</span>
            </div>
            <div className="flex items-center gap-6 text-sm">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors">Contact</a>
            </div>
            <p className="text-sm">
              © 2026 LegalMind. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
