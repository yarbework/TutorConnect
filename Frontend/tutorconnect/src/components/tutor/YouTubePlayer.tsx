'use client';

import { Video } from 'lucide-react';

interface YouTubePlayerProps {
  videoId?: string | null;
  title?: string;
}

export default function YouTubePlayer({ videoId, title = 'Tutor Introduction' }: YouTubePlayerProps) {
  if (!videoId) {
    return (
      <div className="w-full aspect-video bg-slate-100 rounded-2xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center p-6 text-center text-slate-400">
        <Video className="w-10 h-10 text-slate-300 mb-2" />
        <p className="text-sm font-semibold text-slate-600">No introduction video linked</p>
        <p className="text-xs text-slate-400 mt-1 max-w-xs">
          Paste your YouTube video or shorts link above to preview your video intro.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full aspect-video rounded-2xl overflow-hidden shadow-md border border-slate-200 bg-black">
      <iframe
        className="w-full h-full"
        src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}