// components/SeatCard.tsx
// 画面2: シートカード表示＋スワイプアップ操作
"use client";

import { motion, useMotionValue, useTransform, PanInfo } from "framer-motion";
import { SeatInfo } from "@/lib/types";

interface SeatCardProps {
  seatInfo: SeatInfo;
  onSwipeComplete: () => void;
  onCancel: () => void;
}

export default function SeatCard({
  seatInfo,
  onSwipeComplete,
  onCancel,
}: SeatCardProps) {
  const y = useMotionValue(0);
  const opacity = useTransform(y, [-200, 0], [0.5, 1]);
  const scale = useTransform(y, [-200, 0], [0.95, 1]);

  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.y < -120 || info.velocity.y < -500) {
      onSwipeComplete();
    }
  };

  return (
    <div className="fixed inset-0 flex flex-col items-center" style={{ backgroundColor: "rgba(8, 9, 11, 0.9)" }}>
      {/* ゲーム情報ヘッダー */}
      <motion.div
        className="flex flex-col items-center mt-[80px] mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-white text-[24px] font-black tracking-[-0.48px]">
          {seatInfo.gameTitle}
        </h2>
        <p className="text-[rgba(255,255,255,0.6)] text-[14px] font-bold mt-1">
          {seatInfo.eventName}
        </p>
        <div
          className="mt-3 flex items-center gap-1 px-2 py-1.5 rounded"
          style={{ backgroundColor: "rgba(8,9,11,0.5)" }}
        >
          <span className="text-[rgba(255,255,255,0.8)] text-[14px]">
            {seatInfo.deadline}
          </span>
          <span className="text-[#1B9E1D] text-[14px] font-bold ml-1">
            受付中
          </span>
        </div>
      </motion.div>

      {/* シートカード（ドラッグ可能） */}
      <motion.div
        className="relative cursor-grab active:cursor-grabbing"
        style={{ y, opacity, scale, touchAction: "none" }}
        drag="y"
        dragConstraints={{ top: -300, bottom: 0 }}
        dragElastic={0.2}
        onDragEnd={handleDragEnd}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", damping: 20, stiffness: 200, delay: 0.3 }}
      >
        <div className="w-[361px] max-w-[calc(100vw-32px)] bg-white rounded-[24px] overflow-hidden">
          {/* カード内容 */}
          <div className="relative h-[90px] flex items-center px-6">
            {/* プレイヤー番号 + アバター */}
            <div className="relative">
              <div
                className="w-[76px] h-[76px] rounded-full flex items-center justify-center"
                style={{ backgroundColor: seatInfo.tableColor }}
              >
                <span className="text-white text-[36px] font-bold">
                  {seatInfo.playerNumber}
                </span>
              </div>
            </div>

            {/* テーブル名 */}
            <div className="ml-4 flex-1">
              <p className="text-[10px]" style={{ color: "rgba(8,9,11,0.4)" }}>
                Table
              </p>
              <p
                className="text-[36px] font-bold leading-tight"
                style={{ color: seatInfo.tableColor }}
              >
                {seatInfo.tableName}
              </p>
            </div>

            {/* シート番号 */}
            <div className="text-right">
              <p className="text-[10px]" style={{ color: "rgba(8,9,11,0.4)" }}>
                Seat No.
              </p>
              <p className="text-[36px] font-bold text-[#16161B] leading-tight">
                {seatInfo.seatNumber}
              </p>
            </div>
          </div>

          {/* タップ指示エリア */}
          <div className="flex flex-col items-center pb-6 pt-2">
            {/* パルスアニメーション */}
            <div className="relative w-[148px] h-[148px] flex items-center justify-center">
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-[#1B9E1D]"
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.6, 0, 0.6],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              <motion.div
                className="absolute inset-3 rounded-full border-2 border-[#1B9E1D]"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.4, 0, 0.4],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.3,
                }}
              />
              {/* 上向き矢印（スワイプヒント） */}
              <motion.svg
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                stroke="rgba(8,9,11,0.3)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              >
                <path d="M12 19V5M5 12l7-7 7 7" />
              </motion.svg>
            </div>
            <p className="text-[14px] font-bold" style={{ color: "rgba(8,9,11,0.4)" }}>
              スワイプして着席する
            </p>
          </div>
        </div>
      </motion.div>

      {/* キャンセルボタン */}
      <motion.button
        onClick={onCancel}
        className="mt-auto mb-12 text-white text-[14px] font-bold py-3 px-6 rounded-full
                   active:scale-[0.98] transition-transform"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        キャンセル (No)
      </motion.button>
    </div>
  );
}
