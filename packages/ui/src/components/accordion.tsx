'use client';
import * as React from 'react';
import * as A from '@radix-ui/react-accordion';
import { ChevronDown } from 'lucide-react';
import { cn } from '../lib/utils';
export const Accordion=A.Root,AccordionItem=A.Item;
export const AccordionTrigger=React.forwardRef<React.ElementRef<typeof A.Trigger>,React.ComponentPropsWithoutRef<typeof A.Trigger>>(({className,children,...props},ref)=><A.Header className="m-0"><A.Trigger data-polli="accordion-trigger" ref={ref} className={cn('group flex w-full items-center justify-between gap-4 rounded-lg border-0 bg-transparent py-4 text-left text-sm font-medium text-foreground hover:bg-muted focus-visible:outline-2 focus-visible:outline-ring',className)} {...props}>{children}<ChevronDown size={16} className="transition-transform group-data-[state=open]:rotate-180"/></A.Trigger></A.Header>); AccordionTrigger.displayName='AccordionTrigger';
export const AccordionContent=React.forwardRef<React.ElementRef<typeof A.Content>,React.ComponentPropsWithoutRef<typeof A.Content>>(({className,...props},ref)=><A.Content data-polli="accordion-content" ref={ref} className={cn('pb-4 text-sm text-muted-foreground',className)} {...props}/>); AccordionContent.displayName='AccordionContent';
