'use client';
import * as React from 'react';
import * as D from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { cn } from '../lib/utils';
export const Dialog=D.Root,DialogTrigger=D.Trigger,DialogClose=D.Close;
export const DialogTitle=React.forwardRef<React.ElementRef<typeof D.Title>,React.ComponentPropsWithoutRef<typeof D.Title>>(({className,...props},ref)=><D.Title ref={ref} className={cn('m-0 text-2xl font-semibold tracking-tight',className)} {...props}/>); DialogTitle.displayName='DialogTitle';
export const DialogDescription=React.forwardRef<React.ElementRef<typeof D.Description>,React.ComponentPropsWithoutRef<typeof D.Description>>(({className,...props},ref)=><D.Description ref={ref} className={cn('text-sm text-muted-foreground',className)} {...props}/>); DialogDescription.displayName='DialogDescription';
export const DialogContent=React.forwardRef<React.ElementRef<typeof D.Content>,React.ComponentPropsWithoutRef<typeof D.Content>>(({className,children,...props},ref)=><D.Portal><D.Overlay className="fixed inset-0 z-40 bg-black/30"/><D.Content data-polli="dialog" ref={ref} className={cn('polli-root fixed left-1/2 top-1/2 z-50 grid max-h-[85vh] w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 gap-4 overflow-auto rounded-xl bg-background p-8 text-foreground shadow-xl',className)} {...props}>{children}<D.Close aria-label="Close dialog" className="absolute right-4 top-4 rounded-full border-0 bg-transparent p-2 text-muted-foreground hover:bg-muted focus-visible:outline-2 focus-visible:outline-ring"><X size={18}/></D.Close></D.Content></D.Portal>); DialogContent.displayName='DialogContent';
