/* RedshiftArt, looping ASCII-art video, baked to its exact rendered output.
   Zero dependencies: one <video> that fills its parent. Same pattern as
   ascii-art.tsx's AsciiArt, kept as a separate export since it's a different
   baked asset (a redder, denser glyph field vs. the Hero's poster art). */

export const REDSHIFT_POSTER =
  'https://assets.21st.dev/ascii-recipes/thumbnails/user_2nElBLvklOKlAURm6W1PTu6yYFh/63f8aa27-cea7-49e0-a6a4-c2dc0954563c.jpg';

export function RedshiftArt({ className }: { className?: string }) {
  return (
    <video
      className={className}
      src="https://assets.21st.dev/ascii-recipes/videos/user_2nElBLvklOKlAURm6W1PTu6yYFh/1783480440186-b7o356.mp4"
      poster={REDSHIFT_POSTER}
      autoPlay
      loop
      muted
      playsInline
      aria-hidden
      style={{ display: 'block', width: '100%', height: '100%', objectFit: 'cover' }}
    />
  );
}
