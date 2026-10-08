'use client';
import * as React from 'react';
import * as Check from '@radix-ui/react-checkbox';
import * as Toggle from '@radix-ui/react-switch';
import { CheckIcon,Minus } from 'lucide-react';
import { cn } from '../lib/utils';
export const Checkbox=React.forwardRef<React.ElementRef<typeof Check.Root>,React.ComponentPropsWithoutRef<typeof Check.Root>>(({className,checked,...props},ref)=><Check.Root data-polli="checkbox" ref={ref} checked={checked} className={cn('inline-flex size-5 shrink-0 items-center justify-center rounded-md border border-border bg-background text-primary-foreground data-[state=checked]:border-primary data-[state=checked]:bg-primary data-[state=indeterminate]:bg-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring disabled:opacity-50',className)} {...props}><Check.Indicator>{checked==='indeterminate'?<Minus size={14}/>:<CheckIcon size={14}/>}</Check.Indicator></Check.Root>); Checkbox.displayName='Checkbox';
export const Switch=React.forwardRef<React.ElementRef<typeof Toggle.Root>,React.ComponentPropsWithoutRef<typeof Toggle.Root>>(({className,...props},ref)=><Toggle.Root data-polli="switch" ref={ref} className={cn('inline-flex h-7 w-12 shrink-0 items-center rounded-full border-0 bg-border p-1 data-[state=checked]:bg-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring disabled:opacity-50',className)} {...props}><Toggle.Thumb className="block size-5 rounded-full bg-background transition-transform data-[state=checked]:translate-x-5"/></Toggle.Root>); Switch.displayName='Switch';
