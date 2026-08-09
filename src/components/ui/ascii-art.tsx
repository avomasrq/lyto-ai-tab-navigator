/* AsciiArt — looping ASCII-art video, baked to its exact rendered output.
   Zero dependencies: one <video> that fills its parent. Used as a subtle
   background layer, e.g. <AsciiArt className="absolute inset-0 opacity-40" />. */

export const ASCII_ART_POSTER =
  'https://assets.21st.dev/ascii-recipes/thumbnails/user_2xJxXqdwWohYrdd6fiMYrS9hbmO/eae3b158-33e1-442d-8e17-3b4fb6656a7f.webp';

export function AsciiArt({ className }: { className?: string }) {
  return (
    <video
      className={className}
      src="https://assets.21st.dev/ascii-recipes/videos/user_2xJxXqdwWohYrdd6fiMYrS9hbmO/2e358adb-cfc9-4ec4-a600-1abc8836f02b.mp4"
      poster={ASCII_ART_POSTER}
      autoPlay
      loop
      muted
      playsInline
      aria-hidden
      style={{ display: 'block', width: '100%', height: '100%', objectFit: 'cover' }}
    />
  );
}
