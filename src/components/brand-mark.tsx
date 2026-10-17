import { cn } from "@/lib/cn";
import type { Project } from "@/lib/projects";

export function BrandMark({ project, className }: { project: Project; className?: string }) {
  if (!project.logo) {
    return (
      <span className={cn("block text-center font-medium tracking-[-0.055em] leading-[0.95]", className)} aria-label={project.name}>
        {project.name}
      </span>
    );
  }

  const mask = `url(${project.logo}) center / contain no-repeat`;
  return (
    <span
      role="img"
      aria-label={project.name}
      className={cn("block bg-current", className)}
      style={{ mask, WebkitMask: mask }}
    />
  );
}
