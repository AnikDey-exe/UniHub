'use client';

import * as React from 'react'
import {
  ClipLoader,
  BeatLoader,
  PulseLoader,
  BounceLoader,
  CircleLoader,
  RingLoader,
  DotLoader,
  HashLoader,
  BarLoader,
  ClimbingBoxLoader,
  FadeLoader,
  MoonLoader,
  PacmanLoader,
  PropagateLoader,
  ScaleLoader,
  SyncLoader,
} from 'react-spinners';
import { cn } from '@/utils/cn';

type LoadingProps = {
  variant?: 'spinner' | 'dots' | 'pulse' | 'bounce' | 'ring';
  size?: 'sm' | 'md' | 'lg';
  text?: string;
};

export function Loading({ 
  variant = 'spinner', 
  size = 'md',
  text,
  className,
  ...props
}: LoadingProps & React.ComponentProps<'div'>) {
  const color = 'hsl(var(--primary))';
  
  const sizes = {
    sm: { spinner: 30, dots: 8 },
    md: { spinner: 50, dots: 12 },
    lg: { spinner: 70, dots: 16 }
  };

  const getSpinner = () => {
    switch (variant) {
      case 'spinner':
        return <ClipLoader color={color} size={sizes[size].spinner} />;
      case 'dots':
        return <BeatLoader color={color} size={sizes[size].dots} />;
      case 'pulse':
        return <PulseLoader color={color} size={sizes[size].dots} />;
      case 'bounce':
        return <BounceLoader color={color} size={sizes[size].spinner} />;
      case 'ring':
        return <RingLoader color={color} size={sizes[size].spinner} />;
      default:
        return <ClipLoader color={color} size={sizes[size].spinner} />;
    }
  };

  return (
    <div 
      data-slot="loading"
      className={cn(
        'flex flex-col items-center justify-center gap-4 p-8',
        className
      )}
      {...props}
    >
      {getSpinner()}
      {text && <p className="text-muted-foreground text-sm">{text}</p>}
    </div>
  );
}

export function PageLoading({ text = 'Loading...' }: { text?: string }) {
  const color = 'hsl(var(--primary))';
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background">
      <ClipLoader color={color} size={60} />
      <p className="mt-4 text-muted-foreground">{text}</p>
    </div>
  );
}

export function SectionLoading({ 
  height = 'auto',
  text,
  className,
  spinnerSize = 20,
  ...props
}: { 
  height?: string | number;
  text?: string;
  spinnerSize?: number;
} & React.ComponentProps<'div'>) {
    const color = typeof window !== 'undefined' ? getComputedStyle(document.documentElement).getPropertyValue('--primary').trim() : '#1e49b7';
  
  return (
    <div 
      data-slot="section-loading"
      className={cn(
        'flex flex-col items-center justify-center p-12',
        className
      )}
      style={{ minHeight: height }}
      {...props}
    >
      <PulseLoader color={color} size={spinnerSize} />
      {text && <p className="mt-4 text-muted-foreground text-sm">{text}</p>}
    </div>
  );
}

export function InlineLoading({ 
  size = 'sm',
  text 
}: { 
  size?: 'sm' | 'md';
  text?: string;
}) {
  const color = 'hsl(var(--primary))';
  const spinnerSize = size === 'sm' ? 20 : 30;

  return (
    <div className="flex items-center gap-2">
      <ClipLoader color={color} size={spinnerSize} />
      {text && <span className="text-muted-foreground text-sm">{text}</span>}
    </div>
  );
}

export function ButtonLoading() {
  const color = 'hsl(var(--primary-foreground))';
  
  return (
    <div className="flex items-center justify-center">
      <ClipLoader color={color} size={20} />
    </div>
  );
}

export function OverlayLoading({ 
  isLoading,
  children 
}: { 
  isLoading: boolean;
  children: React.ReactNode;
}) {
  const color = 'hsl(var(--primary))';
  
  return (
    <div className="relative">
      {children}
      {isLoading && (
        <div className="absolute inset-0 bg-background/75 flex items-center justify-center z-50 backdrop-blur-sm">
          <ClipLoader color={color} size={50} />
        </div>
      )}
    </div>
  );
}

