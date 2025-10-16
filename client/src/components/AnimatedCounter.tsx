import { useEffect, useRef, useState } from "react";
import { motion, useInView, useSpring, useTransform } from "framer-motion";

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  className?: string;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  formatter?: (value: number) => string;
}

export function AnimatedCounter({
  value,
  duration = 1,
  className = "",
  prefix = "",
  suffix = "",
  decimals = 0,
  formatter,
}: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  const spring = useSpring(0, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const display = useTransform(spring, (latest) => {
    if (formatter) {
      return formatter(latest);
    }
    return latest.toFixed(decimals);
  });

  useEffect(() => {
    if (isInView) {
      spring.set(value);
    }
  }, [value, spring, isInView]);

  const [currentValue, setCurrentValue] = useState("0");

  useEffect(() => {
    return display.on("change", (latest) => {
      setCurrentValue(latest);
    });
  }, [display]);

  return (
    <motion.span
      ref={ref}
      className={className}
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
    >
      {prefix}
      {currentValue}
      {suffix}
    </motion.span>
  );
}
