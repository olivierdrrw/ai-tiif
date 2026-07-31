"use client";

import { Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export function AICompanionHeader() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-4"
    >
      <div className="inline-flex items-center gap-2 rounded-full border border-navy-500/30 bg-navy-500/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-navy-400">
        <Sparkles size={12} />
        Human Twin™ Intelligence
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-navy-400 opacity-75" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-navy-300" />
        </span>
      </div>

      <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
        AI Companion
      </h1>

      <p className="max-w-2xl text-slate-400">
        A trusted guide that helps you reflect, understand patterns, and
        support your growth journey.
      </p>
    </motion.div>
  );
}
