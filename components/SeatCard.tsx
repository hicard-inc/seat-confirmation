// components/SeatCard.tsx
// 画面2: シートカード + スワイプ/タップ操作 → スタッフ確認
// アニメーション: rotateX(180) による3Dカードフリップ
// 2面構造: フロント(プレイヤー) / バック(スタッフ向けFigmaデザイン)
"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import {
  motion,
  AnimatePresence,
  PanInfo,
  useMotionValue,
  useTransform,
} from "framer-motion";
import { SeatInfo, InteractionMode } from "@/lib/types";

interface SeatCardProps {
  seatInfo: SeatInfo;
  interactionMode: InteractionMode;
  onDealerApprove: () => void;
  onCancel: () => void;
}

type CardPhase = "interact" | "dealer";

// シート情報（テーブル番号・席番号）- 両面で共通
function SeatInfoRow({ seatInfo }: { seatInfo: SeatInfo }) {
  return (
    <div className="flex items-center pl-4 pr-6 py-4">
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
      <div className="ml-6 flex-1 min-w-0">
        <p
          className="text-[12px] tracking-[0.5px] uppercase leading-[15px]"
          style={{ color: "rgba(8,9,11,0.35)" }}
        >
          Table
        </p>
        <p
          className="text-[36px] font-bold leading-[45px]"
          style={{ color: seatInfo.tableColor }}
        >
          {seatInfo.tableName}
        </p>
      </div>

      {/* シート番号 */}
      <div className="text-right">
        <p
          className="text-[12px] tracking-[0.5px] uppercase leading-[15px]"
          style={{ color: "rgba(8,9,11,0.35)" }}
        >
          Seat No.
        </p>
        <p className="text-[36px] font-bold text-[#16161B] leading-[45px]">
          {seatInfo.seatNumber}
        </p>
      </div>
    </div>
  );
}

