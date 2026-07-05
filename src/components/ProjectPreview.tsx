import { useCallback, useEffect, useRef, useState } from "react";

interface ProjectPreviewProps {
  images: string[];
  title: string;
}

export default function ProjectPreview({ images, title }: ProjectPreviewProps) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startCycle = useCallback(() => {
    if (images.length <= 1) return;
    intervalRef.current = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % images.length);
    }, 1800);
  }, [images.length]);

  const stopCycle = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setCurrentIdx(0);
  }, []);

  useEffect(() => () => { if (intervalRef.current) clearInterval(intervalRef.current); }, []);

  return (
    <div
      className="relative w-full overflow-hidden"
      style={{ borderRadius: "3px", aspectRatio: "16/10" }}
      onMouseEnter={startCycle}
      onMouseLeave={stopCycle}
    >
      {images.map((src, i) => (
        <img
          key={src}
          src={src}
          alt={`${title} preview ${i + 1}`}
          className="absolute inset-0 w-full h-full object-cover"
          style={{
            borderRadius: "3px",
            opacity: i === currentIdx ? 1 : 0,
            transition: "opacity 2.5s ease",
          }}
        />
      ))}
      {images.length > 1 && (
        <div className="absolute bottom-2 right-2 flex gap-[5px]">
          {images.map((_, i) => (
            <span
              key={i}
              style={{
                display: "block",
                width: "5px",
                height: "5px",
                borderRadius: "50%",
                background: i === currentIdx ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.35)",
                transition: "background 0.3s ease",
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
