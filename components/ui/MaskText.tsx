"use client";

import { motion, useInView } from "motion/react";
import { useRef } from "react";
import clsx from "clsx";

// Satırları maskenin altından yukarı kaydırarak gösterir (başlıklar için).
// Görünürlük kapsayıcıdan izlenir: maskelenen satırın kendisi hiç "görünür" sayılmaz.
export default function MaskText({
  lines,
  className,
  lineClassName,
  delay = 0,
  inView = true,
  as: Tag = "h2",
}: {
  lines: React.ReactNode[];
  className?: string;
  lineClassName?: (i: number) => string | undefined;
  delay?: number;
  inView?: boolean;
  as?: "h1" | "h2" | "h3" | "p";
}) {
  const ref = useRef<HTMLHeadingElement>(null);
  const seen = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const show = !inView || seen;

  return (
    <Tag ref={ref} className={className}>
      {lines.map((line, i) => (
        <span key={i} className="block overflow-hidden pb-[0.08em]">
          <motion.span
            className={clsx("block", lineClassName?.(i))}
            initial={{ y: "110%" }}
            animate={show ? { y: "0%" } : undefined}
            transition={{ duration: 1.2, delay: delay + i * 0.12, ease: [0.22, 1, 0.36, 1] }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}
