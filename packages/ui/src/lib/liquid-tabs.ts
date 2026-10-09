'use client';
import * as React from 'react';

/**
 * The page is the paper. Only the selected tab gets a small stroke of
 * coloured ink; the contour is a single SVG path, never overlapping blobs.
 *
 * Uses the fastest setting from the approved single-contour prototype:
 * 19 longitudinal spring points, 0% deformation, no animated mount state.
 */
const COUNT = 19;
const SPRING = 560;
const DAMPING = 25;
const NEIGHBOUR = 52;
const TONES: Record<string, string> = {
  green: '#016630',
  butter: '#F8D978',
  coral: '#F3A6A0',
  sky: '#A8D5F2',
  mint: '#D9EEDD',
};
type Point = { u: number; x: number; v: number };
const clamp = (value: number, low: number, high: number) => Math.max(low, Math.min(high, value));
const restHeight = (u: number) => 6.1 * (.19 + .81 * Math.pow(Math.max(0, 1 - Math.pow(Math.abs(u), 4)), .43));

function closedSpline(points: { x: number; y: number }[]) {
  const n = points.length;
  let result = `M ${points[0].x.toFixed(2)} ${points[0].y.toFixed(2)}`;
  for (let i = 0; i < n; i++) {
    const previous = points[(i + n - 1) % n];
    const start = points[i];
    const end = points[(i + 1) % n];
    const following = points[(i + 2) % n];
    result += ` C ${(start.x + (end.x - previous.x) / 6).toFixed(2)} ${(start.y + (end.y - previous.y) / 6).toFixed(2)} ${(end.x - (following.x - start.x) / 6).toFixed(2)} ${(end.y - (following.y - start.y) / 6).toFixed(2)} ${end.x.toFixed(2)} ${end.y.toFixed(2)}`;
  }
  return result + ' Z';
}

/** Attaches to a Radix tab list; Radix still owns focus, selection, and keyboard input. */
export function useLiquidTabs(listRef: React.RefObject<HTMLDivElement | null>) {
  React.useEffect(() => {
    const list = listRef.current;
    const svg = list?.querySelector<SVGSVGElement>('[data-polli="liquid-tabs-ink"]');
    const path = svg?.querySelector<SVGPathElement>('path');
    if (!list || !svg || !path) return;

    const particles: Point[] = Array.from({ length: COUNT }, (_, i) => ({
      u: 2 * i / (COUNT - 1) - 1, x: 0, v: 0,
    }));
    const media = typeof window.matchMedia === 'function' ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
    let selected: Element | null = null;
    let target = 0;
    let halfWidth = 19;
    let baseline = 0;
    let direction = 1;
    let frame = 0;
    let last = 0;
    let elapsed = 0;
    let mounted = false;

    const draw = () => {
      const upper = particles.map(p => ({ x: p.x, y: baseline - restHeight(p.u) }));
      const lower = [...particles].reverse().map(p => ({ x: p.x, y: baseline + restHeight(p.u) }));
      path.setAttribute('d', closedSpline([...upper, ...lower]));
    };
    const snap = () => {
      particles.forEach(p => { p.x = target + p.u * halfWidth; p.v = 0; });
      draw();
    };
    const stop = () => {
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
      last = 0;
    };
    const advance = (time: number) => {
      if (!last) last = time;
      const dt = clamp((time - last) / 1000, .001, .032);
      last = time;
      elapsed += dt;
      const steps = 4;
      const h = dt / steps;
      for (let step = 0; step < steps; step++) {
        const accelerations = particles.map((p, i) => {
          const goal = target + p.u * halfWidth;
          const leading = 1 + direction * p.u * .58;
          const prior = particles[Math.max(0, i - 1)].x;
          const following = particles[Math.min(COUNT - 1, i + 1)].x;
          const neighbour = (i === 0 || i === COUNT - 1) ? 0 : NEIGHBOUR * (prior + following - 2 * p.x);
          return (goal - p.x) * SPRING * leading - p.v * DAMPING + neighbour;
        });
        particles.forEach((p, i) => { p.v += accelerations[i] * h; p.x += p.v * h; });
        for (let i = 1; i < COUNT; i++) {
          if (particles[i].x < particles[i - 1].x + .7) {
            particles[i].x = particles[i - 1].x + .7;
            particles[i].v = Math.max(particles[i].v, particles[i - 1].v * .42);
          }
        }
      }
      draw();
      const energy = Math.max(...particles.map(p => Math.max(Math.abs(p.x - target - p.u * halfWidth), Math.abs(p.v) * .045)));
      if (energy > .045 && elapsed < 2.7) frame = requestAnimationFrame(advance);
      else { stop(); snap(); }
    };
    const measure = (resize = false) => {
      const active = list.querySelector('[data-polli="tabs-trigger"][data-state="active"]');
      if (!active) { list.removeAttribute('data-polli-liquid-ready'); return; }
      const listBox = list.getBoundingClientRect();
      const tabBox = active.getBoundingClientRect();
      const oldTarget = target;
      const change = mounted && active !== selected;
      selected = active;
      target = tabBox.left - listBox.left + tabBox.width / 2 + list.scrollLeft;
      halfWidth = Math.max(18, tabBox.width / 2 + 9);
      baseline = list.clientHeight - 3;
      svg.setAttribute('viewBox', `0 0 ${Math.max(1, list.scrollWidth)} ${Math.max(1, list.clientHeight)}`);
      const tone = (active as HTMLElement).dataset.polliInkTone ?? 'butter';
      path.setAttribute('fill', TONES[tone] ?? TONES.butter);
      list.setAttribute('data-polli-liquid-ready', 'true');
      if (!mounted || resize || media?.matches) { stop(); snap(); }
      else if (change) {
        direction = Math.sign(target - oldTarget) || direction;
        stop();
        elapsed = 0;
        frame = requestAnimationFrame(advance);
      }
      mounted = true;
    };

    measure();
    const observer = new MutationObserver(() => measure());
    observer.observe(list, { subtree: true, attributes: true, attributeFilter: ['data-state'] });
    const resize = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(() => measure(true));
    resize?.observe(list);
    list.querySelectorAll('[data-polli="tabs-trigger"]').forEach(tab => resize?.observe(tab));
    const onMotionChange = () => { if (media?.matches) { stop(); snap(); } };
    media?.addEventListener?.('change', onMotionChange);
    const onScroll = () => measure(true);
    list.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      stop();
      observer.disconnect();
      resize?.disconnect();
      media?.removeEventListener?.('change', onMotionChange);
      list.removeEventListener('scroll', onScroll);
    };
  }, [listRef]);
}
