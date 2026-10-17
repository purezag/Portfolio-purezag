const cache = new Map<string, Promise<HTMLImageElement>>();

export const PORTRAIT_SRC = "/media/me/portrait-800.webp";
export const PORTRAIT_HD_SRC = "/media/me/portrait-1400.webp";
export const ABOUT_SRC = "/media/me/about-1400.webp";

export function loadImage(src: string) {
  const cached = cache.get(src);
  if (cached) return cached;
  const promise = new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.decoding = "async";
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = src;
  });
  cache.set(src, promise);
  return promise;
}
