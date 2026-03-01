import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { documentsAPI } from '../services/api';
import { 
  ArrowLeft, FileText, AlertTriangle, CheckCircle, 
  Loader2, ExternalLink, Shield, Scale, Clock,
  AlertCircle, Lightbulb, ChevronRight, Download
} from 'lucide-react';

export default function DocumentView() {
  const { id } = useParams();
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        const res = await documentsAPI.getOne(id);
        setDocument(res.data);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to load document');
      } finally {
        setLoading(false);
      }
    };

    fetchDocument();
  }, [id]);

  const getRiskStyles = (severity) => {
    const styles = {
      low: {
        border: 'border-l-emerald-500',
        bg: 'bg-emerald-50',
        badge: 'bg-emerald-100 text-emerald-700 border-emerald-200',
        icon: 'text-emerald-500',
        glow: 'shadow-emerald-500/20'
      },
      medium: {
        border: 'border-l-amber-500',
        bg: 'bg-amber-50',
        badge: 'bg-amber-100 text-amber-700 border-amber-200',
        icon: 'text-amber-500',
        glow: 'shadow-amber-500/20'
      },
      high: {
        border: 'border-l-red-500',
        bg: 'bg-red-50',
        badge: 'bg-red-100 text-red-700 border-red-200',
        icon: 'text-red-500',
        glow: 'shadow-red-500/20'
      },
    };
    return styles[severity] || styles.medium;
  };

  const getOverallRiskGradient = (risk) => {
    const gradients = {
      low: 'from-emerald-500 to-teal-500',
      medium: 'from-amber-500 to-orange-500',
      high: 'from-red-500 to-rose-500',
    };
    return gradients[risk] || 'from-gray-500 to-gray-600';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading document...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="text-red-500" size={40} />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Document Not Found</h2>
          <p className="text-gray-500 mb-6">{error}</p>
          <Link 
            to="/dashboard" 
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-xl hover:opacity-90 transition-all shadow-lg shadow-indigo-500/25"
          >
            <ArrowLeft size={18} /> Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const riskStyles = getRiskStyles(document.overallRisk);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link 
                to="/dashboard" 
                className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
              >
                <ArrowLeft size={20} />
              </Link>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
                  <Scale className="text-white" size={22} />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  LegalMind
                </span>
              </div>
            </div>
            
            {document.viewUrl && (
              <a
                href={document.viewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-medium rounded-lg hover:opacity-90 transition-all shadow-lg shadow-indigo-500/25"
              >
                <ExternalLink size={16} /> View PDF
              </a>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Document Header Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                <FileText className="text-indigo-600" size={28} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">{document.fileName}</h1>
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1.5">
                    <Clock size={16} />
                    Uploaded {new Date(document.createdAt).toLocaleDateString('en-US', { 
                      month: 'long', 
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </span>
                </div>
              </div>
            </div>
            
            {document.overallRisk && (
              <div className={`px-6 py-4 rounded-2xl bg-gradient-to-r ${getOverallRiskGradient(document.overallRisk)} shadow-lg ${riskStyles.glow}`}>
                <p className="text-white/80 text-xs font-medium uppercase tracking-wider mb-1">Risk Level</p>
                <p className="text-white text-2xl font-bold uppercase">{document.overallRisk}</p>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Summary & Risk Clauses */}
          <div className="lg:col-span-2 space-y-8">
            {/* Summary Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-indigo-100 rounded-xl">
                  <FileText className="text-indigo-600" size={22} />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">Contract Summary</h2>
              </div>
              <div className="prose max-w-none text-gray-600 leading-relaxed">
                {document.summary ? (
                  <p className="whitespace-pre-wrap">{document.summary}</p>
                ) : (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <FileText className="text-gray-400" size={32} />
                    </div>
                    <p className="text-gray-500">No summary available for this document</p>
                  </div>
                )}
              </div>
            </div>

            {/* Risk Clauses Card */}
            {document.riskNotes && document.riskNotes.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-red-100 rounded-xl">
                      <AlertCircle className="text-red-600" size={22} />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">Risk Clauses</h2>
                      <p className="text-sm text-gray-500">{document.riskNotes.length} potential issues identified</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {document.riskNotes.map((risk, index) => {
                    const styles = getRiskStyles(risk.severity);
                    return (
                      <div
                        key={index}
                        className={`border-l-4 ${styles.border} ${styles.bg} rounded-xl p-5 transition-all hover:shadow-md`}
                      >
                        <div className="flex items-start justify-between gap-4 mb-3">
                          <h3 className="font-semibold text-gray-900 flex-1">{risk.clause}</h3>
                          <span className={`flex-shrink-0 px-3 py-1 text-xs font-semibold rounded-full border ${styles.badge}`}>
                            {risk.severity?.toUpperCase()}
                          </span>
                        </div>
                        {risk.excerpt && (
                          <div className="bg-white/60 rounded-lg p-3 mb-3 border-l-2 border-gray-300">
                            <p className="text-sm text-gray-600 italic">"{risk.excerpt}"</p>
                          </div>
                        )}
                        <p className="text-sm text-gray-700 leading-relaxed">{risk.risk}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Stats & Recommendations */}
          <div className="space-y-8">
            {/* Risk Stats Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-purple-100 rounded-xl">
                  <Shield className="text-purple-600" size={22} />
                </div>
                <h2 className="text-lg font-semibold text-gray-900">Risk Analysis</h2>
              </div>
              
              <div className="space-y-4">
                <div className={`p-5 rounded-xl bg-gradient-to-r ${getOverallRiskGradient(document.overallRisk)} text-center`}>
                  <p className="text-white/80 text-xs font-medium uppercase tracking-wider mb-1">Overall Assessment</p>
                  <p className="text-white text-3xl font-bold uppercase">
                    {document.overallRisk || 'N/A'}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-50 rounded-xl p-4 text-center">
                    <p className="text-gray-500 text-xs mb-1">Total Clauses</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {document.riskNotes?.length || 0}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4 text-center">
                    <p className="text-gray-500 text-xs mb-1">High Risk</p>
                    <p className="text-2xl font-bold text-red-600">
                      {document.riskNotes?.filter(r => r.severity === 'high').length || 0}
                    </p>
                  </div>
                </div>

                {/* Risk Breakdown */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                      <span className="text-sm text-gray-600">Low Risk</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">
                      {document.riskNotes?.filter(r => r.severity === 'low').length || 0}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                      <span className="text-sm text-gray-600">Medium Risk</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">
                      {document.riskNotes?.filter(r => r.severity === 'medium').length || 0}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <span className="text-sm text-gray-600">High Risk</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">
                      {document.riskNotes?.filter(r => r.severity === 'high').length || 0}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Recommendations Card */}
            {document.recommendations && document.recommendations.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2.5 bg-emerald-100 rounded-xl">
                    <Lightbulb className="text-emerald-600" size={22} />
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900">Recommendations</h2>
                </div>
                
                <ul className="space-y-3">
                  {document.recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start gap-3 p-3 bg-emerald-50 rounded-xl hover:bg-emerald-100 transition-colors">
                      <CheckCircle className="text-emerald-500 flex-shrink-0 mt-0.5" size={18} />
                      <span className="text-sm text-gray-700 leading-relaxed">{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Quick Actions */}
            <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl p-6 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mt-12"></div>
              <div className="relative">
                <h3 className="font-semibold mb-2">Need Help?</h3>
                <p className="text-indigo-100 text-sm mb-4">Our legal experts can review this contract in detail.</p>
                <Link 
                  to="/dashboard"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white text-indigo-600 text-sm font-semibold rounded-lg hover:bg-indigo-50 transition-colors"
                >
                  <ArrowLeft size={16} /> Back to Dashboard
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
