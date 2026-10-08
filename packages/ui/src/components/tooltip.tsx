'use client';
import * as React from 'react';
import * as T from '@radix-ui/react-tooltip';
import { cn } from '../lib/utils';
export const TooltipProvider=T.Provider,Tooltip=T.Root,TooltipTrigger=T.Trigger;
export const TooltipContent=React.forwardRef<React.ElementRef<typeof T.Content>,React.ComponentPropsWithoutRef<typeof T.Content>>(({className,sideOffset=6,...props},ref)=><T.Portal><T.Content data-polli="tooltip" ref={ref} sideOffset={sideOffset} className={cn('polli-root z-50 rounded-lg bg-foreground px-3 py-2 text-xs text-background shadow-sm',className)} {...props}/></T.Portal>); TooltipContent.displayName='TooltipContent';
