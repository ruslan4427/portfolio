"use client";

import { motion, type Variants } from "framer-motion";
import type { ComponentProps, ReactNode } from "react";
import { easeSmooth, usePrefersReducedMotion } from "@/lib/motion";

type MotionTag = "div" | "ul" | "ol" | "section";

type StaggerProps<T extends MotionTag = "div"> = {
  children: ReactNode;
  stagger?: number;
  delayChildren?: number;
  viewportMargin?: string;
  as?: T;
  className?: string;
} & Omit<ComponentProps<T>, "children" | "className">;

export function Stagger<T extends MotionTag = "div">({
  children,
  stagger = 0.14,
  delayChildren = 0.12,
  viewportMargin = "-60px",
  as,
  ...rest
}: StaggerProps<T>) {
  const reduced = usePrefersReducedMotion();

  const parent: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: reduced ? 0 : stagger,
        delayChildren: reduced ? 0 : delayChildren,
      },
    },
  };

  const Component = motion[(as ?? "div") as MotionTag];

  return (
    <Component
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: viewportMargin }}
      variants={parent}
      {...(rest as Record<string, unknown>)}
    >
      {children}
    </Component>
  );
}

type ItemTag = "div" | "li" | "article";

type ItemProps<T extends ItemTag = "div"> = {
  children: ReactNode;
  y?: number;
  duration?: number;
  as?: T;
  className?: string;
} & Omit<ComponentProps<T>, "children" | "className">;

export function StaggerItem<T extends ItemTag = "div">({
  children,
  y = 32,
  duration = 0.85,
  as,
  ...rest
}: ItemProps<T>) {
  const reduced = usePrefersReducedMotion();

  const variants: Variants = {
    hidden: reduced ? { opacity: 0 } : { opacity: 0, y },
    visible: reduced
      ? { opacity: 1, transition: { duration } }
      : { opacity: 1, y: 0, transition: { duration, ease: easeSmooth } },
  };

  const Component = motion[(as ?? "div") as ItemTag];

  return (
    <Component variants={variants} {...(rest as Record<string, unknown>)}>
      {children}
    </Component>
  );
}
