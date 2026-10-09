import * as React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render } from '@testing-library/react';
import { AnimatedIcon } from '../src/components/animated-icon';
import { InkText, InkRemoval } from '../src/components/ink';

afterEach(() => vi.unstubAllGlobals());

function finishGap(element: Element) {
  // JSDOM does not provide AnimationEvent, so supply the native event field.
  const event = new Event('animationend', { bubbles: true });
  Object.defineProperty(event, 'animationName', { value: 'polli-close-gap' });
  fireEvent(element, event);
}

describe('notebook gesture contracts', () => {
  it('leaves initial active icons still and replays only changed action keys', () => {
    const { container, rerender } = render(<AnimatedIcon name="bookmark" active animationKey={5} />);
    const initial = container.querySelector('g');
    expect(initial).not.toHaveAttribute('data-polli-motion');
    fireEvent.mouseEnter(container.querySelector('svg')!);
    expect(container.querySelector('g')).toBe(initial);
    rerender(<AnimatedIcon name="bookmark" active animationKey={6} />);
    const gesture = container.querySelector('g');
    expect(gesture).not.toBe(initial);
    expect(gesture).toHaveAttribute('data-polli-motion', 'interaction');
    rerender(<AnimatedIcon name="bookmark" active animationKey={6} className="new-style" />);
    expect(container.querySelector('g')).toBe(gesture);
    rerender(<AnimatedIcon name="bookmark" active animationKey={7} />);
    expect(container.querySelector('g')).not.toBe(gesture);
  });

  it('preserves initial marks, and changing words alone never starts an underline', () => {
    const { container, rerender } = render(<InkText crossedOut underlineKey={1}>A completed note</InkText>);
    expect(container.firstChild).toHaveAttribute('data-crossed-out');
    const line = container.querySelector('[data-polli="ink-underline"]');
    expect(line).not.toHaveAttribute('data-polli-motion');
    rerender(<InkText crossedOut underlineKey={1}>An edited note</InkText>);
    expect(container.querySelector('[data-polli="ink-underline"]')).toBe(line);
    rerender(<InkText underlineKey={2}>An edited note</InkText>);
    expect(container.firstChild).not.toHaveAttribute('data-crossed-out');
    expect(container.querySelector('[data-polli="ink-underline"]')).toHaveAttribute('data-polli-motion', 'interaction');
  });

  it('commits removal once after its own animation, and supports cancellation', () => {
    vi.stubGlobal('matchMedia', () => ({ matches: false, addEventListener() {}, removeEventListener() {} }));
    const complete = vi.fn();
    const view = (removed: boolean) => <InkRemoval removed={removed} onExitComplete={complete}><InkText>A note</InkText></InkRemoval>;
    const { container, rerender } = render(view(false));
    rerender(view(true));
    const root = container.firstElementChild!;
    expect(root).toHaveAttribute('inert');
    finishGap(root.querySelector('span')!);
    expect(complete).not.toHaveBeenCalled();
    rerender(view(false));
    finishGap(root);
    expect(complete).not.toHaveBeenCalled();
    rerender(view(true));
    finishGap(root);
    finishGap(root);
    expect(complete).toHaveBeenCalledTimes(1);
  });

  it('finishes immediately if reduced motion is enabled during removal', () => {
    let listener: (() => void) | undefined;
    const media = { matches: false, addEventListener: (_: string, next: () => void) => { listener = next; }, removeEventListener() {} };
    vi.stubGlobal('matchMedia', () => media);
    const complete = vi.fn();
    const { rerender } = render(<InkRemoval removed={false} onExitComplete={complete}>A note</InkRemoval>);
    rerender(<InkRemoval removed onExitComplete={complete}>A note</InkRemoval>);
    expect(complete).not.toHaveBeenCalled();
    media.matches = true;
    listener?.();
    expect(complete).toHaveBeenCalledTimes(1);
  });
});
