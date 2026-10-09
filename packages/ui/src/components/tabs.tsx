'use client';
import * as React from 'react';
import * as T from '@radix-ui/react-tabs';
import { cn } from '../lib/utils';
import { MotionProvider, useMotionState, useMotionAttribute } from '../lib/motion';
import { useLiquidTabs } from '../lib/liquid-tabs';

export const Tabs = React.forwardRef<React.ElementRef<typeof T.Root>, React.ComponentPropsWithoutRef<typeof T.Root>>(
  ({ onValueChange, ...props }, ref) => {
    const [value, change, motion] = useMotionState(props.value, props.defaultValue ?? '');
    return <MotionProvider value={motion}>
      <T.Root {...props} ref={ref} value={value} onValueChange={next => { change(next); onValueChange?.(next); }} />
    </MotionProvider>;
  },
);
Tabs.displayName = 'Tabs';

export const TabsList = React.forwardRef<React.ElementRef<typeof T.List>, React.ComponentPropsWithoutRef<typeof T.List>>(
  ({ className, children, ...props }, ref) => {
    const internalRef = React.useRef<HTMLDivElement>(null);
    useLiquidTabs(internalRef);
    const assignRef = (element: HTMLDivElement | null) => {
      internalRef.current = element;
      if (typeof ref === 'function') ref(element);
      else if (ref) ref.current = element;
    };
    return <T.List data-polli="tabs-list" ref={assignRef}
      className={cn('relative flex w-fit max-w-full items-center gap-6 overflow-x-auto border-b border-border', className)}
      {...props}>
      {children}
      <svg data-polli="liquid-tabs-ink" aria-hidden="true" preserveAspectRatio="none">
        <path fill="var(--polli-yellow)" />
      </svg>
    </T.List>;
  },
);
TabsList.displayName = 'TabsList';

export type TabsTriggerProps = React.ComponentPropsWithoutRef<typeof T.Trigger> & {
  /** Pastel used by the selected ink underline. Defaults to butter. */
  inkTone?: 'green' | 'butter' | 'coral' | 'sky' | 'mint';
};
export const TabsTrigger = React.forwardRef<React.ElementRef<typeof T.Trigger>, TabsTriggerProps>(
  ({ className, inkTone = 'butter', ...props }, ref) =>
    <T.Trigger data-polli="tabs-trigger" data-polli-ink-tone={inkTone} ref={ref}
      className={cn('relative shrink-0 border-0 bg-transparent px-0 py-3 pb-5 text-sm text-muted-foreground data-[state=active]:font-semibold data-[state=active]:text-primary focus:outline-none disabled:opacity-50', className)}
      {...props} />,
);
TabsTrigger.displayName = 'TabsTrigger';

export const TabsContent = React.forwardRef<React.ElementRef<typeof T.Content>, React.ComponentPropsWithoutRef<typeof T.Content>>(
  ({ className, ...props }, ref) =>
    <T.Content data-polli="tabs-content" data-polli-motion={useMotionAttribute()} ref={ref}
      className={cn('mt-5 focus:outline-none', className)} {...props} />,
);
TabsContent.displayName = 'TabsContent';
