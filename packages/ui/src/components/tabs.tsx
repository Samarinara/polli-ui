'use client';
import * as React from 'react';
import * as T from '@radix-ui/react-tabs';
import { cn } from '../lib/utils';
export const Tabs=T.Root;
export const TabsList=React.forwardRef<React.ElementRef<typeof T.List>,React.ComponentPropsWithoutRef<typeof T.List>>(({className,...props},ref)=><T.List data-polli="tabs-list" ref={ref} className={cn('inline-flex flex-wrap gap-1 rounded-full bg-muted p-1',className)} {...props}/>); TabsList.displayName='TabsList';
export const TabsTrigger=React.forwardRef<React.ElementRef<typeof T.Trigger>,React.ComponentPropsWithoutRef<typeof T.Trigger>>(({className,...props},ref)=><T.Trigger data-polli="tabs-trigger" ref={ref} className={cn('rounded-full border-0 bg-transparent px-4 py-2 text-sm text-muted-foreground data-[state=active]:bg-background data-[state=active]:text-foreground focus-visible:outline-2 focus-visible:outline-ring disabled:opacity-50',className)} {...props}/>); TabsTrigger.displayName='TabsTrigger';
export const TabsContent=React.forwardRef<React.ElementRef<typeof T.Content>,React.ComponentPropsWithoutRef<typeof T.Content>>(({className,...props},ref)=><T.Content data-polli="tabs-content" ref={ref} className={cn('mt-5 focus-visible:outline-2 focus-visible:outline-ring',className)} {...props}/>); TabsContent.displayName='TabsContent';
