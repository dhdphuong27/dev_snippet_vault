import { useState, useEffect } from 'react';
import { snippetAPI } from '../services/api';
import Navbar from '../components/Navbar';
import SnippetCard from '../components/SnippetCard';
import LanguageFilter from '../components/LanguageFilter'; // ✅ Add this
import { Search, Loader } from 'lucide-react';
import toast from 'react-hot-toast';

function Home() {
  const [snippets, setSnippets] = useState([]);
  const [filteredSnippets, setFilteredSnippets] = useState([]); // ✅ Add this
  const [loading, setLoading] = useState(true);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searching, setSearching] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(null); // ✅ Add this

  // Fetch snippets when component mounts
  useEffect(() => {
    fetchSnippets();
  }, []);

  // Filter snippets when language or snippets change
  useEffect(() => {
    filterSnippets();
  }, [snippets, selectedLanguage]); // ✅ Add this

  const fetchSnippets = async () => {
    try {
      setLoading(true);
      const response = await snippetAPI.getMySnippets();
      setSnippets(response.data);
    } catch (error) {
      toast.error('Failed to load snippets');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Add this function
  const filterSnippets = () => {
    if (selectedLanguage) {
      setFilteredSnippets(snippets.filter(s => s.language.toLowerCase() === selectedLanguage.toLowerCase()));
    } else {
      setFilteredSnippets(snippets);
    }
  };

  // ✅ Add this function
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
      fetchSnippets();
      setSelectedLanguage(null); // ✅ Clear filter on search reset
      return;
    }

    try {
      setSearching(true);
      const response = await snippetAPI.search(searchKeyword);
      setSnippets(response.data);
      setSelectedLanguage(null); // ✅ Clear filter on new search
      
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

  const handleDelete = (snippetId) => {
    setSnippets(snippets.filter(s => s.id !== snippetId));
  };

  const handleFavoriteToggle = (snippetId) => {
    setSnippets(snippets.map(s => 
      s.id === snippetId 
        ? { ...s, favorite: !s.favorite }
        : s
    ));
  };

  const clearSearch = () => {
    setSearchKeyword('');
    setSelectedLanguage(null); // ✅ Clear filter
    fetchSnippets();
  };

  // ✅ Change this to use filteredSnippets instead of snippets
  const displaySnippets = filteredSnippets;

  return (
    <div className="min-h-screen bg-[#1e1e1e]">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            My Snippets
          </h1>
          <p className="text-[#858585]">
            Manage your personal code snippet collection
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
                placeholder="Search snippets by title, content, or language..."
                className="w-full pl-10 pr-4 py-3 bg-[#252526] border border-[#3e3e42] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button
              type="submit"
              disabled={searching}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white font-medium rounded-lg transition flex items-center space-x-2"
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
            <Loader className="animate-spin text-blue-500" size={48} />
          </div>
        ) : (
          <>
            {/* Snippet Count */}
            <div className="mb-4">
              <p className="text-[#858585]">
                {displaySnippets.length} {displaySnippets.length === 1 ? 'snippet' : 'snippets'} 
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
                      onDelete={handleDelete}
                      onFavoriteToggle={handleFavoriteToggle}
                      showActions={true}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="text-gray-500 mb-4">
                  <Search size={48} className="mx-auto mb-4" />
                  <p className="text-xl font-medium">No snippets found</p>
                  <p className="text-sm mt-2">
                    {selectedLanguage 
                      ? `No ${selectedLanguage} snippets found. Try a different language.`
                      : searchKeyword 
                        ? 'Try a different search term' 
                        : 'Create your first snippet to get started!'}
                  </p>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Home;