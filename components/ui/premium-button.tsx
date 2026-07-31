"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  href: string;
  children: React.ReactNode;
  className?: string;
  secondary?: boolean;
}

export function PremiumButton({
  href,
  children,
  className,
  secondary,
}: Props) {
  return (
    <motion.div
      whileHover={{
        y: -3,
        scale: 1.02,
      }}
      whileTap={{
        scale: 0.98,
      }}
    >
      <Link
        href={href}
        className={cn(
          `
          group
          inline-flex
          items-center
          gap-3
          rounded-2xl
          px-8
          py-4
          font-medium
          transition-all
          duration-300
          `,
          secondary
            ? `
              border
              border-navy-500/15
              bg-white/60
              text-slate-900
              backdrop-blur-xl
              hover:bg-white
              dark:bg-white/5
              dark:text-white
              `
            : `
              bg-navy-700
              text-white
              shadow-lg
              shadow-navy-600/20
              hover:bg-navy-600
              `,
          className
        )}
      >
        {children}

        <ArrowRight
          size={18}
          className="
            transition-transform
            duration-300
            group-hover:translate-x-1
          "
        />
      </Link>
    </motion.div>
  );
}