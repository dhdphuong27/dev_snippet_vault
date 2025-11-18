import { useState, useEffect } from 'react';
import { snippetAPI } from '../services/api';
import Navbar from '../components/Navbar';
import SnippetCard from '../components/SnippetCard';
import LanguageFilter from '../components/LanguageFilter'; // ✅ Add this
import { Heart, Loader } from 'lucide-react';
import toast from 'react-hot-toast';

function Favorites() {
  const [snippets, setSnippets] = useState([]);
  const [filteredSnippets, setFilteredSnippets] = useState([]); // ✅ Add this
  const [loading, setLoading] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState(null); // ✅ Add this

  useEffect(() => {
    fetchFavorites();
  }, []);

  // ✅ Add this
  useEffect(() => {
    filterSnippets();
  }, [snippets, selectedLanguage]);

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      const response = await snippetAPI.getFavorites();
      setSnippets(response.data);
    } catch (error) {
      toast.error('Failed to load favorites');
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

  const handleDelete = (snippetId) => {
    setSnippets(snippets.filter(s => s.id !== snippetId));
  };

  const handleFavoriteToggle = (snippetId) => {
    setSnippets(snippets.filter(s => s.id !== snippetId));
  };

  const displaySnippets = filteredSnippets; // ✅ Add this

  return (
    <div className="min-h-screen bg-[#1e1e1e]">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <Heart className="text-red-500" size={32} fill="currentColor" />
            <h1 className="text-3xl font-bold text-white">
              Favorite Snippets
            </h1>
          </div>
          <p className="text-[#858585]">
            Quick access to your most important code snippets
          </p>
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
                {displaySnippets.length} {displaySnippets.length === 1 ? 'favorite' : 'favorites'}
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
                <Heart size={48} className="mx-auto mb-4 text-gray-600" />
                <p className="text-xl font-medium text-gray-500 mb-2">
                  {selectedLanguage ? `No ${selectedLanguage} favorites` : 'No favorites yet'}
                </p>
                <p className="text-sm text-gray-600">
                  {selectedLanguage 
                    ? 'Try selecting a different language'
                    : 'Click the heart icon on any snippet to add it to favorites'}
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Favorites;