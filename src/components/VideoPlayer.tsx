
import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Play, Pause, Volume2, VolumeX, SkipForward, SkipBack } from 'lucide-react';
import { Video, VideoProgress } from '@/types/video';
import { toast } from "@/components/ui/use-toast";

interface VideoPlayerProps {
  className?: string;
  video: Video | null;
  onProgressUpdate?: (progress: VideoProgress) => void;
}

const PROGRESS_UPDATE_INTERVAL = 5000; // Save progress every 5 seconds
const RESUME_THRESHOLD = 10; // seconds before end to consider a video "completed"

const VideoPlayer: React.FC<VideoPlayerProps> = ({ className, video, onProgressUpdate }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [progress, setProgress] = useState(0);
  const [showControls, setShowControls] = useState(false);
  const progressSaveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [currentTime, setCurrentTime] = useState(0);

  // Load saved progress when video changes
  useEffect(() => {
    if (!video) return;
    
    const savedProgress = getSavedProgress(video.id);
    if (savedProgress && videoRef.current) {
      // If the video was almost finished, start from beginning
      if (savedProgress.completed) {
        videoRef.current.currentTime = 0;
        setCurrentTime(0);
      } else {
        videoRef.current.currentTime = savedProgress.lastPosition;
        setCurrentTime(savedProgress.lastPosition);
        toast({
          title: "Progress Restored",
          description: `Resuming from ${formatTime(savedProgress.lastPosition)}`,
          duration: 3000,
        });
      }
    }
    
    // Setup interval to save progress periodically
    progressSaveTimerRef.current = setInterval(() => {
      if (videoRef.current && isPlaying && video) {
        saveVideoProgress(video);
      }
    }, PROGRESS_UPDATE_INTERVAL);
    
    return () => {
      if (progressSaveTimerRef.current) {
        clearInterval(progressSaveTimerRef.current);
      }
    };
  }, [video]);

  // Format seconds to MM:SS
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

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
    if (!videoRef.current || !video) return;
    
    const currentTime = videoRef.current.currentTime;
    setCurrentTime(currentTime);
    
    const progressPercent = (currentTime / videoRef.current.duration) * 100;
    setProgress(progressPercent);
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!videoRef.current) return;
    
    const progressBar = e.currentTarget;
    const clickPosition = e.clientX - progressBar.getBoundingClientRect().left;
    const progressBarWidth = progressBar.clientWidth;
    const percentClicked = (clickPosition / progressBarWidth) * 100;
    
    videoRef.current.currentTime = (percentClicked / 100) * videoRef.current.duration;
  };

  const handleVideoEnded = () => {
    setIsPlaying(false);
    if (video) {
      // Mark as completed
      const newProgress: VideoProgress = {
        videoId: video.id,
        progress: 100,
        lastPosition: videoRef.current?.duration || 0,
        completed: true,
        lastWatched: new Date().toISOString()
      };
      
      saveVideoProgressToStorage(newProgress);
      if (onProgressUpdate) {
        onProgressUpdate(newProgress);
      }
      
      toast({
        title: "Video Completed",
        description: `You've completed "${video.title}"`,
        duration: 3000,
      });
    }
  };

  const saveVideoProgress = (video: Video) => {
    if (!videoRef.current) return;
    
    const currentTime = videoRef.current.currentTime;
    const duration = videoRef.current.duration;
    
    if (isNaN(duration)) return;
    
    // Don't mark as completed if just saving progress
    const isCompleted = currentTime >= duration - RESUME_THRESHOLD;
    const progressPercent = (currentTime / duration) * 100;
    
    const newProgress: VideoProgress = {
      videoId: video.id,
      progress: progressPercent,
      lastPosition: currentTime,
      completed: isCompleted,
      lastWatched: new Date().toISOString()
    };
    
    saveVideoProgressToStorage(newProgress);
    if (onProgressUpdate) {
      onProgressUpdate(newProgress);
    }
  };

  // Helper functions for storage
  const saveVideoProgressToStorage = (progress: VideoProgress) => {
    try {
      // Get existing progress data from localStorage
      const allProgressString = localStorage.getItem('videoProgress');
      const allProgress: Record<string, VideoProgress> = allProgressString 
        ? JSON.parse(allProgressString) 
        : {};
      
      // Update progress for this video
      allProgress[progress.videoId] = progress;
      
      // Save back to localStorage
      localStorage.setItem('videoProgress', JSON.stringify(allProgress));
    } catch (error) {
      console.error('Error saving video progress:', error);
    }
  };

  const getSavedProgress = (videoId: string): VideoProgress | null => {
    try {
      const allProgressString = localStorage.getItem('videoProgress');
      if (!allProgressString) return null;
      
      const allProgress: Record<string, VideoProgress> = JSON.parse(allProgressString);
      return allProgress[videoId] || null;
    } catch (error) {
      console.error('Error getting saved progress:', error);
      return null;
    }
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
            onEnded={handleVideoEnded}
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
                
                <div className="text-xs text-white/80">
                  {formatTime(currentTime)} / {video.duration}
                </div>
              </div>
              
              <div className="text-xs text-white/80">
                {video.title}
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
