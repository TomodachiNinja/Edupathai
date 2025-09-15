import React, { useState, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Play, Search, ExternalLink, Volume2, YoutubeIcon } from "lucide-react";

export default function YouTubePlayer({ videoTitle, channelName, onVideoFound }) {
  const [searchQuery, setSearchQuery] = useState(`${videoTitle} ${channelName}`);
  const [videoId, setVideoId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showManualSearch, setShowManualSearch] = useState(false);
  const [currentState, setCurrentState] = useState('initial'); // 'initial', 'loading', 'playing', 'not_found'

  const generateMockVideoId = useCallback((title) => {
    const videoDatabase = {
      "python": ["rfscVS0vtbw", "kqtD5dpn9C8", "t8pPdKYpowI"],
      "javascript": ["PkZNo7MFNFg", "hdI2bqOjy3c", "W6NZfCO5SIk"],
      "data science": ["ua-CiDNNj30", "N6BghzuFLIg", "r-uHVFPukCs"],
      "machine learning": ["aircAruvnKk", "IHZwWFHWa-w", "CfgkVdSDdf4"],
      "web development": ["pQN-pnXPaVg", "RF6Dzwwpduo", "mU6anWqZJcc"],
      "pandas": ["vmEHCJofslg", "ZyhVh-qRZPA", "7vuO9QXDN50"],
      "numpy": ["QUT1VHiLmmI", "GB9ByFAIAH4", "8Mpc9ukltVA"],
      "matplotlib": ["nzKy9GY12yo", "UO98lJQ3QGI", "wB9C0Mz9gSo"]
    };
    const titleLower = title.toLowerCase();
    for (const [keyword, videos] of Object.entries(videoDatabase)) {
      if (titleLower.includes(keyword)) {
        return videos[Math.floor(Math.random() * videos.length)];
      }
    }
    const defaultVideos = ["rfscVS0vtbw", "PkZNo7MFNFg", "ua-CiDNNj30"];
    return defaultVideos[Math.floor(Math.random() * defaultVideos.length)];
  }, []);

  const findAndPlayVideo = useCallback(() => {
    setCurrentState('loading');
    setTimeout(() => {
      const mockVideoId = generateMockVideoId(videoTitle, channelName);
      if (mockVideoId) {
        setVideoId(mockVideoId);
        setCurrentState('playing');
        if (onVideoFound) onVideoFound(mockVideoId);
      } else {
        setCurrentState('not_found');
      }
    }, 1500);
  }, [videoTitle, channelName, generateMockVideoId, onVideoFound]);

  const extractVideoId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const handleUrlSubmit = (e) => {
    e.preventDefault();
    const id = extractVideoId(searchQuery);
    if (id) {
      setVideoId(id);
      setCurrentState('playing');
      if (onVideoFound) onVideoFound(id);
    } else {
      openYouTubeSearch();
    }
  };

  const openYouTubeSearch = () => {
    const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(searchQuery)}`;
    window.open(searchUrl, '_blank');
  };
  
  const resetPlayer = () => {
    setCurrentState('initial');
    setVideoId(null);
    setShowManualSearch(false);
  }

  if (currentState === 'loading') {
    return (
      <Card className="bg-gradient-to-r from-red-50 to-pink-50">
        <CardContent className="p-6 text-center h-64 flex flex-col justify-center items-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Volume2 className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="font-semibold text-slate-800 mb-2">Finding Your Video...</h3>
          <p className="text-sm text-slate-600 mb-4">
            Searching for "{videoTitle}"
          </p>
          <div className="w-48 h-2 bg-red-200 rounded-full mx-auto">
            <div className="h-2 bg-red-500 rounded-full animate-pulse" style={{width: "60%"}}></div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (currentState === 'playing' && videoId) {
     return (
        <div className="space-y-3">
          <div className="relative aspect-video bg-black rounded-lg overflow-hidden shadow-lg">
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&autoplay=1`}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="absolute inset-0"
            />
          </div>
           <div className="flex justify-center">
              <Button onClick={resetPlayer} variant="outline" size="sm">
                <Search className="w-3 h-3 mr-1" />
                Find another video
              </Button>
            </div>
        </div>
      )
  }

  return (
    <div className="space-y-4">
       <Card className="bg-gradient-to-br from-gray-900 to-gray-700 text-white overflow-hidden group">
        <CardContent className="p-0 flex flex-col items-center justify-center aspect-video relative">
            <div className="absolute inset-0 bg-black/50 z-10"></div>
            <YoutubeIcon className="w-16 h-16 text-white/20 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"/>
            <div className="z-20 text-center p-4">
                 <h3 className="font-bold text-lg mb-2 line-clamp-2">{videoTitle}</h3>
                 <p className="text-sm text-white/80 mb-4">by {channelName}</p>
                <Button onClick={findAndPlayVideo} className="bg-white/90 text-gray-900 hover:bg-white backdrop-blur-sm">
                    <Play className="w-5 h-5 mr-2"/>
                    Ready to Watch
                </Button>
            </div>
        </CardContent>
       </Card>

      {!showManualSearch && (
        <div className="flex justify-center">
          <Button
            onClick={() => setShowManualSearch(true)}
            variant="ghost"
            size="sm"
            className="text-xs text-slate-500 hover:text-slate-700"
          >
            ...or search manually
          </Button>
        </div>
      )}

      {showManualSearch && (
        <div className="p-4 bg-slate-100 rounded-lg space-y-3">
            <p className="text-xs text-slate-600 font-medium">Find a specific video by pasting its URL or searching on YouTube.</p>
            <form onSubmit={handleUrlSubmit} className="flex gap-2">
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Paste YouTube URL or enter search terms..."
                className="flex-1 bg-white"
              />
               <Button type="button" onClick={openYouTubeSearch} variant="outline" size="icon" className="bg-white">
                <Search className="w-4 h-4" />
              </Button>
              <Button type="submit" variant="outline" size="icon" className="bg-white">
                <Play className="w-4 h-4" />
              </Button>
            </form>
        </div>
      )}
    </div>
  );
}