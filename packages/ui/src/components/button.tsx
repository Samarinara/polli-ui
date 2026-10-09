'use client';
import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../lib/utils';
export const buttonVariants = cva('inline-flex items-center justify-center gap-2 rounded-full border-0 text-sm font-medium focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring disabled:opacity-45 [&_svg]:size-4 shrink-0', { variants: { variant: { default:'bg-primary text-primary-foreground hover:brightness-110', secondary:'bg-mint text-[#21352D] hover:brightness-95', coral:'bg-coral text-[#21352D] hover:brightness-95', butter:'bg-butter text-[#21352D] hover:brightness-95', sky:'bg-sky text-[#21352D] hover:brightness-95', ghost:'bg-transparent text-foreground hover:bg-muted', destructive:'bg-destructive text-background hover:brightness-110' }, size:{ default:'h-11 px-5', sm:'h-9 px-4', lg:'h-12 px-6', icon:'size-11 p-0' } }, defaultVariants:{ variant:'default',size:'default' } });
export type ButtonProps = React.ComponentPropsWithoutRef<'button'> & VariantProps<typeof buttonVariants> & { asChild?: boolean };
export const Button = React.forwardRef<HTMLButtonElement,ButtonProps>(({className,variant,size,asChild=false,type,...props},ref)=>{ const Comp=asChild?Slot:'button'; return <Comp data-polli="button" ref={ref} className={cn(buttonVariants({variant,size}),className)} {...(!asChild?{type:type??'button'}:{})} {...props}/>; });
Button.displayName='Button';
