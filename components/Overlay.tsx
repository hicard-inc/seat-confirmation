// components/Overlay.tsx
// 共通ダークオーバーレイ背景
"use client";

import { motion } from "framer-motion";

interface OverlayProps {
  children: React.ReactNode;
}

export default function Overlay({ children }: OverlayProps) {
  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center"
      style={{ backgroundColor: "rgba(8, 9, 11, 0.9)" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
}
