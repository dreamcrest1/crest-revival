import React from 'react';

/**
 * StoryBackground — flat gradient placeholder.
 * Removed all SVG / animations / parallax for max FPS.
 * User will redesign the background.
 */
const StoryBackground: React.FC = React.memo(() => (
  <div
    aria-hidden
    className="fixed inset-0 z-0 pointer-events-none"
    style={{
      background:
        'linear-gradient(to bottom, hsl(230 50% 6%) 0%, hsl(230 60% 3%) 100%)',
    }}
  />
));
StoryBackground.displayName = 'StoryBackground';
export default StoryBackground;
