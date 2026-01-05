'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Loader2, Sparkles, Copy, Download, Share2, User, Wand2,
  Image as ImageIcon, X, Eye, History, Zap, Palette, 
  Volume2, TrendingUp, MessageSquare, Target
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';

type ThumbnailType = {
  id: string;
  userInput: string;
  thumbnailURL: string;
  includeImage?: string;
  userEmail: string;
  createdAt: string;
  generatedPrompt?: string;
};

export default function ThumbnailGeneratorPage() {
  // State
  const [userInput, setUserInput] = useState('');
  const [includeFace, setIncludeFace] = useState<File | null>(null);
  const [includeFacePreview, setIncludeFacePreview] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState<string>('');
  const [generationTime, setGenerationTime] = useState<number>(0);
  const [allThumbnails, setAllThumbnails] = useState<ThumbnailType[]>([]);
  const [showHistory, setShowHistory] = useState(true);

  // Fetch thumbnails on component mount
  useEffect(() => {
    fetchAllThumbnails();
  }, []);

  const fetchAllThumbnails = async () => {
    try {
      const response = await fetch('/api/generate-thumbnail');
      if (response.ok) {
        const data = await response.json();
        setAllThumbnails(data);
      }
    } catch (error) {
      console.error('Failed to fetch thumbnails:', error);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Validate file
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File too large. Max 5MB.');
      return;
    }
    
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }
    
    setIncludeFace(file);
    const previewUrl = URL.createObjectURL(file);
    setIncludeFacePreview(previewUrl);
    toast.success('Face image added!');
  };

  const generateThumbnail = async () => {
    if (!userInput.trim() && !includeFace) {
      toast.error('Please provide a description or upload a face image');
      return;
    }
    
    const startTime = Date.now();
    setLoading(true);
    setError('');
    setThumbnailUrl('');

    const loadingToast = toast.loading('Generating your thumbnail... 🎨');

    try {
      const formData = new FormData();
      if (userInput) formData.append('description', userInput);
      if (includeFace) formData.append('includeFace', includeFace);
      
      const response = await fetch('/api/generate-thumbnail', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      const endTime = Date.now();
      setGenerationTime(endTime - startTime);

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate thumbnail');
      }

      setThumbnailUrl(data.thumbnailUrl);
      
      toast.dismiss(loadingToast);
      toast.success(
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-green-500" />
          <span>Thumbnail generated in {(endTime - startTime)/1000}s!</span>
        </div>,
        { duration: 4000 }
      );

      // Refresh thumbnails list
      setTimeout(() => {
        fetchAllThumbnails();
      }, 1000);

    } catch (err: any) {
      toast.dismiss(loadingToast);
      const errorMessage = err.message || 'Something went wrong';
      setError(errorMessage);
      toast.error(
        <div className="flex items-center gap-2">
          <span className="text-red-500">⚠️</span>
          <span>{errorMessage}</span>
        </div>
      );
      console.error('Generation error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      generateThumbnail();
    }
  };

  const downloadThumbnail = async () => {
    if (!thumbnailUrl) {
      toast.error('No thumbnail to download');
      return;
    }
    
    try {
      toast.loading('Downloading...');
      const response = await fetch(thumbnailUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `thumbnail-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
      toast.dismiss();
      toast.success('Download started!');
    } catch (error) {
      console.error('Download failed:', error);
      toast.error('Failed to download thumbnail');
    }
  };

  const copyThumbnailUrl = async () => {
    if (!thumbnailUrl) return;
    
    try {
      await navigator.clipboard.writeText(thumbnailUrl);
      toast.success('URL copied to clipboard!');
    } catch (err) {
      toast.error('Failed to copy URL');
    }
  };

  const shareThumbnail = () => {
    if (navigator.share && thumbnailUrl) {
      navigator.share({
        title: `AI Thumbnail: ${userInput}`,
        text: `Check out this AI-generated thumbnail`,
        url: thumbnailUrl,
      });
    } else {
      copyThumbnailUrl();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-4 md:p-8">
      <Toaster position="top-right" />
      
      {/* Header */}
      <header className="text-center mb-8">
        <div className="inline-flex items-center gap-3 bg-gradient-to-r from-orange-500 to-red-600 text-white px-6 py-3 rounded-full mb-6">
          <Wand2 className="h-6 w-6" />
          <span className="font-semibold">AI Thumbnail Generator</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-3">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-red-500">
            Create Eye-Catching Thumbnails
          </span>
        </h1>
        <p className="text-lg text-gray-300 max-w-2xl mx-auto">
          Generate professional YouTube thumbnails with AI. Upload a face image for personalized thumbnails.
          <span className="block mt-2 text-sm text-green-400">
            ✓ No login required • All thumbnails are saved automatically
          </span>
        </p>
      </header>

      <div className="max-w-6xl mx-auto">
        {/* Input Section */}
        <div className="mb-8">
          <Card className="shadow-2xl border border-gray-800 bg-gray-900">
            <CardHeader>
              <CardTitle className="text-xl text-orange-400 flex items-center gap-2">
                <Wand2 className="h-5 w-5" />
                Generate Your Thumbnail
              </CardTitle>
              <CardDescription className="text-gray-400">
                Fill in the details below and click generate
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <label className="text-gray-300 flex items-center gap-2">
                  <Target className="h-5 w-5 text-orange-500" />
                  Video Description / Title *
                </label>
                <div className="relative">
                  <textarea
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Example: 'How to build a website in 2024' or 'Easy vegan recipes'"
                    rows={3}
                    className="w-full px-4 py-3 pr-12 text-lg border-2 border-gray-700 focus:border-orange-500 rounded-xl focus:outline-none resize-none bg-gray-800 text-white placeholder-gray-500"
                    disabled={loading}
                  />
                  <Sparkles className="absolute right-4 top-4 h-5 w-5 text-orange-400" />
                </div>
              </div>

              {/* Face Upload Section */}
              <div className="space-y-3">
                <label className="text-gray-300 flex items-center gap-2">
                  <User className="h-5 w-5 text-purple-500" />
                  Include Face (Optional)
                </label>
                <div className="flex flex-col md:flex-row gap-4 items-center">
                  <label
                    htmlFor="includeface"
                    className={`flex-1 flex items-center justify-center gap-3 p-8 border-2 border-dashed border-gray-700 rounded-xl cursor-pointer hover:border-orange-500 transition-colors ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <User className="h-8 w-8 text-gray-400" />
                    <div className="text-left">
                      <p className="font-medium text-gray-300">Upload face image</p>
                      <p className="text-sm text-gray-500">PNG, JPG, WEBP up to 5MB</p>
                    </div>
                  </label>
                  
                  {includeFacePreview && (
                    <div className="relative w-48 h-48 rounded-xl overflow-hidden border-2 border-orange-500">
                      <img
                        src={includeFacePreview}
                        alt="Face preview"
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                      <button
                        onClick={() => {
                          setIncludeFace(null);
                          setIncludeFacePreview('');
                          toast.success('Face image removed');
                        }}
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>
                
                <input
                  id="includeface"
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                  accept="image/*"
                  disabled={loading}
                />
              </div>

              {error && (
                <div className="p-4 bg-red-900/30 border border-red-800 rounded-lg">
                  <p className="text-red-300 text-sm">{error}</p>
                </div>
              )}

              <Button
                onClick={generateThumbnail}
                disabled={loading || (!userInput.trim() && !includeFace)}
                className="w-full h-14 text-lg bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin mr-2" />
                    Generating Thumbnail...
                  </>
                ) : (
                  <>
                    <Wand2 className="h-5 w-5 mr-2" />
                    Generate Thumbnail Now
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Generated Thumbnail Preview */}
        {thumbnailUrl && (
          <div className="mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="border border-gray-800 bg-gray-900 shadow-2xl">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-orange-400">
                      <ImageIcon className="h-5 w-5" />
                      Your Generated Thumbnail
                    </span>
                    <Badge variant="outline" className="text-green-400 border-green-800">
                      Generated in {(generationTime / 1000).toFixed(1)}s
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="relative aspect-video rounded-xl overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900 border-2 border-gray-700">
                      <img
                        src={thumbnailUrl}
                        alt={`Thumbnail: ${userInput}`}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end justify-center p-6">
                        <div className="flex gap-3">
                          <Button 
                            onClick={downloadThumbnail}
                            className="bg-white text-gray-900 hover:bg-gray-100 shadow-lg"
                          >
                            <Download className="mr-2 h-4 w-4" />
                            Download
                          </Button>
                          <Button 
                            onClick={copyThumbnailUrl}
                            variant="outline"
                            className="bg-gray-900/90 text-white hover:bg-gray-800 shadow-lg border-gray-700"
                          >
                            <Copy className="mr-2 h-4 w-4" />
                            Copy URL
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-3">
                      <Button variant="outline" onClick={downloadThumbnail} className="flex-1 border-gray-700 hover:bg-gray-800">
                        <Download className="mr-2 h-4 w-4" />
                        Download PNG
                      </Button>
                      <Button variant="outline" onClick={shareThumbnail} className="flex-1 border-gray-700 hover:bg-gray-800">
                        <Share2 className="mr-2 h-4 w-4" />
                        Share
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        )}

        {/* Recent Thumbnails History */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <History className="h-6 w-6 text-purple-500" />
                Recent Thumbnails
                <Badge variant="secondary" className="bg-gray-800 text-gray-300">
                  {allThumbnails.length}
                </Badge>
              </h2>
              <p className="text-gray-400 mt-1">
                Browse recently generated thumbnails
              </p>
            </div>
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowHistory(!showHistory)}
                className="gap-2 border-gray-700 hover:bg-gray-800"
              >
                {showHistory ? 'Hide' : 'Show'} History
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={fetchAllThumbnails}
                className="gap-2 border-gray-700 hover:bg-gray-800"
              >
                <Eye className="h-3 w-3" />
                Refresh
              </Button>
            </div>
          </div>

          {showHistory && (
            <AnimatePresence>
              {allThumbnails.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {allThumbnails.slice(0, 12).map((thumbnail) => (
                    <motion.div
                      key={thumbnail.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      whileHover={{ scale: 1.02 }}
                      className="cursor-pointer"
                      onClick={() => {
                        setThumbnailUrl(thumbnail.thumbnailURL);
                        setUserInput(thumbnail.userInput);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                        toast.success('Thumbnail loaded!');
                      }}
                    >
                      <Card className="border border-gray-800 bg-gray-900 hover:border-orange-500 transition-all hover:shadow-xl">
                        <CardContent className="p-4">
                          <div className="aspect-video relative rounded-lg overflow-hidden mb-3 border border-gray-800">
                            <img
                              src={thumbnail.thumbnailURL}
                              alt={thumbnail.userInput}
                              className="absolute inset-0 w-full h-full object-cover"
                            />
                          </div>
                          <p className="text-sm text-gray-300 mb-2 line-clamp-2">
                            {thumbnail.userInput}
                          </p>
                          <div className="flex justify-between items-center text-xs text-gray-500">
                            <span className="px-2 py-1 bg-gray-800 rounded">
                              {new Date(thumbnail.createdAt).toLocaleDateString()}
                            </span>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-xs h-7 text-gray-400 hover:text-white"
                              onClick={(e) => {
                                e.stopPropagation();
                                window.open(thumbnail.thumbnailURL, '_blank');
                              }}
                            >
                              Open
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <Card className="border-2 border-dashed border-gray-800 bg-gray-900/50">
                  <CardContent className="py-12 text-center">
                    <History className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-300 mb-2">No thumbnails yet</h3>
                    <p className="text-gray-500 mb-4">
                      Generate your first thumbnail above!
                    </p>
                    <Button 
                      onClick={generateThumbnail}
                      disabled={!userInput.trim()}
                      className="bg-gradient-to-r from-orange-600 to-red-600"
                    >
                      <Wand2 className="mr-2 h-4 w-4" />
                      Generate First Thumbnail
                    </Button>
                  </CardContent>
                </Card>
              )}
            </AnimatePresence>
          )}
        </div>

        {/* Footer */}
        <footer className="mt-12 pt-8 border-t border-gray-800 text-center">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-left">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg">
                  <Wand2 className="h-4 w-4 text-white" />
                </div>
                <span className="font-semibold text-white">AI Thumbnail Generator</span>
              </div>
              <p className="text-gray-400 text-sm">
                Create professional thumbnails instantly • No login required
              </p>
              <p className="text-xs text-gray-500 mt-2">
                {allThumbnails.length} thumbnails generated • Powered by AI
              </p>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2 text-gray-400">
                <span>Avg: {thumbnailUrl ? (generationTime / 1000).toFixed(1) : '--'}s</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <ImageIcon className="h-4 w-4" />
                <span>{allThumbnails.length} total</span>
              </div>
            </div>
          </div>
        </footer>
      </div>

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">
          <div className="text-center space-y-4">
            <div className="relative">
              <div className="w-24 h-24 border-4 border-gray-800 rounded-full"></div>
              <div className="w-24 h-24 border-4 border-orange-600 rounded-full animate-spin absolute top-0 border-t-transparent"></div>
            </div>
            <div>
              <p className="text-xl font-semibold text-orange-400">Generating Thumbnail</p>
              <p className="text-gray-400 mt-2">Creating your custom thumbnail...</p>
              <p className="text-sm text-gray-500 mt-1">This usually takes a few seconds</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}