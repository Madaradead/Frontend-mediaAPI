interface VideoPlayerProps {
  src: string;
}

export function VideoPlayer({ src }: VideoPlayerProps) {
  return (
    <video
      src={src}
      controls
      className="w-full h-full object-contain"
      crossOrigin="anonymous"
    />
  );
}
