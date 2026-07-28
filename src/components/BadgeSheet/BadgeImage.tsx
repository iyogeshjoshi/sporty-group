type BadgeImageProps = {
  src: string | null;
  alt: string;
  accentColor: string;
};

export function BadgeImage({ src, alt, accentColor }: BadgeImageProps) {
  return (
    <div
      className="flex aspect-square w-full items-center justify-center rounded-lg motion-safe:animate-badge-in"
      style={{ backgroundColor: `${accentColor}1a` }}
    >
      {src ? (
        <img src={src} alt={alt} loading="lazy" decoding="async" className="h-2/3 w-2/3 object-contain" />
      ) : (
        <span className="px-6 text-center font-body text-lg text-muted">
          No Image published for this league.
        </span>
      )}
    </div>
  );
}
