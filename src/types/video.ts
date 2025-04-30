
export interface Video {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  videoUrl: string;
  duration: string;
  category: string;
}

export interface VideoProgress {
  videoId: string;
  progress: number; // Percentage progress (0-100)
  lastPosition: number; // Time in seconds
  completed: boolean;
  lastWatched: string; // ISO date string
}

export interface VideoWithProgress extends Video {
  progress?: VideoProgress;
}
