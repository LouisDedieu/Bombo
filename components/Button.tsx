import React from 'react';
import {
  TouchableOpacity,
  Text,
  type TouchableOpacityProps,
  type TextStyle,
} from 'react-native';
import { cva, type VariantProps } from 'class-variance-authority';
import {cn} from "@/components/ui/utils";
import Loader from '@/components/Loader';

// ---------------------------------------------------------------------------
// Variants — mirrors the web buttonVariants 1-to-1
// ---------------------------------------------------------------------------

const buttonVariants = cva(
  // Base — matches: inline-flex items-center justify-center gap-2 rounded-md
  //        text-sm font-semibold shrink-0  +  disabled:opacity-50
  'flex-row items-center justify-center gap-2 rounded-md shrink-0',
  {
    variants: {
      variant: {
        default:     'bg-primary',
        destructive: 'bg-destructive dark:bg-destructive/60',
        outline:     'border border-border bg-background dark:bg-input/30 dark:border-input',
        secondary:   'bg-secondary',
        ghost:       'bg-transparent',
        link:        'bg-transparent',
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm:      'h-8 px-3',
        lg:      'h-10 px-6',
        icon:    'h-9 w-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size:    'default',
    },
  },
);

const buttonTextVariants = cva(
  'text-sm font-semibold',
  {
    variants: {
      variant: {
        default:     'text-primary-foreground',
        destructive: 'text-white',
        outline:     'text-foreground',
        secondary:   'text-secondary-foreground',
        ghost:       'text-accent-foreground',
        link:        'text-primary underline',
      },
      size: {
        default: '',
        sm:      '',
        lg:      '',
        icon:    '',
      },
    },
    defaultVariants: {
      variant: 'default',
      size:    'default',
    },
  },
);

// ---------------------------------------------------------------------------
// Spinner color helper — replaces the old `colors` import
// 'outline' and 'ghost' use the primary/accent colour; everything else white
// ---------------------------------------------------------------------------

function getSpinnerColor(variant: ButtonProps['variant']): string {
  if (variant === 'outline' || variant === 'ghost' || variant === 'link') {
    return '#3b82f6'; // tailwind blue-500 — maps to the "primary" token default
  }
  return '#ffffff';
}

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

export interface ButtonProps
  extends Omit<TouchableOpacityProps, 'style'>,
    VariantProps<typeof buttonVariants> {
  /** Text label (alternative to children) */
  title?: string;
  children?: React.ReactNode;
  /** Show a Loader instead of content */
  loading?: boolean;
  /** Extra class names forwarded to the container */
  className?: string;
  /** Extra class names forwarded to the label */
  textClassName?: string;
  /** Escape-hatch inline style for the label */
  textStyle?: TextStyle;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function Button({
                         // variant / size
                         variant = 'default',
                         size    = 'default',
                         // content
                         title,
                         children,
                         // state
                         loading  = false,
                         disabled = false,
                         // styling
                         className,
                         textClassName,
                         textStyle,
                         // rest forwarded to TouchableOpacity (onPress, testID, accessibilityLabel…)
                         ...props
                       }: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      disabled={isDisabled}
      className={cn(
        buttonVariants({ variant, size }),
        isDisabled && 'opacity-50',
        className,
      )}
      {...props}
    >
      {loading ? (
        <Loader size={20} color={getSpinnerColor(variant)} />
      ) : (
        <Text
          className={cn(buttonTextVariants({ variant, size }), textClassName)}
          style={textStyle}
        >
          {children ?? title}
        </Text>
      )}
    </TouchableOpacity>
  );
}

export { buttonVariants, buttonTextVariants };