import { Filter, X } from 'lucide-react';

function LanguageFilter({ languages, selectedLanguage, onSelectLanguage }) {
  return (
    <div className="bg-[#252526] rounded-lg p-4 border border-[#3e3e42]">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <Filter size={20} className="text-[#858585]" />
          <h3 className="text-sm font-medium text-white">Filter by Language</h3>
        </div>
        {selectedLanguage && (
          <button
            onClick={() => onSelectLanguage(null)}
            className="text-xs text-[#858585] hover:text-white flex items-center space-x-1"
          >
            <X size={14} />
            <span>Clear</span>
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {languages.length === 0 ? (
          <p className="text-sm text-gray-500">No languages found</p>
        ) : (
          languages.map((lang) => (
            <button
              key={lang.name}
              onClick={() => onSelectLanguage(lang.name === selectedLanguage ? null : lang.name)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                selectedLanguage === lang.name
                  ? 'bg-blue-600 text-white'
                  : 'bg-[#2d2d30] text-[#cccccc] hover:bg-gray-600'
              }`}
            >
              {lang.name.charAt(0).toUpperCase() + lang.name.slice(1)}
              <span className="ml-1.5 text-xs opacity-75">({lang.count})</span>
            </button>
          ))
        )}
      </div>
    </div>
  );
}

export default LanguageFilter;