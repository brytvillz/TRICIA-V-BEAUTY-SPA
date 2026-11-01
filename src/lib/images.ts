/** Dimensions of the real photos in /public/images. `sm` is the width of the -sm file. */
export interface ImageInfo {
  w: number;
  h: number;
  sm: number;
}

const gallery: ImageInfo = { w: 900, h: 900, sm: 450 };

const TABLE: Record<string, ImageInfo> = {
  'gallery-01': gallery,
  'gallery-02': gallery,
  'gallery-03': gallery,
  'gallery-04': gallery,
  'gallery-05': gallery,
  'gallery-06': gallery,
  'gallery-07': gallery,
  'gallery-08': gallery,
  'gallery-09': gallery,
  'gallery-teeth': gallery,
  'hero-main': { w: 800, h: 1000, sm: 440 },
  'hero-float-teeth': { w: 600, h: 600, sm: 300 },
  'hero-float-2': { w: 600, h: 600, sm: 300 },
  'hero-float-3': { w: 600, h: 600, sm: 300 },
  'about-poster': { w: 800, h: 1000, sm: 560 },
  frontage: { w: 800, h: 800, sm: 460 },
};

export function imageInfo(name: string): ImageInfo {
  const info = TABLE[name];
  if (!info) throw new Error(`Unknown image "${name}": add it to src/lib/images.ts`);
  return info;
}

/** sizes strings measured from the rendered widths on the original site */
export const SIZES = {
  gallery: '(max-width: 1023px) calc(45vw - 6px), (max-width: 1440px) calc(30vw - 11px), 435px',
  frontage: '(max-width: 1023px) min(460px, 90vw), (max-width: 1288px) 35.7vw, 460px',
  about: '(max-width: 860px) min(420px, 90vw), (max-width: 1240px) 40vw, 500px',
  page: '(max-width: 860px) min(520px, 90vw), 520px',
  pageThumb: '(max-width: 600px) 90vw, 360px',
};
