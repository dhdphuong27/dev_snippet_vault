import { useState, useEffect } from 'react';
import { snippetAPI } from '../services/api';
import Navbar from '../components/Navbar';
import SnippetCard from '../components/SnippetCard';
import LanguageFilter from '../components/LanguageFilter'; // ✅ Add this
import { Globe, Search, Loader } from 'lucide-react';
import toast from 'react-hot-toast';

function PublicSnippets() {
  const [snippets, setSnippets] = useState([]);
  const [filteredSnippets, setFilteredSnippets] = useState([]); // ✅ Add this
  const [loading, setLoading] = useState(true);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searching, setSearching] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(null); // ✅ Add this

  useEffect(() => {
    fetchPublicSnippets();
  }, []);

  // ✅ Add this
  useEffect(() => {
    filterSnippets();
  }, [snippets, selectedLanguage]);

  const fetchPublicSnippets = async () => {
    try {
      setLoading(true);
      const response = await snippetAPI.getPublicSnippets();
      setSnippets(response.data);
    } catch (error) {
      toast.error('Failed to load public snippets');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Add this
  const filterSnippets = () => {
    if (selectedLanguage) {
      setFilteredSnippets(snippets.filter(s => s.language.toLowerCase() === selectedLanguage.toLowerCase()));
    } else {
      setFilteredSnippets(snippets);
    }
  };

  // ✅ Add this
  const getLanguageCounts = () => {
    const counts = {};
    snippets.forEach(snippet => {
      const lang = snippet.language.toLowerCase();
      counts[lang] = (counts[lang] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!searchKeyword.trim()) {
      fetchPublicSnippets();
      setSelectedLanguage(null); // ✅ Clear filter
      return;
    }

    try {
      setSearching(true);
      const response = await snippetAPI.searchPublic(searchKeyword);
      setSnippets(response.data);
      setSelectedLanguage(null); // ✅ Clear filter
      
      if (response.data.length === 0) {
        toast('No snippets found', { icon: '🔍' });
      }
    } catch (error) {
      toast.error('Search failed');
      console.error(error);
    } finally {
      setSearching(false);
    }
  };

  const clearSearch = () => {
    setSearchKeyword('');
    setSelectedLanguage(null); // ✅ Clear filter
    fetchPublicSnippets();
  };

  const displaySnippets = filteredSnippets; // ✅ Add this

  return (
    <div className="min-h-screen bg-[#1e1e1e]">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <Globe className="text-green-500" size={32} />
            <h1 className="text-3xl font-bold text-white">
              Public Snippets
            </h1>
          </div>
          <p className="text-[#858585]">
            Browse code snippets shared by the community
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#858585]" size={20} />
              <input
                type="text"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                placeholder="Search public snippets..."
                className="w-full pl-10 pr-4 py-3 bg-[#252526] border border-[#3e3e42] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <button
              type="submit"
              disabled={searching}
              className="px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-green-800 text-white font-medium rounded-lg transition flex items-center space-x-2"
            >
              {searching ? (
                <>
                  <Loader className="animate-spin" size={20} />
                  <span>Searching...</span>
                </>
              ) : (
                <span>Search</span>
              )}
            </button>
            {searchKeyword && (
              <button
                type="button"
                onClick={clearSearch}
                className="px-4 py-3 bg-[#2d2d30] hover:bg-gray-600 text-white rounded-lg transition"
              >
                Clear
              </button>
            )}
          </form>
        </div>

        {/* ✅ Add Language Filter */}
        {!loading && snippets.length > 0 && (
          <div className="mb-6">
            <LanguageFilter
              languages={getLanguageCounts()}
              selectedLanguage={selectedLanguage}
              onSelectLanguage={setSelectedLanguage}
            />
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader className="animate-spin text-green-500" size={48} />
          </div>
        ) : (
          <>
            {/* Snippet Count */}
            <div className="mb-4">
              <p className="text-[#858585]">
                {displaySnippets.length} public {displaySnippets.length === 1 ? 'snippet' : 'snippets'}
                {selectedLanguage && ` in ${selectedLanguage}`}
              </p>
            </div>

            {/* Snippets Grid */}
            {displaySnippets.length > 0 ? (
              <div className="columns-1 md:columns-2 xl:columns-3 gap-6">
                {displaySnippets.map((snippet) => (
                  <div key={snippet.id} className="break-inside-avoid mb-6">
                    <SnippetCard
                      snippet={snippet}
                      showActions={false}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <Globe size={48} className="mx-auto mb-4 text-gray-600" />
                <p className="text-xl font-medium text-gray-500 mb-2">
                  No public snippets found
                </p>
                <p className="text-sm text-gray-600">
                  {selectedLanguage 
                    ? `No public ${selectedLanguage} snippets. Try a different language.`
                    : searchKeyword 
                      ? 'Try a different search term' 
                      : 'Be the first to share a public snippet!'}
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default PublicSnippets;