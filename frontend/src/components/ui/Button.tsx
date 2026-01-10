import { ButtonHTMLAttributes, forwardRef } from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aegean-blue disabled:pointer-events-none disabled:opacity-50 font-sans',
          {
            'bg-aegean-blue text-marble-white hover:bg-aegean-blue/90 shadow-md':
              variant === 'primary',
            'bg-bronze-gold text-white hover:bg-bronze-gold/90 shadow-md':
              variant === 'secondary',
            'border border-aegean-blue text-aegean-blue hover:bg-aegean-blue/10':
              variant === 'outline',
            'hover:bg-aegean-blue/10 text-aegean-blue': variant === 'ghost',
            'h-9 px-4 text-sm': size === 'sm',
            'h-10 px-6 py-2': size === 'md',
            'h-12 px-8 text-lg': size === 'lg',
          },
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, cn };