// スワイプ用シェブロン（2段・下から順に浮き上がるアニメーション）
function SwipeChevrons() {
  return (
    <div className="flex flex-col items-center pb-1">
      {/* 上のシェブロン（遅延あり） */}
      <motion.div
        className="-mb-1"
        animate={{ opacity: [0.15, 0.7, 0.15], y: [4, -4, 4] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
      >
        <svg width="24" height="14" viewBox="0 0 24 14" fill="none">
          <path
            d="M2 12L12 2L22 12"
            stroke="rgba(8,9,11,0.8)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </motion.div>
      {/* 下のシェブロン（先に浮き上がる） */}
      <motion.div
        animate={{ opacity: [0.15, 0.7, 0.15], y: [4, -4, 4] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
      >
        <svg width="24" height="14" viewBox="0 0 24 14" fill="none">
          <path
            d="M2 12L12 2L22 12"
            stroke="rgba(8,9,11,0.8)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </motion.div>
    </div>
  );
}

// タップ用波紋アニメーション + TAP HERE テキスト
function TapRipple({ onTap }: { onTap: () => void }) {
  return (
    <button
      onClick={onTap}
      className="relative w-[120px] h-[120px] rounded-full flex items-center justify-center"
      style={{ border: "1px solid rgba(8,9,11,0.1)" }}
    >
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute inset-0 rounded-full"
          style={{ border: "1px solid rgba(8,9,11,0.08)" }}
          animate={{ scale: [1, 1.6 + i * 0.3], opacity: [0.4, 0] }}
          transition={{
            duration: 2.4,
            repeat: Infinity,
            ease: "easeOut",
            delay: i * 0.6,
          }}
        />
      ))}
      <span className="text-[11px] font-bold tracking-[1.5px] uppercase text-[rgba(8,9,11,0.3)]">
        TAP HERE
      </span>
    </button>
  );
}

export default function SeatCard({
  seatInfo,
  interactionMode,
  onDealerApprove,
  onCancel,
}: SeatCardProps) {
  const [phase, setPhase] = useState<CardPhase>("interact");
  const [flipDistance, setFlipDistance] = useState(-500);
  // スタッフ向けゲーム情報の top 位置（カード下端 + gap で動的計算）
  const [dealerInfoTop, setDealerInfoTop] = useState(260);
  const cardRef = useRef<HTMLDivElement>(null);
  const isSwipe = interactionMode === "swipe";

  // rotateX の進行値を追跡し、各面のopacityを確実に制御する
  // backfaceVisibility: hidden だけではSafariで効かないケースがあるため
  const rotateXProgress = useMotionValue(0);
  // 90°を境に切り替え（カードが真横になる瞬間なので切り替えが視認できない）
  const frontFaceOpacity = useTransform(
    rotateXProgress,
    [0, 88, 92, 180],
    [1, 1, 0, 0]
  );
  const backFaceOpacity = useTransform(
    rotateXProgress,
    [0, 88, 92, 180],
    [0, 0, 1, 1]
  );

  // カードの自然な位置から画面上部（top:16px）までの移動量を計算
  useEffect(() => {
    const calculate = () => {
      const h = window.innerHeight;
      const cardHeight = cardRef.current?.offsetHeight || 220;
      const naturalTop = h - 72 - cardHeight;
      setFlipDistance(16 - naturalTop);
    };
    const timer = setTimeout(calculate, 50);
    window.addEventListener("resize", calculate);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", calculate);
    };
  }, []);

  const triggerFlip = useCallback(() => {
    const h = window.innerHeight;
    const cardHeight = cardRef.current?.offsetHeight || 220;
    const naturalTop = h - 72 - cardHeight;
    setFlipDistance(16 - naturalTop);
    setDealerInfoTop(16 + cardHeight + 20);
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
      style={{ backgroundColor: "rgba(8, 9, 11, 0.95)", perspective: "800px" }}
    >
      {/* ゲーム情報（プレイヤー向け） */}
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
              <span className="text-[#22C55E] text-[13px] font-bold">受付中</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ゲーム情報（スタッフ向け・カード直下・180度回転） */}
      <AnimatePresence>
        {phase === "dealer" && (
          <motion.div
            className="absolute left-0 right-0 flex flex-col items-center"
            style={{ top: dealerInfoTop, rotate: 180 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.3 }}
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
              <span className="text-[#22C55E] text-[13px] font-bold">受付中</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===== シートカード（3Dフリップ・2面構造） ===== */}
      <motion.div
        ref={cardRef}
        className="absolute left-1/2 bottom-[72px] w-[361px] max-w-[calc(100vw-32px)]"
        style={{
          x: "-50%",
          touchAction: "none",
          // 子要素の3D変換を保持するために必要
          transformStyle: "preserve-3d",
        }}
        drag={phase === "interact" && isSwipe ? "y" : false}
        dragConstraints={{ top: -250, bottom: 0 }}
        dragElastic={0.15}
        onDragEnd={isSwipe ? handleDragEnd : undefined}
        initial={{ y: 40, opacity: 0 }}
        animate={{
          y: phase === "dealer" ? flipDistance : 0,
          // rotateX(180): 3Dカードフリップ。バック面がFigmaデザインで表示される
          rotateX: phase === "dealer" ? 180 : 0,
          opacity: 1,
        }}
        onUpdate={(latest) => {
          // rotateXの進行をtrackし、各面opacityの切り替えに使用
          if (typeof latest.rotateX === "number") {
            rotateXProgress.set(Math.abs(latest.rotateX));
          }
        }}
        transition={
          phase === "dealer"
            ? { type: "spring", damping: 22, stiffness: 140 }
            : { type: "spring", damping: 28, stiffness: 260 }
        }
      >
        {/* ---- フロント面: プレイヤー向け ---- */}
        <motion.div
          className="bg-white rounded-[24px] overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.08)]"
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            opacity: frontFaceOpacity,
          }}
        >
          <SeatInfoRow seatInfo={seatInfo} />

          <div className="px-6 pb-6 flex flex-col items-center gap-4">
            {isSwipe ? (
              <>
                <div
                  className="w-[120px] h-[120px] rounded-full flex items-center justify-center"
                  style={{ border: "1px solid rgba(8,9,11,0.1)" }}
                >
                  <SwipeChevrons />
                </div>
                <p className="text-[12px] font-medium text-[rgba(8,9,11,0.3)]">
                  上にスワイプしてスタッフに見せる
                </p>
              </>
            ) : (
              <>
                <TapRipple onTap={triggerFlip} />
                <p className="text-[12px] font-medium text-[rgba(8,9,11,0.3)]">
                  タップしてスタッフに見せる
                </p>
              </>
            )}
          </div>
        </motion.div>

        {/* ---- バック面: スタッフ向け（Figmaデザイン準拠） ----
            transform: rotateX(180deg) rotate(180deg)
            外側の rotateX(180) と相殺 → net = rotate(180) でFigma通りの表示
            bottom-0: コンテンツ高さのみ確保。rotateX後にビジュアル上部へ配置される */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 bg-white rounded-[24px] overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.08)]"
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateX(180deg) rotate(180deg)",
            opacity: backFaceOpacity,
          }}
        >
          <SeatInfoRow seatInfo={seatInfo} />

          <div className="px-6 pb-4">
            <button
              onClick={onDealerApprove}
              className="w-full bg-black text-white rounded-full py-4 flex flex-col items-center gap-1
                         active:scale-[0.98] transition-transform"
            >
              <span className="text-[16px] font-bold leading-[24px]">
                着席を許可する
              </span>
              <span className="text-[12px] leading-[14px]">
                スタッフが操作してください
              </span>
            </button>
            <button
              onClick={handleCancel}
              className="w-full py-3 mt-1 text-[14px] font-medium text-[rgba(8,9,11,0.35)]
                         active:text-[rgba(8,9,11,0.5)] transition-colors"
            >
              キャンセル
            </button>
          </div>
        </motion.div>
      </motion.div>

      {/* プレイヤー向けメッセージ（スタッフ確認時・画面下部） */}
      <AnimatePresence>
        {phase === "dealer" && (
          <motion.div
            className="absolute bottom-0 left-0 right-0 flex flex-col items-center gap-1 py-12 text-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.28, duration: 0.3 }}
          >
            <p className="text-white text-[24px] font-bold leading-normal">
              この画面のまま
              <br />
              スタッフにお見せください
            </p>
            <p className="text-[rgba(255,255,255,0.4)] text-[14px] font-medium">
              Show this screen to staff
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* キャンセルボタン（インタラクト時のみ） */}
      <AnimatePresence>
        {phase === "interact" && (
          <motion.button
            className="absolute left-1/2 bottom-6 text-[rgba(255,255,255,0.4)] text-[14px] font-medium py-2 px-6
                       active:text-[rgba(255,255,255,0.6)] transition-colors"
            style={{ x: "-50%" }}
            onClick={handleCancel}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.3 }}
          >
            キャンセル
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
