import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { snippetAPI } from '../services/api';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { toPng, toBlob } from 'html-to-image';
import { 
  Copy, 
  Download, 
  ArrowLeft, 
  Share2, 
  Check, 
  Clipboard,
  Twitter,
  Linkedin,
  Facebook,
  Mail
} from 'lucide-react';
import {
  TwitterShareButton,
  LinkedinShareButton,
  FacebookShareButton,
  EmailShareButton,
} from 'react-share';
import toast from 'react-hot-toast';

function ShareSnippet() {
  const { id } = useParams();
  const navigate = useNavigate();
  const snippetRef = useRef(null);

  const [snippet, setSnippet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copying, setCopying] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [imageCopied, setImageCopied] = useState(false);

  useEffect(() => {
    fetchSnippet();
  }, [id]);

  const fetchSnippet = async () => {
    try {
      setLoading(true);
      const response = await snippetAPI.getPublicSnippetById(id);
      setSnippet(response.data);
    } catch (error) {
      toast.error('Failed to load snippet or snippet is not public');
      navigate('/public');
    } finally {
      setLoading(false);
    }
  };

  // Copy code to clipboard
  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(snippet.content);
      setCopying(true);
      toast.success('Code copied to clipboard!');
      setTimeout(() => setCopying(false), 2000);
    } catch (error) {
      toast.error('Failed to copy code');
    }
  };

  // Copy share link
  const handleCopyLink = async () => {
    try {
      const shareUrl = window.location.href;
      await navigator.clipboard.writeText(shareUrl);
      setLinkCopied(true);
      toast.success('Link copied to clipboard!');
      setTimeout(() => setLinkCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy link');
    }
  };

  // Download image as file
  const handleDownloadImage = async () => {
    if (!snippetRef.current) return;

    try {
      setGenerating(true);
      toast.loading('Generating image...', { id: 'generate-image' });

      const dataUrl = await toPng(snippetRef.current, {
        cacheBust: true,
        backgroundColor: '#1e1e1e',
        pixelRatio: 2,
      });

      const link = document.createElement('a');
      link.download = `${snippet.title.replace(/\s+/g, '-').toLowerCase()}.png`;
      link.href = dataUrl;
      link.click();

      toast.success('Image downloaded!', { id: 'generate-image' });
    } catch (error) {
      toast.error('Failed to generate image', { id: 'generate-image' });
      console.error('Error generating image:', error);
    } finally {
      setGenerating(false);
    }
  };

  // Copy image to clipboard
  const handleCopyImageToClipboard = async () => {
    if (!snippetRef.current) return;

    try {
      setImageCopied(true);
      toast.loading('Copying image to clipboard...', { id: 'copy-image' });

      const blob = await toBlob(snippetRef.current, {
        cacheBust: true,
        backgroundColor: '#1e1e1e',
        pixelRatio: 2,
      });

      if (!blob) {
        throw new Error('Failed to generate image blob');
      }

      await navigator.clipboard.write([
        new ClipboardItem({
          'image/png': blob,
        }),
      ]);

      toast.success('Image copied to clipboard!', { id: 'copy-image' });
      setTimeout(() => setImageCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy image. Try downloading instead.', { id: 'copy-image' });
      console.error('Error copying image:', error);
      setImageCopied(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading snippet...</div>
      </div>
    );
  }

  if (!snippet) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Snippet not found</h1>
          <Link to="/public" className="text-blue-500 hover:text-blue-400">
            Browse public snippets
          </Link>
        </div>
      </div>
    );
  }

  const shareUrl = window.location.href;
  const shareTitle = `Check out this ${snippet.language} code snippet: ${snippet.title}`;
  const shareDescription = `${snippet.title} - Code snippet shared on DevSnippet Vault`;

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="bg-[#252526] border-b border-[#3e3e42] sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center space-x-2 text-gray-400 hover:text-white transition"
            >
              <ArrowLeft size={20} />
              <span>Back</span>
            </button>

            <Link
              to="/"
              className="text-blue-500 hover:text-blue-400 text-sm font-medium"
            >
              Go to App
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Share Section */}
        

        {/* Snippet Card - This will be converted to image */}
        <div
          ref={snippetRef}
          className="bg-[#252526] rounded-lg border border-[#3e3e42] overflow-hidden"
        >
          {/* Header */}
          <div className="p-6 border-b border-[#3e3e42]">
            <h1 className="text-2xl font-bold text-white mb-3">
              {snippet.title}
            </h1>
            <div className="flex flex-wrap gap-3">
              {/* Language Badge */}
              <span className="inline-flex capitalize items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-900 text-blue-200">
                {snippet.language}
              </span>

              {/* Tags */}
              {snippet.tags && snippet.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {Array.from(snippet.tags).map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-gray-700 text-gray-300"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Code Content */}
          <div className="bg-[#1e1e1e]">
            <SyntaxHighlighter
              language={snippet.language.toLowerCase()}
              style={vscDarkPlus}
              customStyle={{
                margin: 0,
                padding: '1.5rem',
                background: '#1e1e1e',
                fontSize: '0.875rem',
              }}
              showLineNumbers
              wrapLines={true}
            >
              {snippet.content}
            </SyntaxHighlighter>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-[#2d2d30] border-t border-[#3e3e42]">
            <div className="flex items-center justify-between text-sm text-gray-400">
              <div>
                Shared via <span className="font-semibold text-white">DevSnippet Vault</span>
              </div>
              {snippet.createdAt && (
                <div>
                  Created: {new Date(snippet.createdAt).toLocaleDateString()}
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="mb-8 mt-8 bg-[#252526] rounded-lg p-6 border border-[#3e3e42]">
          <h2 className="text-xl font-bold text-white mb-4">Share This Snippet</h2>

          {/* Primary Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
            <button
              onClick={handleCopyCode}
              disabled={copying}
              className="flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white px-4 py-3 rounded-lg transition font-medium"
            >
              {copying ? <Check size={20} /> : <Copy size={20} />}
              <span>{copying ? 'Copied!' : 'Copy Code'}</span>
            </button>

            <button
              onClick={handleCopyImageToClipboard}
              disabled={imageCopied}
              className="flex items-center justify-center space-x-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 text-white px-4 py-3 rounded-lg transition font-medium"
            >
              {imageCopied ? <Check size={20} /> : <Clipboard size={20} />}
              <span>{imageCopied ? 'Copied!' : 'Copy Image'}</span>
            </button>

            <button
              onClick={handleDownloadImage}
              disabled={generating}
              className="flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700 disabled:bg-green-800 text-white px-4 py-3 rounded-lg transition font-medium"
            >
              {generating ? (
                <>
                  <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <Download size={20} />
                  <span>Download Image</span>
                </>
              )}
            </button>
          </div>

          {/* Share Link */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Share Link
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={shareUrl}
                readOnly
                className="flex-1 px-4 py-2 bg-[#2d2d30] border border-[#3e3e42] rounded-lg text-white text-sm"
              />
              <button
                onClick={handleCopyLink}
                className="flex items-center space-x-2 bg-[#2d2d30] hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition"
              >
                {linkCopied ? <Check size={20} /> : <Share2 size={20} />}
                <span className="hidden sm:inline">{linkCopied ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>
          </div>

          {/* Social Media Share Buttons */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Share on Social Media
            </label>
            <div className="flex flex-wrap gap-3">
              <TwitterShareButton url={shareUrl} title={shareTitle}>
                <div className="flex items-center space-x-2 bg-[#1DA1F2] hover:bg-[#1a8cd8] text-white px-4 py-2 rounded-lg transition cursor-pointer">
                  <Twitter size={20} fill="currentColor" />
                  <span>Twitter</span>
                </div>
              </TwitterShareButton>

              <LinkedinShareButton url={shareUrl} title={shareTitle} summary={shareDescription}>
                <div className="flex items-center space-x-2 bg-[#0077B5] hover:bg-[#006399] text-white px-4 py-2 rounded-lg transition cursor-pointer">
                  <Linkedin size={20} fill="currentColor" />
                  <span>LinkedIn</span>
                </div>
              </LinkedinShareButton>

              <FacebookShareButton url={shareUrl} quote={shareTitle}>
                <div className="flex items-center space-x-2 bg-[#1877F2] hover:bg-[#166fe5] text-white px-4 py-2 rounded-lg transition cursor-pointer">
                  <Facebook size={20} fill="currentColor" />
                  <span>Facebook</span>
                </div>
              </FacebookShareButton>

              <EmailShareButton url={shareUrl} subject={shareTitle} body={shareDescription}>
                <div className="flex items-center space-x-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition cursor-pointer">
                  <Mail size={20} />
                  <span>Email</span>
                </div>
              </EmailShareButton>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-8 text-center bg-[#252526] rounded-lg p-8 border border-[#3e3e42]">
          <h3 className="text-xl font-bold text-white mb-2">
            Want to create and share your own snippets?
          </h3>
          <p className="text-gray-400 mb-6">
            Join DevSnippet Vault to organize, manage, and share your code snippets with the community.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              to="/create"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition"
            >
              Create your own snippet
            </Link>
            <Link
              to="/public"
              className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium transition"
            >
              Browse Snippets
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShareSnippet;