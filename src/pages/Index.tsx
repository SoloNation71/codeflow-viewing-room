
import React, { useState } from 'react';
import MatrixBackground from '@/components/MatrixBackground';
import Header from '@/components/Header';
import VideoPlayer from '@/components/VideoPlayer';
import VideoLibrary from '@/components/VideoLibrary';
import { Video } from '@/types/video';

// Mock data for videos
const MOCK_VIDEOS: Video[] = [
  {
    id: "1",
    title: "Introduction to Solo-Nation",
    description: "Learn about the Solo-Nation community and what we offer.",
    thumbnailUrl: "https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?q=80&w=640&auto=format&fit=crop",
    videoUrl: "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
    duration: "2:30",
    category: "introduction"
  },
  {
    id: "2",
    title: "Basic Training Module 1",
    description: "First steps in our comprehensive training program.",
    thumbnailUrl: "https://images.unsplash.com/photo-1587614382346-4ec70e388b28?q=80&w=640&auto=format&fit=crop",
    videoUrl: "https://samplelib.com/lib/preview/mp4/sample-10s.mp4",
    duration: "5:45",
    category: "training"
  },
  {
    id: "3",
    title: "Advanced Techniques Workshop",
    description: "Take your skills to the next level with these advanced techniques.",
    thumbnailUrl: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=640&auto=format&fit=crop",
    videoUrl: "https://samplelib.com/lib/preview/mp4/sample-15s.mp4",
    duration: "10:15",
    category: "advanced"
  },
  {
    id: "4",
    title: "Community Spotlight: Member Success Stories",
    description: "Hear success stories from Solo-Nation community members.",
    thumbnailUrl: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=640&auto=format&fit=crop",
    videoUrl: "https://samplelib.com/lib/preview/mp4/sample-20s.mp4",
    duration: "8:20",
    category: "community"
  },
  {
    id: "5",
    title: "Basic Training Module 2",
    description: "Continue your training with our second module.",
    thumbnailUrl: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?q=80&w=640&auto=format&fit=crop",
    videoUrl: "https://samplelib.com/lib/preview/mp4/sample-30s.mp4",
    duration: "6:10",
    category: "training"
  },
  {
    id: "6",
    title: "Future of Solo-Nation: 2025 Roadmap",
    description: "Preview our exciting plans and roadmap for the coming year.",
    thumbnailUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=640&auto=format&fit=crop",
    videoUrl: "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
    duration: "15:30",
    category: "announcements"
  }
];

const Index = () => {
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);

  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden">
      <MatrixBackground />
      
      <Header className="sticky top-0 z-30" />
      
      <main className="container mx-auto px-4 py-8 flex-grow">
        <div className="max-w-5xl mx-auto">
          <section className="mb-10">
            <VideoPlayer 
              video={selectedVideo} 
              className="max-w-4xl mx-auto shadow-xl shadow-matrix/10"
            />
          </section>
          
          <section>
            <VideoLibrary 
              videos={MOCK_VIDEOS} 
              onVideoSelect={setSelectedVideo} 
              selectedVideoId={selectedVideo?.id}
            />
          </section>
        </div>
      </main>
      
      <footer className="w-full py-4 bg-dark-secondary/60 backdrop-blur-md border-t border-matrix/20">
        <div className="container mx-auto px-4 text-center text-white/50 text-sm">
          © {new Date().getFullYear()} Solo-Nation. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Index;
