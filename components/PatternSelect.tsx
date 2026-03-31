// components/PatternSelect.tsx
// パターン選択画面: スワイプ or タップの着席方法を選択
"use client";

import { motion } from "framer-motion";
import { InteractionMode } from "@/lib/types";

interface PatternSelectProps {
  onSelect: (mode: InteractionMode) => void;
}

export default function PatternSelect({ onSelect }: PatternSelectProps) {
  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center px-6"
      style={{ backgroundColor: "rgba(8, 9, 11, 0.95)" }}
    >
      <motion.div
        className="w-full max-w-[361px] flex flex-col items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        {/* Title */}
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
        >
          <h2 className="text-white text-[24px] font-bold tracking-tight">
            着席方法を選択
          </h2>
          <p className="text-[rgba(255,255,255,0.35)] text-[13px] mt-2 tracking-wide">
            Choose interaction method
          </p>
        </motion.div>

        {/* Options */}
        <div className="w-full flex flex-col gap-3">
          {/* Swipe */}
          <motion.button
            onClick={() => onSelect("swipe")}
            className="w-full rounded-2xl p-5 flex items-center gap-4 text-left
                       border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)]
                       active:bg-[rgba(255,255,255,0.08)] transition-colors"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="w-12 h-12 rounded-xl bg-[rgba(255,255,255,0.06)] flex items-center justify-center flex-shrink-0">
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="rgba(255,255,255,0.6)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 19V5" />
                <path d="M5 12l7-7 7 7" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-white text-[16px] font-semibold">
                スワイプで着席
              </p>
              <p className="text-[rgba(255,255,255,0.35)] text-[12px] mt-0.5">
                Swipe up to confirm
              </p>
            </div>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="rgba(255,255,255,0.15)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 18l6-6-6-6" />
            </svg>
          </motion.button>

          {/* Tap */}
          <motion.button
            onClick={() => onSelect("tap")}
            className="w-full rounded-2xl p-5 flex items-center gap-4 text-left
                       border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)]
                       active:bg-[rgba(255,255,255,0.08)] transition-colors"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="w-12 h-12 rounded-xl bg-[rgba(255,255,255,0.06)] flex items-center justify-center flex-shrink-0">
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="rgba(255,255,255,0.6)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="3" />
                <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-white text-[16px] font-semibold">
                タップで着席
              </p>
              <p className="text-[rgba(255,255,255,0.35)] text-[12px] mt-0.5">
                Tap button to confirm
              </p>
            </div>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="rgba(255,255,255,0.15)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 18l6-6-6-6" />
            </svg>
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
