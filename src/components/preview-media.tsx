"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/cn";
import { posterSrc, previewSrc, type Project } from "@/lib/projects";

export function PreviewMedia({ project, className }: { project: Project; className?: string }) {
  const video = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const node = video.current;
    if (!node) return;
    node.currentTime = 0;
    node.play().catch(() => undefined);
  }, [project.id]);

  const player = project.motion === "pending" ? (
    <img
      src={posterSrc(project.id)}
      alt=""
      decoding="async"
      className="absolute inset-0 size-full object-cover"
    />
  ) : (
    <video
      ref={video}
      key={project.id}
      src={previewSrc(project.id)}
      poster={posterSrc(project.id)}
      muted
      loop
      playsInline
      autoPlay
      preload="metadata"
      className="absolute inset-0 size-full object-cover"
    />
  );

  return <div className={cn("relative overflow-hidden bg-card", className)}>{player}</div>;
}
