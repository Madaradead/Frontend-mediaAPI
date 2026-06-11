interface AudioPlayerProps {
  src: string;
}

export function AudioPlayer({ src }: AudioPlayerProps) {
  return (
    <div className="w-full p-8 flex flex-col items-center justify-center h-full bg-muted/30">
      <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-6">
        <span className="text-4xl text-primary"></span>
      </div>
      <audio
        src={src}
        controls
        className="w-full max-w-md"
        crossOrigin="anonymous"
      />
    </div>
  );
}
