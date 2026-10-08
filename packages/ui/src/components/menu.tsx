'use client';
import * as React from 'react';
import * as M from '@radix-ui/react-dropdown-menu';
import { cn } from '../lib/utils';
export const DropdownMenu=M.Root,DropdownMenuTrigger=M.Trigger;
export const DropdownMenuContent=React.forwardRef<React.ElementRef<typeof M.Content>,React.ComponentPropsWithoutRef<typeof M.Content>>(({className,sideOffset=6,...props},ref)=><M.Portal><M.Content data-polli="menu" ref={ref} sideOffset={sideOffset} className={cn('polli-root z-50 min-w-44 rounded-xl bg-background p-2 text-foreground shadow-lg',className)} {...props}/></M.Portal>); DropdownMenuContent.displayName='DropdownMenuContent';
export const DropdownMenuItem=React.forwardRef<React.ElementRef<typeof M.Item>,React.ComponentPropsWithoutRef<typeof M.Item>>(({className,...props},ref)=><M.Item data-polli="menu-item" ref={ref} className={cn('flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm outline-none data-[highlighted]:bg-muted data-[disabled]:pointer-events-none data-[disabled]:opacity-50',className)} {...props}/>); DropdownMenuItem.displayName='DropdownMenuItem';
