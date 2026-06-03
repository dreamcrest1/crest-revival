import React from 'react';
import bgVideoAsset from '@/assets/bg-loop.mp4.asset.json';

// Use local bundled video in production builds (e.g. cPanel) where the
// Lovable /__l5e/ asset CDN is not reachable. Falls back to CDN url in dev.
const bgVideoUrl = import.meta.env.PROD ? '/media/bg-loop.mp4' : bgVideoAsset.url;

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
      src={bgVideoUrl}
      autoPlay
      loop
      muted
      playsInline
      preload="auto"
      disablePictureInPicture
      className="absolute inset-0 w-full h-full object-cover"
    />
    {/* Readability overlay tuned to the cyber neon theme */}
    <div
      className="absolute inset-0"
      style={{
        background:
          'linear-gradient(to bottom, hsl(240 60% 6% / 0.55) 0%, hsl(240 60% 6% / 0.4) 50%, hsl(240 60% 6% / 0.7) 100%)',
      }}
    />
  </div>
));
StoryBackground.displayName = 'StoryBackground';
export default StoryBackground;
