
import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Video, VideoProgress } from '@/types/video';

interface VideoLibraryProps {
  className?: string;
  videos: Video[];
  onVideoSelect: (video: Video) => void;
  selectedVideoId?: string;
}

const VideoLibrary: React.FC<VideoLibraryProps> = ({ 
  className, 
  videos, 
  onVideoSelect,
  selectedVideoId
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [videoProgress, setVideoProgress] = useState<Record<string, VideoProgress>>({});
  
  // Load all video progress data when component mounts
  useEffect(() => {
    try {
      const savedProgressString = localStorage.getItem('videoProgress');
      if (savedProgressString) {
        const savedProgress = JSON.parse(savedProgressString);
        setVideoProgress(savedProgress);
      }
    } catch (error) {
      console.error('Error loading video progress:', error);
    }
  }, []);
  
  // Get unique categories
  const categories = ['all', ...Array.from(new Set(videos.map(video => video.category)))];
  
  // Filter videos by category
  const filteredVideos = activeCategory === 'all' 
    ? videos 
    : videos.filter(video => video.category === activeCategory);

  // Get progress for a video
  const getVideoProgress = (videoId: string): VideoProgress | undefined => {
    return videoProgress[videoId];
  };

  return (
    <div className={cn("w-full flex flex-col space-y-6", className)}>
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-white">Video Library</h2>
        
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={cn(
                "px-3 py-1 text-sm rounded-full whitespace-nowrap",
                activeCategory === category 
                  ? "bg-matrix text-dark font-medium" 
                  : "bg-dark-secondary text-white/70 hover:text-white"
              )}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pb-4">
        {filteredVideos.map(video => {
          const progress = getVideoProgress(video.id);
          return (
            <div
              key={video.id}
              className={cn(
                "video-card",
                selectedVideoId === video.id && "ring-1 ring-matrix animate-pulse-glow"
              )}
              onClick={() => onVideoSelect(video)}
            >
              <div className="relative">
                <img 
                  src={video.thumbnailUrl} 
                  alt={video.title} 
                  className="w-full aspect-video object-cover"
                />
                <div className="absolute bottom-0 right-0 bg-black/70 px-1.5 py-0.5 m-1 rounded text-xs">
                  {video.duration}
                </div>
                
                {/* Show progress bar if there's progress */}
                {progress && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/50">
                    <div 
                      className={cn(
                        "h-full", 
                        progress.completed ? "bg-green-500" : "bg-matrix"
                      )} 
                      style={{ width: `${progress.progress}%` }}
                    ></div>
                  </div>
                )}
                
                {/* Show completed badge */}
                {progress?.completed && (
                  <div className="absolute top-0 right-0 bg-green-500 text-black text-xs font-medium px-1.5 py-0.5 m-1 rounded">
                    Completed
                  </div>
                )}
              </div>
              
              <div className="p-3">
                <h3 className="text-white font-medium line-clamp-2">{video.title}</h3>
                <p className="text-xs text-white/60 mt-1 line-clamp-1">{video.description}</p>
                
                {/* Show last watched date if available */}
                {progress && (
                  <p className="text-xs text-matrix mt-1">
                    {progress.completed 
                      ? "Completed" 
                      : `${Math.round(progress.progress)}% watched`}
                    {progress.lastWatched && (
                      <span className="ml-1 text-white/40">
                        • {new Date(progress.lastWatched).toLocaleDateString()}
                      </span>
                    )}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default VideoLibrary;
