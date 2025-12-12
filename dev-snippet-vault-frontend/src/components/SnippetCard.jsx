import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Heart, Edit, Trash2, Copy, Globe, Lock, Share2} from 'lucide-react';
import { snippetAPI } from '../services/api';
import toast from 'react-hot-toast';

function SnippetCard({ snippet, onDelete, onFavoriteToggle, showActions = true }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [copying, setCopying] = useState(false);
  const navigate = useNavigate();

  // Truncate content for preview
  const previewContent = snippet.content.slice(0, 150);
  const shouldTruncate = snippet.content.length > 150;

  // Copy to clipboard
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(snippet.content);
      setCopying(true);
      toast.success('Copied to clipboard!');
      setTimeout(() => setCopying(false), 2000);
    } catch (error) {
      toast.error('Failed to copy');
    }
  };
  const handleShare = () => {
    const shareUrl = `${window.location.origin}/share/${snippet.id}`;
    navigator.clipboard.writeText(shareUrl);
    toast.success('Share link copied to clipboard!');
  };

  // Toggle favorite
  const handleFavorite = async () => {
    try {
      await snippetAPI.toggleFavorite(snippet.id);

    if (onFavoriteToggle) {
      onFavoriteToggle(snippet.id);
    }
    } catch (error) {
      toast.error('Failed to update favorite');
    }
  };

  // Delete snippet
  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this snippet?')) {
      try {
        await snippetAPI.deleteSnippet(snippet.id);
        toast.success('Snippet deleted');
        onDelete && onDelete(snippet.id);
      } catch (error) {
        toast.error('Failed to delete snippet');
      }
    }
  };
  const handleTitleClick = () => {
    if (snippet.public) {
      navigate(`/share/${snippet.id}`);
    }
  };

  // Edit snippet
  const handleEdit = () => {
    navigate(`/edit/${snippet.id}`);
  };

  return (
    <div className="bg-[#252526] rounded-lg border border-[#3e3e42] overflow-hidden hover:border-gray-600 transition">
      {/* Header */}
      <div className="p-4 border-b border-[#3e3e42]">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 
              onClick={handleTitleClick}
              className={`text-lg font-semibold text-white mb-2 ${
                snippet.public ? 'cursor-pointer hover:text-blue-400 transition' : ''
              }`}
              title={snippet.public ? 'Click to view share page' : ''}
            >
              {snippet.title}
            </h3>
            <div className="flex items-center space-x-3">
              {/* Language Badge */}
              <span className="inline-flex capitalize items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-900 text-blue-200">
                {snippet.language}
              </span>
              
              {/* Public/Private Badge */}
              <span className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                snippet.isPublic 
                  ? 'bg-green-900 text-green-200' 
                  : 'bg-[#2d2d30] text-[#cccccc]'
              }`}>
                {snippet.isPublic ? (
                  <>
                    <Globe size={12} />
                    <span>Public</span>
                  </>
                ) : (
                  <>
                    <Lock size={12} />
                    <span>Private</span>
                  </>
                )}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          {showActions && (
            <div className="flex items-center space-x-2">
              {/* Favorite Button */}
              <button
                onClick={handleFavorite}
                className={`p-2 rounded-lg transition ${
                  snippet.isFavorite
                    ? 'text-red-500 hover:bg-red-900/20'
                    : 'text-[#858585] hover:text-red-500 hover:bg-[#2d2d30]'
                }`}
                title={snippet.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              >
                <Heart size={20} fill={snippet.isFavorite ? 'currentColor' : 'none'} />
              </button>

              {/* Copy Button */}
              <button
                onClick={handleCopy}
                className="p-2 text-[#858585] hover:text-white hover:bg-[#2d2d30] rounded-lg transition"
                title="Copy to clipboard"
              >
                <Copy size={20} />
              </button>

              {/* Edit Button */}
              <button
                onClick={handleEdit}
                className="p-2 text-[#858585] hover:text-blue-500 hover:bg-[#2d2d30] rounded-lg transition"
                title="Edit snippet"
              >
                <Edit size={20} />
              </button>

              {/* Delete Button */}
              <button
                onClick={handleDelete}
                className="p-2 text-[#858585] hover:text-red-500 hover:bg-[#2d2d30] rounded-lg transition"
                title="Delete snippet"
              >
                <Trash2 size={20} />
              </button>
              
            </div>
          )}
        </div>
      </div>

      {/* Code Content */}
      <div className="relative">
        <SyntaxHighlighter
          language={snippet.language.toLowerCase()}
          style={vscDarkPlus}
          customStyle={{
            margin: 0,
            padding: '1rem',
            background: '#1e1e1e',
            fontSize: '0.875rem',
          }}
          showLineNumbers
        >
          {isExpanded || !shouldTruncate ? snippet.content : previewContent}
        </SyntaxHighlighter>

        {/* Expand/Collapse Button */}
        {shouldTruncate && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-gray-900 to-transparent pt-8 pb-2 text-center">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="px-4 py-1.5 bg-[#2d2d30] hover:bg-gray-600 text-white text-sm rounded-lg transition"
            >
              {isExpanded ? 'Show Less' : 'Show More'}
            </button>
          </div>
        )}
      </div>

      {/* Footer - Timestamps */}
      {snippet.createdAt && (
        <div className="px-4 py-2 bg-[#1e1e1e] text-xs text-gray-500 border-t border-[#3e3e42]">
          Created: {new Date(snippet.createdAt).toLocaleDateString()}
        </div>
      )}
    </div>
  );
}

export default SnippetCard;