import { cn } from '../../lib/utils';

export function Button({
  children,
  variant = 'default',
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'default' | 'outline' | 'ghost' }) {
  const base =
    'rounded-xl px-4 py-2 font-medium transition-all focus:outline-none focus:ring-2 focus:ring-brand-200 disabled:opacity-50';

  const variants = {
    default: 'bg-brand-600 text-white hover:bg-brand-700',
    outline: 'border border-gray-300 text-gray-700 hover:bg-gray-100',
    ghost: 'text-gray-600 hover:bg-gray-100',
  };

  return (
    <button className={cn(base, variants[variant], className)} {...props}>
      {children}
    </button>
  );
}
