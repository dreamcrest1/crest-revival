import React from 'react';
import bgVideo from '@/assets/bg-loop.mp4.asset.json';

/**
 * StoryBackground — looping video background.
 * Covers the viewport on all devices (mobile + desktop) via object-cover.
 */
const StoryBackground: React.FC = React.memo(() => (
  <div
    aria-hidden
    className="fixed inset-0 z-0 pointer-events-none overflow-hidden"
    style={{ background: 'hsl(230 60% 3%)' }}
  >
    <video
      src={bgVideo.url}
      autoPlay
      loop
      muted
      playsInline
      preload="auto"
      disablePictureInPicture
      className="absolute inset-0 w-full h-full object-cover"
    />
    {/* Readability overlay */}
    <div
      className="absolute inset-0"
      style={{
        background:
          'linear-gradient(to bottom, hsl(230 60% 3% / 0.55) 0%, hsl(230 60% 3% / 0.35) 50%, hsl(230 60% 3% / 0.65) 100%)',
      }}
    />
  </div>
));
StoryBackground.displayName = 'StoryBackground';
export default StoryBackground;
