'use client';
import * as React from 'react';
import * as T from '@radix-ui/react-tooltip';
import { cn } from '../lib/utils';
import { MotionProvider, useMotionState, useMotionAttribute } from '../lib/motion';
export const TooltipProvider=T.Provider,TooltipTrigger=T.Trigger;
export function Tooltip({onOpenChange,...props}:React.ComponentProps<typeof T.Root>){
  const [open,change,motion]=useMotionState(props.open,props.defaultOpen ?? false);
  return <MotionProvider value={motion}><T.Root {...props} open={open} onOpenChange={next=>{change(next);onOpenChange?.(next)}}/></MotionProvider>;
}
export const TooltipContent=React.forwardRef<React.ElementRef<typeof T.Content>,React.ComponentPropsWithoutRef<typeof T.Content>>(({className,sideOffset=6,...props},ref)=><T.Portal><T.Content data-polli="tooltip" data-polli-motion={useMotionAttribute()} ref={ref} sideOffset={sideOffset} className={cn('polli-root z-50 rounded-lg bg-foreground px-3 py-2 text-xs text-background shadow-sm',className)} {...props}/></T.Portal>); TooltipContent.displayName='TooltipContent';
