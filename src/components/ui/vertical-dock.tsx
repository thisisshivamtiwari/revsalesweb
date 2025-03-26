'use client';

import {
  motion,
  MotionValue,
  useMotionValue,
  useSpring,
  useTransform,
  type SpringOptions,
  AnimatePresence,
} from 'framer-motion';
import {
  Children,
  cloneElement,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { cn } from '@/lib/utils';

const DOCK_WIDTH = 80;
const DEFAULT_MAGNIFICATION = 56;
const DEFAULT_DISTANCE = 100;
const DEFAULT_PANEL_WIDTH = 72;

type DockProps = {
  children: React.ReactNode;
  className?: string;
  distance?: number;
  panelWidth?: number;
  magnification?: number;
  spring?: SpringOptions;
};

type DockItemProps = {
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
  isActive?: boolean;
};

type DockLabelProps = {
  className?: string;
  children: React.ReactNode;
};

type DockIconProps = {
  className?: string;
  children: React.ReactNode;
};

type DocContextType = {
  mouseY: MotionValue;
  spring: SpringOptions;
  magnification: number;
  distance: number;
};

type DockProviderProps = {
  children: React.ReactNode;
  value: DocContextType;
};

const DockContext = createContext<DocContextType | undefined>(undefined);

function DockProvider({ children, value }: DockProviderProps) {
  return <DockContext.Provider value={value}>{children}</DockContext.Provider>;
}

function useDock() {
  const context = useContext(DockContext);
  if (!context) {
    throw new Error('useDock must be used within an DockProvider');
  }
  return context;
}

function Dock({
  children,
  className,
  spring = { mass: 0.1, stiffness: 150, damping: 12 },
  magnification = DEFAULT_MAGNIFICATION,
  distance = DEFAULT_DISTANCE,
  panelWidth = DEFAULT_PANEL_WIDTH,
}: DockProps) {
  const mouseY = useMotionValue(Infinity);
  const isHovered = useMotionValue(0);

  const maxWidth = useMemo(() => {
    return Math.max(DOCK_WIDTH, magnification + magnification / 2 + 4);
  }, [magnification]);

  const widthRow = useTransform(isHovered, [0, 1], [panelWidth, maxWidth]);
  const width = useSpring(widthRow, spring);

  return (
    <motion.div
      style={{
        width: width,
        scrollbarWidth: 'none',
      }}
      className='flex h-full flex-col items-start'
    >
      <motion.div
        onMouseMove={({ pageY }) => {
          isHovered.set(1);
          mouseY.set(pageY);
        }}
        onMouseLeave={() => {
          isHovered.set(0);
          mouseY.set(Infinity);
        }}
        className={cn(
          'mx-auto flex h-auto w-full flex-col gap-3 rounded-2xl bg-[#242744]/30 py-4 backdrop-blur-lg border border-[#2F304D]/20 shadow-lg',
          className
        )}
        style={{ width: panelWidth }}
        role='navigation'
        aria-label='Application navigation'
      >
        <DockProvider value={{ mouseY, spring, distance, magnification }}>
          {children}
        </DockProvider>
      </motion.div>
    </motion.div>
  );
}

function DockItem({ children, className, onClick, isActive }: DockItemProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { distance, magnification, mouseY, spring } = useDock();
  const isHovered = useMotionValue(0);

  const mouseDistance = useTransform(mouseY, (val) => {
    const domRect = ref.current?.getBoundingClientRect() ?? { y: 0, height: 0 };
    return val - domRect.y - domRect.height / 2;
  });

  const heightTransform = useTransform(
    mouseDistance,
    [-distance, 0, distance],
    [40, magnification, 40]
  );

  const height = useSpring(heightTransform, spring);

  return (
    <motion.div
      ref={ref}
      style={{ height }}
      onHoverStart={() => isHovered.set(1)}
      onHoverEnd={() => isHovered.set(0)}
      onFocus={() => isHovered.set(1)}
      onBlur={() => isHovered.set(0)}
      onClick={onClick}
      className={cn(
        'relative inline-flex w-full cursor-pointer items-center justify-center',
        isActive && 'bg-[#FF5A81]/20',
        className
      )}
      tabIndex={0}
      role='button'
      aria-haspopup='true'
    >
      {Children.map(children, (child) =>
        cloneElement(child as React.ReactElement, { height, isHovered })
      )}
    </motion.div>
  );
}

function DockLabel({ children, className, ...rest }: DockLabelProps) {
  const restProps = rest as Record<string, unknown>;
  const isHovered = restProps['isHovered'] as MotionValue<number>;
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const unsubscribe = isHovered.on('change', (latest) => {
      setIsVisible(latest === 1);
    });
    return () => unsubscribe();
  }, [isHovered]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, x: 0 }}
          animate={{ opacity: 1, x: 10 }}
          exit={{ opacity: 0, x: 0 }}
          transition={{ duration: 0.2 }}
          className={cn(
            'absolute left-full top-1/2 z-50 ml-4 w-fit -translate-y-1/2 whitespace-pre rounded-lg border border-[#2F304D]/20 bg-[#242744] px-3 py-2 text-sm font-medium text-white shadow-lg backdrop-blur-sm',
            className
          )}
          role='tooltip'
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function DockIcon({ children, className, ...rest }: DockIconProps) {
  const restProps = rest as Record<string, unknown>;
  const height = restProps['height'] as MotionValue<number>;
  const heightTransform = useTransform(height, (val) => val / 2);

  return (
    <motion.div
      style={{ height: heightTransform }}
      className={cn('flex items-center justify-center', className)}
    >
      {children}
    </motion.div>
  );
}

export { Dock, DockIcon, DockItem, DockLabel }; 