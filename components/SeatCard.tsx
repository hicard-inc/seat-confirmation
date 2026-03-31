// components/SeatCard.tsx
// 画面2: シートカード + スワイプ/タップ操作 → ディーラー確認（連続フリップアニメーション）
"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence, PanInfo } from "framer-motion";
import { SeatInfo, InteractionMode } from "@/lib/types";

interface SeatCardProps {
  seatInfo: SeatInfo;
  interactionMode: InteractionMode;
  onDealerApprove: () => void;
  onCancel: () => void;
}

type CardPhase = "interact" | "dealer";

export default function SeatCard({
  seatInfo,
  interactionMode,
  onDealerApprove,
  onCancel,
}: SeatCardProps) {
  const [phase, setPhase] = useState<CardPhase>("interact");
  const [flipDistance, setFlipDistance] = useState(-500);
  const cardRef = useRef<HTMLDivElement>(null);
  const isSwipe = interactionMode === "swipe";

  // カードの自然な位置からフリップ先までの距離を計算
  useEffect(() => {
    const calculate = () => {
      const h = window.innerHeight;
      const cardHeight = cardRef.current?.offsetHeight || 180;
      const bottomOffset = 72;
      const naturalTop = h - bottomOffset - cardHeight;
      const targetTop = 60;
      setFlipDistance(targetTop - naturalTop);
    };
    // レイアウト確定後に計算
    const timer = setTimeout(calculate, 50);
    window.addEventListener("resize", calculate);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", calculate);
    };
  }, []);

  const triggerFlip = useCallback(() => {
    const h = window.innerHeight;
    const cardHeight = cardRef.current?.offsetHeight || 180;
    const naturalTop = h - 72 - cardHeight;
    setFlipDistance(60 - naturalTop);
    setPhase("dealer");
  }, []);

  const handleDragEnd = useCallback(
    (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      if (info.offset.y < -100 || info.velocity.y < -500) {
        triggerFlip();
      }
    },
    [triggerFlip]
  );

  // ディーラー画面からのキャンセルはカードを戻す、インタラクト画面からは前の画面へ
  const handleCancel = useCallback(() => {
    if (phase === "dealer") {
      setPhase("interact");
    } else {
      onCancel();
    }
  }, [phase, onCancel]);

  return (
    <div
      className="fixed inset-0"
      style={{ backgroundColor: "rgba(8, 9, 11, 0.95)" }}
    >
      {/* ゲーム情報ヘッダー（プレイヤー向け） */}
      <AnimatePresence>
        {phase === "interact" && (
          <motion.div
            className="absolute top-0 left-0 right-0 pt-20 flex flex-col items-center"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, transition: { duration: 0.2 } }}
            transition={{ delay: 0.1, duration: 0.4 }}
          >
            <h2 className="text-white text-[22px] font-black tracking-tight">
              {seatInfo.gameTitle}
            </h2>
            <p className="text-[rgba(255,255,255,0.45)] text-[14px] font-medium mt-1">
              {seatInfo.eventName}
            </p>
            <div
              className="mt-3 flex items-center gap-1.5 px-3 py-1.5 rounded-full"
              style={{ backgroundColor: "rgba(255,255,255,0.06)" }}
            >
              <span className="text-[rgba(255,255,255,0.6)] text-[13px]">
                {seatInfo.deadline}
              </span>
              <span className="text-[#22C55E] text-[13px] font-bold">
                受付中
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ゲーム情報（ディーラー向け・180度回転） */}
      <AnimatePresence>
        {phase === "dealer" && (
          <motion.div
            className="absolute left-0 right-0 flex flex-col items-center"
            style={{ top: 280, rotate: 180 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.4 }}
          >
            <h2 className="text-white text-[22px] font-black tracking-tight">
              {seatInfo.gameTitle}
            </h2>
            <p className="text-[rgba(255,255,255,0.45)] text-[14px] font-medium mt-1">
              {seatInfo.eventName}
            </p>
            <div
              className="mt-2 flex items-center gap-1.5 px-3 py-1.5 rounded-full"
              style={{ backgroundColor: "rgba(255,255,255,0.06)" }}
            >
              <span className="text-[rgba(255,255,255,0.6)] text-[13px]">
                {seatInfo.deadline}
              </span>
              <span className="text-[#22C55E] text-[13px] font-bold">
                受付中
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* シートカード */}
      <motion.div
        ref={cardRef}
        className="absolute left-1/2 bottom-[72px] w-[361px] max-w-[calc(100vw-32px)]"
        style={{ x: "-50%", touchAction: "none" }}
        drag={phase === "interact" && isSwipe ? "y" : false}
        dragConstraints={{ top: -250, bottom: 0 }}
        dragElastic={0.15}
        onDragEnd={isSwipe ? handleDragEnd : undefined}
        initial={{ y: 40, opacity: 0 }}
        animate={{
          y: phase === "dealer" ? flipDistance : 0,
          rotateZ: phase === "dealer" ? 180 : 0,
          opacity: 1,
        }}
        transition={
          phase === "dealer"
            ? { type: "spring", damping: 25, stiffness: 80, mass: 1.2 }
            : { type: "spring", damping: 28, stiffness: 260 }
        }
      >
        <div className="bg-white rounded-[24px] overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.08)]">
          {/* シート情報 */}
          <div className="h-[90px] flex items-center px-6">
            {/* プレイヤー番号 */}
            <div
              className="w-[76px] h-[76px] rounded-full flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: seatInfo.tableColor }}
            >
              <span className="text-white text-[36px] font-bold">
                {seatInfo.playerNumber}
              </span>
            </div>

            {/* テーブル名 */}
            <div className="ml-4 flex-1 min-w-0">
              <p
                className="text-[10px] tracking-wider uppercase"
                style={{ color: "rgba(8,9,11,0.35)" }}
              >
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
              <p
                className="text-[10px] tracking-wider uppercase"
                style={{ color: "rgba(8,9,11,0.35)" }}
              >
                Seat No.
              </p>
              <p className="text-[36px] font-bold text-[#16161B] leading-tight">
                {seatInfo.seatNumber}
              </p>
            </div>
          </div>

          {/* 下部セクション: インタラクト or ディーラーボタン */}
          {phase === "interact" ? (
            <div className="px-6 pb-5 pt-2">
              {isSwipe ? (
                <div className="flex flex-col items-center gap-2 py-2">
                  <motion.div
                    animate={{ y: [0, -8, 0] }}
                    transition={{
                      duration: 1.8,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    <svg
                      width="24"
                      height="14"
                      viewBox="0 0 24 14"
                      fill="none"
                    >
                      <path
                        d="M2 12L12 2L22 12"
                        stroke="rgba(8,9,11,0.18)"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </motion.div>
                  <p className="text-[13px] font-medium text-[rgba(8,9,11,0.3)]">
                    上にスワイプして着席
                  </p>
                </div>
              ) : (
                <button
                  onClick={triggerFlip}
                  className="w-full bg-[#08090B] text-white rounded-full py-3.5 text-[15px] font-bold
                             active:scale-[0.98] transition-transform"
                >
                  着席する
                </button>
              )}
            </div>
          ) : (
            <div className="px-6 pb-5 pt-2">
              <button
                onClick={onDealerApprove}
                className="w-full bg-[#08090B] text-white rounded-full py-3.5 flex flex-col items-center
                           active:scale-[0.98] transition-transform"
              >
                <span className="text-[15px] font-bold">私はスタッフです</span>
                <span className="text-[13px] mt-0.5 text-[rgba(255,255,255,0.6)]">
                  着席を許可する
                </span>
              </button>
            </div>
          )}
        </div>
      </motion.div>

      {/* プレイヤー向けメッセージ（ディーラー確認時） */}
      <AnimatePresence>
        {phase === "dealer" && (
          <motion.div
            className="absolute left-0 right-0 flex flex-col items-center"
            style={{ top: "60%" }}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.4 }}
          >
            <p className="text-white text-[20px] font-bold text-center leading-relaxed">
              この画面のまま
              <br />
              スタッフにお見せください
            </p>
            <p className="text-[rgba(255,255,255,0.3)] text-[12px] mt-2">
              Show this screen to the staff
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* キャンセルボタン */}
      <motion.button
        className="absolute left-1/2 bottom-6 text-[rgba(255,255,255,0.4)] text-[14px] font-medium py-2 px-6
                   active:text-[rgba(255,255,255,0.6)] transition-colors"
        style={{ x: "-50%" }}
        onClick={handleCancel}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        キャンセル
      </motion.button>
    </div>
  );
}
