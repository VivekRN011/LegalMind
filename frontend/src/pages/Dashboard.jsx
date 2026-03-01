import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { documentsAPI, stripeAPI } from '../services/api';
import { 
  Upload, FileText, AlertTriangle, CheckCircle, 
  Trash2, Eye, Loader2, Crown, LogOut, Scale,
  TrendingUp, Shield, Clock, Plus, Search,
  MoreVertical, ExternalLink, X
} from 'lucide-react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';

export default function Dashboard() {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [dragActive, setDragActive] = useState(false);

  const fetchDocuments = useCallback(async () => {
    try {
      const res = await documentsAPI.getAll();
      setDocuments(res.data.documents);
    } catch (err) {
      console.error('Failed to fetch documents:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDocuments();
    
    if (searchParams.get('upgrade') === 'success') {
      setSuccess('Successfully upgraded to Pro! Enjoy 100 document analyses.');
      updateUser({ plan: 'PRO', documentsLimit: 100 });
    }
  }, [fetchDocuments, searchParams, updateUser]);

  const handleFileUpload = async (file) => {
    if (!file) return;

    if (file.type !== 'application/pdf') {
      setError('Only PDF files are allowed');
      return;
    }

    if (user.documentsUsed >= user.documentsLimit) {
      setError(`Document limit reached (${user.documentsLimit}). Please upgrade to Pro.`);
      return;
    }

    setUploading(true);
    setError('');

    try {
      const res = await documentsAPI.upload(file);
      updateUser({ documentsUsed: user.documentsUsed + 1 });
      // Redirect to the analysis page immediately
      navigate(`/document/${res.data.document.id}`);
    } catch (err) {
      setError(err.response?.data?.error || 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleInputChange = (e) => {
    const file = e.target.files?.[0];
    handleFileUpload(file);
    e.target.value = '';
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this document?')) return;

    try {
      await documentsAPI.delete(id);
      setDocuments(documents.filter(d => d.id !== id));
      updateUser({ documentsUsed: Math.max(0, user.documentsUsed - 1) });
      setSuccess('Document deleted successfully');
    } catch {
      setError('Failed to delete document');
    }
  };

  const handleUpgrade = async () => {
    try {
      const res = await stripeAPI.createCheckout();
      window.location.href = res.data.url;
    } catch {
      setError('Failed to create checkout session. Please try again.');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getRiskBadge = (risk) => {
    const styles = {
      low: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      medium: 'bg-amber-100 text-amber-700 border-amber-200',
      high: 'bg-red-100 text-red-700 border-red-200',
    };
    return styles[risk] || 'bg-gray-100 text-gray-600 border-gray-200';
  };

  const getRiskDot = (risk) => {
    const styles = {
      low: 'bg-emerald-500',
      medium: 'bg-amber-500',
      high: 'bg-red-500',
    };
    return styles[risk] || 'bg-gray-400';
  };

  const filteredDocuments = documents.filter(doc =>
    doc.fileName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const usagePercentage = ((user?.documentsUsed || 0) / (user?.documentsLimit || 5)) * 100;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Scale className="text-white" size={22} />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                LegalMind
              </span>
            </div>

            <div className="flex items-center gap-4">
              {user?.plan === 'PRO' ? (
                <span className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-sm font-medium rounded-full shadow-lg shadow-amber-500/25">
                  <Crown size={14} />
                  PRO
                </span>
              ) : (
                <button
                  onClick={handleUpgrade}
                  className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-medium rounded-lg hover:opacity-90 transition-all shadow-lg shadow-indigo-500/25"
                >
                  <Crown size={16} />
                  Upgrade
                </button>
              )}

              <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
                <div className="hidden sm:block text-right">
                  <p className="text-sm font-medium text-gray-900">{user?.name || 'User'}</p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                  {(user?.name || user?.email || 'U').charAt(0).toUpperCase()}
                </div>
                <button 
                  onClick={handleLogout}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                  title="Sign out"
                >
                  <LogOut size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Alerts */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
            <AlertTriangle className="text-red-500 flex-shrink-0 mt-0.5" size={20} />
            <span className="text-red-700 flex-1">{error}</span>
            <button onClick={() => setError('')} className="text-red-400 hover:text-red-600">
              <X size={18} />
            </button>
          </div>
        )}
        {success && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
            <CheckCircle className="text-emerald-500 flex-shrink-0 mt-0.5" size={20} />
            <span className="text-emerald-700 flex-1">{success}</span>
            <button onClick={() => setSuccess('')} className="text-emerald-400 hover:text-emerald-600">
              <X size={18} />
            </button>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-indigo-100 rounded-xl">
                <FileText className="text-indigo-600" size={24} />
              </div>
              <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                This month
              </span>
            </div>
            <p className="text-3xl font-bold text-gray-900">{user?.documentsUsed || 0}</p>
            <p className="text-gray-500 text-sm mt-1">Documents analyzed</p>
            <div className="mt-4">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-gray-500">Usage</span>
                <span className="font-medium text-gray-700">{user?.documentsUsed || 0} / {user?.documentsLimit || 5}</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${
                    usagePercentage >= 90 ? 'bg-red-500' : 
                    usagePercentage >= 70 ? 'bg-amber-500' : 
                    'bg-gradient-to-r from-indigo-500 to-purple-500'
                  }`}
                  style={{ width: `${Math.min(usagePercentage, 100)}%` }}
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-emerald-100 rounded-xl">
                <Shield className="text-emerald-600" size={24} />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">{documents.length}</p>
            <p className="text-gray-500 text-sm mt-1">Total contracts</p>
            <div className="mt-4 flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                <span className="text-gray-600">
                  {documents.filter(d => d.overallRisk === 'low').length} Low
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                <span className="text-gray-600">
                  {documents.filter(d => d.overallRisk === 'medium').length} Medium
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-red-500"></div>
                <span className="text-gray-600">
                  {documents.filter(d => d.overallRisk === 'high').length} High
                </span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl p-6 shadow-sm text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-white/20 rounded-xl">
                  <Crown className="text-white" size={24} />
                </div>
              </div>
              <p className="text-3xl font-bold">{user?.plan || 'FREE'}</p>
              <p className="text-indigo-100 text-sm mt-1">Current plan</p>
              {user?.plan !== 'PRO' && (
                <button
                  onClick={handleUpgrade}
                  className="mt-4 w-full py-2.5 bg-white text-indigo-600 text-sm font-semibold rounded-lg hover:bg-indigo-50 transition-colors"
                >
                  Upgrade to Pro
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Upload Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Upload Contract</h2>
              <p className="text-sm text-gray-500 mt-1">Upload a PDF to analyze with AI</p>
            </div>
          </div>
          
          <label 
            className={`relative border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center cursor-pointer transition-all ${
              dragActive 
                ? 'border-indigo-500 bg-indigo-50' 
                : uploading 
                  ? 'border-indigo-300 bg-indigo-50 cursor-wait' 
                  : 'border-gray-200 hover:border-indigo-400 hover:bg-gray-50'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              type="file"
              accept=".pdf"
              onChange={handleInputChange}
              disabled={uploading}
              className="hidden"
            />
            {uploading ? (
              <>
                <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
                <p className="text-indigo-600 font-semibold text-lg">Analyzing contract...</p>
                <p className="text-gray-500 text-sm mt-1">Our AI is reviewing your document</p>
              </>
            ) : (
              <>
                <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mb-4">
                  <Upload className="text-indigo-600" size={32} />
                </div>
                <p className="text-gray-900 font-semibold text-lg">
                  {dragActive ? 'Drop your file here' : 'Click to upload or drag and drop'}
                </p>
                <p className="text-gray-500 text-sm mt-1">PDF files up to 10MB</p>
              </>
            )}
          </label>
        </div>

        {/* Documents List */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Your Contracts</h2>
                <p className="text-sm text-gray-500">{documents.length} documents</p>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Search contracts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white transition-all w-full sm:w-64 outline-none"
                />
              </div>
            </div>
          </div>

          {loading ? (
            <div className="p-16 text-center">
              <Loader2 className="animate-spin mx-auto text-indigo-500 mb-4" size={40} />
              <p className="text-gray-500">Loading your documents...</p>
            </div>
          ) : filteredDocuments.length === 0 ? (
            <div className="p-16 text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <FileText className="text-gray-400" size={40} />
              </div>
              <p className="text-gray-900 font-medium mb-1">
                {searchTerm ? 'No contracts found' : 'No contracts yet'}
              </p>
              <p className="text-gray-500 text-sm">
                {searchTerm ? 'Try a different search term' : 'Upload your first contract to get started'}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {filteredDocuments.map((doc) => (
                <div 
                  key={doc.id} 
                  className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-gray-50 transition-colors group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <FileText className="text-indigo-600" size={24} />
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-gray-900 truncate">{doc.fileName}</p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-sm text-gray-500 flex items-center gap-1">
                          <Clock size={14} />
                          {new Date(doc.createdAt).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </span>
                        {doc.overallRisk && (
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-medium rounded-full border ${getRiskBadge(doc.overallRisk)}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${getRiskDot(doc.overallRisk)}`}></span>
                            {doc.overallRisk.charAt(0).toUpperCase() + doc.overallRisk.slice(1)} Risk
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                    <Link
                      to={`/document/${doc.id}`}
                      className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors text-sm font-medium"
                    >
                      <Eye size={16} />
                      View
                    </Link>
                    <button
                      onClick={() => handleDelete(doc.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

