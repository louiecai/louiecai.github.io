// Canvas (2D context) can't consume CSS custom properties, so read the current
// accent triples off the document element. Returns "r,g,b" strings ready to drop
// into `rgba(...)`. Call again on the `themechange` event to refresh.

export interface Accents {
  cyan: string;
  violet: string;
  /** Slightly stronger line/dot alpha on light backgrounds for legibility. */
  alphaBoost: number;
}

export function readAccents(): Accents {
  if (typeof window === 'undefined') {
    return { cyan: '0,229,255', violet: '179,136,255', alphaBoost: 1 };
  }
  const s = getComputedStyle(document.documentElement);
  const cyan = s.getPropertyValue('--c-cyan').trim().replace(/\s+/g, ',') || '0,229,255';
  const violet = s.getPropertyValue('--c-violet').trim().replace(/\s+/g, ',') || '179,136,255';
  const light = document.documentElement.classList.contains('light');
  return { cyan, violet, alphaBoost: light ? 1.7 : 1 };
}
