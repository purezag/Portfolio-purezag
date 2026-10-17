import type { SVGProps } from "react";
import { LOGO_PATH, LOGO_VIEWBOX } from "@/lib/logo";

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox={LOGO_VIEWBOX} fill="currentColor" aria-hidden="true" {...props}>
      <path d={LOGO_PATH} fillRule="evenodd" />
    </svg>
  );
}
