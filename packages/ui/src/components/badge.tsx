import * as React from 'react';
import { cva,type VariantProps } from 'class-variance-authority';
import { cn } from '../lib/utils';
const styles=cva('inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium',{variants:{tone:{mint:'bg-mint text-[#21352D]',coral:'bg-coral text-[#21352D]',butter:'bg-butter text-[#21352D]',sky:'bg-sky text-[#21352D]',neutral:'bg-muted text-foreground'}},defaultVariants:{tone:'mint'}});
export function Badge({className,tone,...props}:React.ComponentProps<'span'> & VariantProps<typeof styles>){return <span data-polli="badge" className={cn(styles({tone}),className)} {...props}/>}
