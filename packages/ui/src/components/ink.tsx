'use client';
import * as React from 'react';
import { cn } from '../lib/utils';
import { useActionRevision } from '../lib/motion';
import type { ActionKey } from './animated-icon';

export type InkTextProps = React.ComponentPropsWithoutRef<'span'> & {
  crossedOut?: boolean;
  /** Increment after a successful edit to leave a brief finishing underline. */
  underlineKey?: ActionKey;
};

export const InkText = React.forwardRef<HTMLSpanElement, InkTextProps>(
  ({ crossedOut = false, underlineKey, className, children, ...props }, ref) => {
    const revision = useActionRevision(underlineKey);
    return <span ref={ref} data-polli="ink-text" data-crossed-out={crossedOut || undefined}
      className={cn('polli-handwritten', className)} {...props}>
      <span data-polli="ink-words">{children}</span>
      <span key={revision} data-polli="ink-underline" data-polli-motion={revision ? 'interaction' : undefined} aria-hidden="true" />
    </span>;
  },
);
InkText.displayName = 'InkText';

export type InkRemovalProps = React.ComponentPropsWithoutRef<'div'> & {
  removed: boolean;
  /** Commit deletion after the mark and gap closure finish. */
  onExitComplete: () => void;
};

export function InkRemoval({ removed, onExitComplete, children, className, onAnimationEnd, ...props }: InkRemovalProps) {
  const revision = useActionRevision(removed);
  const completed = React.useRef(false);
  const complete = React.useCallback(() => {
    if (!completed.current) {
      completed.current = true;
      onExitComplete();
    }
  }, [onExitComplete]);

  React.useEffect(() => {
    if (!removed) { completed.current = false; return; }
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const finishIfStill = () => { if (!revision || media.matches) complete(); };
    finishIfStill();
    media.addEventListener('change', finishIfStill);
    return () => media.removeEventListener('change', finishIfStill);
  }, [removed, revision, complete]);

  return <div data-polli="ink-removal" data-removed={removed || undefined}
    data-polli-motion={revision ? 'interaction' : undefined} className={className}
    inert={removed || undefined} {...props} onAnimationEnd={event => {
      onAnimationEnd?.(event);
      if (removed && event.target === event.currentTarget && event.animationName === 'polli-close-gap') complete();
    }}>
    <div data-polli="ink-removal-content">{children}</div>
  </div>;
}
