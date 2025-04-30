
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Video } from '@/types/video';

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
  
  // Get unique categories
  const categories = ['all', ...Array.from(new Set(videos.map(video => video.category)))];
  
  // Filter videos by category
  const filteredVideos = activeCategory === 'all' 
    ? videos 
    : videos.filter(video => video.category === activeCategory);

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
        {filteredVideos.map(video => (
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
            </div>
            
            <div className="p-3">
              <h3 className="text-white font-medium line-clamp-2">{video.title}</h3>
              <p className="text-xs text-white/60 mt-1 line-clamp-1">{video.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VideoLibrary;
