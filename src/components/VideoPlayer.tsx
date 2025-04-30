
import React, { useState, useRef } from 'react';
import { cn } from '@/lib/utils';
import { Play, Pause, Volume2, VolumeX, SkipForward, SkipBack } from 'lucide-react';
import { Video } from '@/types/video';

interface VideoPlayerProps {
  className?: string;
  video: Video | null;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ className, video }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [progress, setProgress] = useState(0);
  const [showControls, setShowControls] = useState(false);

  const handlePlayPause = () => {
    if (!videoRef.current) return;
    
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleMute = () => {
    if (!videoRef.current) return;
    
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    
    const progress = (videoRef.current.currentTime / videoRef.current.duration) * 100;
    setProgress(progress);
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!videoRef.current) return;
    
    const progressBar = e.currentTarget;
    const clickPosition = e.clientX - progressBar.getBoundingClientRect().left;
    const progressBarWidth = progressBar.clientWidth;
    const percentClicked = (clickPosition / progressBarWidth) * 100;
    
    videoRef.current.currentTime = (percentClicked / 100) * videoRef.current.duration;
  };

  return (
    <div 
      className={cn(
        "relative w-full rounded-lg overflow-hidden bg-dark-tertiary border border-matrix/20 shadow-lg",
        "group animate-fade-in transition-transform duration-300",
        className
      )}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      {video ? (
        <>
          <video
            ref={videoRef}
            src={video.videoUrl}
            className="w-full aspect-video object-cover"
            poster={video.thumbnailUrl}
            onTimeUpdate={handleTimeUpdate}
            onEnded={() => setIsPlaying(false)}
          />
          
          <div className={cn(
            "absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent",
            "transition-opacity duration-300",
            showControls ? "opacity-100" : "opacity-0"
          )}>
            <div className="mb-3">
              <div className="relative h-1 bg-white/30 rounded-full cursor-pointer" onClick={handleProgressClick}>
                <div 
                  className="absolute top-0 left-0 h-full bg-matrix rounded-full"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button 
                  onClick={handlePlayPause}
                  className="text-white hover:text-matrix transition-colors"
                >
                  {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                </button>
                
                <button 
                  onClick={handleMute}
                  className="text-white hover:text-matrix transition-colors"
                >
                  {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                </button>
              </div>
              
              <div className="text-xs text-white/80">
                {video.title}
              </div>
              
              <div className="text-xs text-white/80">
                {video.duration}
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="w-full flex items-center justify-center aspect-video bg-dark-tertiary text-white/50">
          <span>Select a video to play</span>
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;
