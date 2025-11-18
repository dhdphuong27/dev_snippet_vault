import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { snippetAPI } from '../services/api';
import Navbar from '../components/Navbar';
import toast from 'react-hot-toast';
import { Save, X, Code2 } from 'lucide-react';

function CreateSnippet() {
  const { id } = useParams(); // Get ID from URL for edit mode
  const navigate = useNavigate();
  const isEditMode = !!id; // If ID exists, we're editing

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    language: 'javascript',
    isPublic: false,
    isFavorite: false,
  });

  const [loading, setLoading] = useState(false);
  const [fetchingSnippet, setFetchingSnippet] = useState(false);

  // Language options
  const languages = [
    'javascript',
    'python',
    'java',
    'csharp',
    'cpp',
    'c',
    'go',
    'rust',
    'ruby',
    'php',
    'swift',
    'kotlin',
    'typescript',
    'sql',
    'html',
    'css',
    'bash',
    'powershell',
    'json',
    'yaml',
    'markdown',
  ];

  // Fetch snippet data if editing
  useEffect(() => {
    if (isEditMode) {
      fetchSnippet();
    }
  }, [id]);

  const fetchSnippet = async () => {
    try {
      setFetchingSnippet(true);
      const response = await snippetAPI.getMySnippets();
      const snippet = response.data.find(s => s.id === parseInt(id));
      
      if (snippet) {
        setFormData({
          title: snippet.title,
          content: snippet.content,
          language: snippet.language,
          isPublic: snippet.isPublic,
          isFavorite: snippet.isFavorite,
        });
      } else {
        toast.error('Snippet not found');
        navigate('/');
      }
    } catch (error) {
      toast.error('Failed to load snippet');
      navigate('/');
    } finally {
      setFetchingSnippet(false);
    }
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.title.trim()) {
      toast.error('Title is required');
      return;
    }

    if (!formData.content.trim()) {
      toast.error('Content is required');
      return;
    }

    setLoading(true);

    try {
      if (isEditMode) {
        // Update existing snippet
        await snippetAPI.updateSnippet(id, formData);
        toast.success('Snippet updated successfully!');
      } else {
        // Create new snippet
        await snippetAPI.createSnippet(formData);
        toast.success('Snippet created successfully!');
      }
      
      navigate('/'); // Redirect to home
    } catch (error) {
      toast.error(
        error.response?.data?.message || 
        `Failed to ${isEditMode ? 'update' : 'create'} snippet`
      );
    } finally {
      setLoading(false);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    navigate('/');
  };

  if (fetchingSnippet) {
    return (
      <div className="min-h-screen bg-[#1e1e1e]">
        <Navbar />
        <div className="flex items-center justify-center py-20">
          <div className="text-white">Loading snippet...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1e1e1e]">
      <Navbar />
      
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <Code2 className="text-blue-500" size={32} />
            <h1 className="text-3xl font-bold text-white">
              {isEditMode ? 'Edit Snippet' : 'Create New Snippet'}
            </h1>
          </div>
          <p className="text-[#858585]">
            {isEditMode 
              ? 'Update your code snippet' 
              : 'Save your code snippet for future reference'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div className="bg-[#252526] rounded-lg p-6 border border-[#3e3e42]">
            <label 
              htmlFor="title" 
              className="block text-sm font-medium text-[#cccccc] mb-2"
            >
              Title *
            </label>
            <input
              id="title"
              name="title"
              type="text"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., React useEffect Hook Example"
              className="w-full px-4 py-3 bg-[#2d2d30] border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={loading}
            />
          </div>

          {/* Language */}
          <div className="bg-[#252526] rounded-lg p-6 border border-[#3e3e42]">
            <label 
              htmlFor="language" 
              className="block text-sm font-medium text-[#cccccc] mb-2"
            >
              Language *
            </label>
            <select
              id="language"
              name="language"
              value={formData.language}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-[#2d2d30] border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={loading}
            >
              {languages.map(lang => (
                <option key={lang} value={lang}>
                  {lang.charAt(0).toUpperCase() + lang.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Code Content */}
          <div className="bg-[#252526] rounded-lg p-6 border border-[#3e3e42]">
            <label 
              htmlFor="content" 
              className="block text-sm font-medium text-[#cccccc] mb-2"
            >
              Code *
            </label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              placeholder="Paste your code here..."
              rows={15}
              className="w-full px-4 py-3 bg-[#1e1e1e] border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
              disabled={loading}
              style={{ tabSize: 2 }}
            />
            <p className="text-xs text-gray-500 mt-2">
              {formData.content.length} characters
            </p>
          </div>

          {/* Options */}
          <div className="bg-[#252526] rounded-lg p-6 border border-[#3e3e42]">
            <h3 className="text-sm font-medium text-[#cccccc] mb-4">Options</h3>
            
            <div className="space-y-3">
              {/* Public Toggle */}
              <label className="flex items-center space-x-3 cursor-pointer group">
                <input
                  type="checkbox"
                  name="isPublic"
                  checked={formData.isPublic}
                  onChange={handleChange}
                  disabled={loading}
                  className="w-5 h-5 rounded border-gray-600 text-blue-600 focus:ring-2 focus:ring-blue-500 bg-[#2d2d30]"
                />
                <div className="flex-1">
                  <span className="text-white font-medium group-hover:text-blue-400 transition">
                    Make Public
                  </span>
                  <p className="text-sm text-[#858585]">
                    Anyone can view this snippet without logging in
                  </p>
                </div>
              </label>

              {/* Favorite Toggle */}
              <label className="flex items-center space-x-3 cursor-pointer group">
                <input
                  type="checkbox"
                  name="isFavorite"
                  checked={formData.isFavorite}
                  onChange={handleChange}
                  disabled={loading}
                  className="w-5 h-5 rounded border-gray-600 text-blue-600 focus:ring-2 focus:ring-blue-500 bg-[#2d2d30]"
                />
                <div className="flex-1">
                  <span className="text-white font-medium group-hover:text-blue-400 transition">
                    Add to Favorites
                  </span>
                  <p className="text-sm text-[#858585]">
                    Mark this snippet as a favorite for quick access
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-4">
            <button
              type="button"
              onClick={handleCancel}
              disabled={loading}
              className="flex items-center space-x-2 px-6 py-3 bg-[#2d2d30] hover:bg-gray-600 disabled:bg-[#252526] disabled:cursor-not-allowed text-white font-medium rounded-lg transition"
            >
              <X size={20} />
              <span>Cancel</span>
            </button>

            <button
              type="submit"
              disabled={loading}
              className="flex items-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed text-white font-medium rounded-lg transition"
            >
              {loading ? (
                <>
                  <svg 
                    className="animate-spin h-5 w-5" 
                    xmlns="http://www.w3.org/2000/svg" 
                    fill="none" 
                    viewBox="0 0 24 24"
                  >
                    <circle 
                      className="opacity-25" 
                      cx="12" 
                      cy="12" 
                      r="10" 
                      stroke="currentColor" 
                      strokeWidth="4"
                    />
                    <path 
                      className="opacity-75" 
                      fill="currentColor" 
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  <span>{isEditMode ? 'Updating...' : 'Creating...'}</span>
                </>
              ) : (
                <>
                  <Save size={20} />
                  <span>{isEditMode ? 'Update Snippet' : 'Create Snippet'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateSnippet;