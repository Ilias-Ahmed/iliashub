"use client";

import { cn } from "@/lib/utils";
import { useInView } from "framer-motion";
import {
  Children,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

interface SequenceContextValue {
  completeItem: (index: number) => void;
  activeIndex: number;
  sequenceStarted: boolean;
}

const SequenceContext = createContext<SequenceContextValue | null>(null);
const useSequence = () => useContext(SequenceContext);
const ItemIndexContext = createContext<number | null>(null);
const useItemIndex = () => useContext(ItemIndexContext);

interface AnimatedSpanProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  startOnView?: boolean;
  style?: React.CSSProperties;
}

export const AnimatedSpan = ({
  children,
  delay = 0,
  className,
  startOnView = false,
  style,
}: AnimatedSpanProps) => {
  const elementRef = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(elementRef as React.RefObject<Element>, {
    amount: 0.3,
    once: true,
  });

  const sequence = useSequence();
  const itemIndex = useItemIndex();
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    if (!sequence || itemIndex === null) return;
    if (!sequence.sequenceStarted) return;
    if (hasStarted) return;
    if (sequence.activeIndex === itemIndex) {
      setHasStarted(true);
    }
  }, [
    sequence,
    sequence?.activeIndex,
    sequence?.sequenceStarted,
    hasStarted,
    itemIndex,
  ]);

  const shouldAnimate = sequence ? hasStarted : startOnView ? isInView : true;

  return (
    <div
      ref={elementRef}
      className={cn(
        "grid text-sm font-normal tracking-tight transition-all duration-300",
        shouldAnimate
          ? "opacity-100 translate-y-0"
          : "opacity-0 -translate-y-1",
        className
      )}
      style={{
        transitionDelay: sequence ? "0ms" : `${delay}ms`,
        ...style,
      }}
      onTransitionEnd={() => {
        if (!sequence || !shouldAnimate || itemIndex === null) return;
        sequence.completeItem(itemIndex);
      }}
    >
      {children}
    </div>
  );
};

interface TypingAnimationProps {
  children: string;
  className?: string;
  duration?: number;
  delay?: number;
  as?: React.ElementType;
  startOnView?: boolean;
}

export const TypingAnimation = ({
  children,
  className,
  duration = 60,
  delay = 0,
  as: Component = "span",
  startOnView = true,
}: TypingAnimationProps) => {
  if (typeof children !== "string") {
    throw new Error("TypingAnimation: children must be a string");
  }

  const [displayedText, setDisplayedText] = useState<string>("");
  const [started, setStarted] = useState(false);
  const elementRef = useRef<HTMLElement | null>(null);
  const isInView = useInView(elementRef as React.RefObject<Element>, {
    amount: 0.3,
    once: true,
  });

  const sequence = useSequence();
  const itemIndex = useItemIndex();

  useEffect(() => {
    if (sequence && itemIndex !== null) {
      if (!sequence.sequenceStarted || started) return;
      if (sequence.activeIndex === itemIndex) {
        setStarted(true);
      }
      return;
    }

    if (!startOnView) {
      const startTimeout = setTimeout(() => setStarted(true), delay);
      return () => clearTimeout(startTimeout);
    }

    if (!isInView) return;

    const startTimeout = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(startTimeout);
  }, [
    delay,
    startOnView,
    isInView,
    started,
    sequence,
    sequence?.activeIndex,
    sequence?.sequenceStarted,
    itemIndex,
  ]);

  useEffect(() => {
    if (!started) return;

    let i = 0;
    const typingEffect = setInterval(() => {
      if (i < children.length) {
        setDisplayedText(children.substring(0, i + 1));
        i++;
      } else {
        clearInterval(typingEffect);
        if (sequence && itemIndex !== null) {
          sequence.completeItem(itemIndex);
        }
      }
    }, duration);

    return () => clearInterval(typingEffect);
  }, [children, duration, started, sequence, itemIndex]);

  const FinalComponent = Component as React.ElementType;

  return (
    <FinalComponent
      ref={elementRef}
      className={cn("text-sm font-normal tracking-tight", className)}
    >
      {displayedText}
    </FinalComponent>
  );
};

interface TerminalProps {
  children: React.ReactNode;
  className?: string;
  sequence?: boolean;
  startOnView?: boolean;
  loop?: boolean;
  loopDelay?: number;
}

export const Terminal = ({
  children,
  className,
  sequence = true,
  startOnView = true,
  loop = false,
  loopDelay = 1200,
}: TerminalProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(containerRef as React.RefObject<Element>, {
    amount: 0.3,
    once: true,
  });

  const [activeIndex, setActiveIndex] = useState(0);
  const [cycle, setCycle] = useState(0);
  const sequenceHasStarted = sequence ? !startOnView || isInView : false;
  const childArray = useMemo(() => Children.toArray(children), [children]);
  const childCount = childArray.length;

  // Disable loop by default for performance - only loop once max
  useEffect(() => {
    if (!sequence || !loop) return;
    if (activeIndex < childCount) return;
    if (cycle >= 1) return; // Stop after 1 loop to prevent infinite resource usage

    const t = setTimeout(() => {
      setActiveIndex(0);
      setCycle((c) => c + 1);
    }, Math.max(0, loopDelay));

    return () => clearTimeout(t);
  }, [activeIndex, childCount, loop, loopDelay, sequence, cycle]);

  const contextValue = useMemo<SequenceContextValue | null>(() => {
    if (!sequence) return null;
    return {
      completeItem: (index: number) => {
        setActiveIndex((current) =>
          index === current ? current + 1 : current
        );
      },
      activeIndex,
      sequenceStarted: sequenceHasStarted,
    };
  }, [sequence, activeIndex, sequenceHasStarted]);

  const wrappedChildren = useMemo(() => {
    if (!sequence) return children;
    return childArray.map((child, index) => (
      <ItemIndexContext.Provider key={`${cycle}-${index}`} value={index}>
        {child as React.ReactNode}
      </ItemIndexContext.Provider>
    ));
  }, [childArray, children, sequence, cycle]);

  const content = (
    <div
      ref={containerRef}
      className={cn(
        "z-0 h-full max-h-[400px] w-full max-w-lg rounded-xl border border-border bg-background",
        className
      )}
    >
      <div className="flex flex-col gap-y-2 border-b border-border p-4">
        <div className="flex flex-row gap-x-2">
          <div className="h-2 w-2 rounded-full bg-red-500"></div>
          <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
          <div className="h-2 w-2 rounded-full bg-green-500"></div>
        </div>
      </div>
      <pre className="p-4">
        <code className="grid gap-y-1 overflow-auto">{wrappedChildren}</code>
      </pre>
    </div>
  );

  if (!sequence) return content;

  return (
    <SequenceContext.Provider value={contextValue}>
      {content}
    </SequenceContext.Provider>
  );
};