export function CardLoading() {
  const color = 'hsl(var(--primary))';
  
  return (
    <div className="border border-border rounded-lg p-8 bg-card shadow-sm">
      <div className="flex flex-col items-center justify-center">
        <DotLoader color={color} size={50} />
        <p className="mt-4 text-muted-foreground">Loading content...</p>
      </div>
    </div>
  );
}

export function LoadingVariants() {
  const primary = 'hsl(var(--primary))';
  const secondary = 'hsl(var(--secondary))';
  const accent = 'hsl(var(--accent))';
  
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 p-8">
      <div className="flex flex-col items-center gap-2">
        <ClipLoader color={primary} size={50} />
        <span className="text-sm text-muted-foreground">Clip</span>
      </div>

      <div className="flex flex-col items-center gap-2">
        <BeatLoader color={secondary} size={12} />
        <span className="text-sm text-muted-foreground">Beat</span>
      </div>

      <div className="flex flex-col items-center gap-2">
        <PulseLoader color={accent} size={12} />
        <span className="text-sm text-muted-foreground">Pulse</span>
      </div>

      <div className="flex flex-col items-center gap-2">
        <BounceLoader color={primary} size={50} />
        <span className="text-sm text-muted-foreground">Bounce</span>
      </div>

      <div className="flex flex-col items-center gap-2">
        <CircleLoader color={secondary} size={50} />
        <span className="text-sm text-muted-foreground">Circle</span>
      </div>

      <div className="flex flex-col items-center gap-2">
        <RingLoader color={accent} size={50} />
        <span className="text-sm text-muted-foreground">Ring</span>
      </div>

      <div className="flex flex-col items-center gap-2">
        <DotLoader color={primary} size={50} />
        <span className="text-sm text-muted-foreground">Dot</span>
      </div>

      <div className="flex flex-col items-center gap-2">
        <HashLoader color={secondary} size={50} />
        <span className="text-sm text-muted-foreground">Hash</span>
      </div>

      <div className="flex flex-col items-center gap-2">
        <MoonLoader color={accent} size={50} />
        <span className="text-sm text-muted-foreground">Moon</span>
      </div>

      <div className="flex flex-col items-center gap-2">
        <ScaleLoader color={primary} height={35} />
        <span className="text-sm text-muted-foreground">Scale</span>
      </div>

      <div className="flex flex-col items-center gap-2">
        <SyncLoader color={secondary} size={10} />
        <span className="text-sm text-muted-foreground">Sync</span>
      </div>

      <div className="flex flex-col items-center gap-2">
        <FadeLoader color={accent} />
        <span className="text-sm text-muted-foreground">Fade</span>
      </div>
    </div>
  );
}

export function BarLoading({ width = 200 }: { width?: number }) {
  const color = 'hsl(var(--primary))';
  
  return (
    <div className="flex flex-col items-center gap-2">
      <BarLoader color={color} width={width} height={4} />
      <span className="text-sm text-muted-foreground">Loading...</span>
    </div>
  );
}

export function ClimbingBoxLoading() {
  const color = 'hsl(var(--primary))';
  
  return (
    <div className="flex flex-col items-center">
      <ClimbingBoxLoader color={color} size={15} />
      <p className="mt-4 text-muted-foreground">Processing...</p>
    </div>
  );
}

export function PacmanLoading() {
  const color = 'hsl(var(--accent))';
  
  return (
    <div className="flex flex-col items-center">
      <PacmanLoader color={color} size={25} />
      <p className="mt-4 text-muted-foreground">Loading...</p>
    </div>
  );
}

export function PropagateLoading() {
  const color = 'hsl(var(--secondary))';
  
  return (
    <div className="flex flex-col items-center">
      <PropagateLoader color={color} size={15} />
      <p className="mt-4 text-muted-foreground">Syncing...</p>
    </div>
  );
}