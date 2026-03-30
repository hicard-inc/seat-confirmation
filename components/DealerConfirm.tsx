// components/DealerConfirm.tsx
// 画面3: ディーラー確認ビュー（カード180度回転・ディーラー向き）
"use client";

import { motion } from "framer-motion";
import { SeatInfo } from "@/lib/types";

interface DealerConfirmProps {
  seatInfo: SeatInfo;
  onDealerApprove: () => void;
  onCancel: () => void;
}

export default function DealerConfirm({
  seatInfo,
  onDealerApprove,
  onCancel,
}: DealerConfirmProps) {
  return (
    <div
      className="fixed inset-0 flex flex-col items-center"
      style={{ backgroundColor: "rgba(8, 9, 11, 0.9)" }}
    >
      {/* 上部: 180度回転されたカード（ディーラー向き） */}
      <motion.div
        className="mt-[54px] w-[361px] max-w-[calc(100vw-32px)]"
        style={{ rotate: 180 }}
        initial={{ y: 200, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", damping: 20, stiffness: 200 }}
      >
        <div className="bg-white rounded-[24px] overflow-hidden">
          {/* カード内容（ディーラーから見て正位置） */}
          <div className="relative h-[90px] flex items-center px-6">
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
            <div className="ml-4 flex-1">
              <p
                className="text-[10px]"
                style={{ color: "rgba(8,9,11,0.4)" }}
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
            <div className="text-right">
              <p
                className="text-[10px]"
                style={{ color: "rgba(8,9,11,0.4)" }}
              >
                Seat No.
              </p>
              <p className="text-[36px] font-bold text-[#16161B] leading-tight">
                {seatInfo.seatNumber}
              </p>
            </div>
          </div>

          {/* ディーラー用ボタン */}
          <div className="px-6 pb-6 pt-2">
            <button
              onClick={onDealerApprove}
              className="w-full bg-[rgba(8,9,11,0.9)] text-white rounded-full py-4 flex flex-col items-center
                         active:scale-[0.98] transition-transform"
            >
              <span className="text-[16px] font-bold">私はスタッフです</span>
              <span className="text-[14px] mt-0.5">着席許可</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* 回転されたゲーム情報（ディーラー向き） */}
      <motion.div
        className="mt-4 flex flex-col items-center"
        style={{ rotate: 180 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <h2 className="text-white text-[24px] font-black tracking-[-0.48px]">
          {seatInfo.gameTitle}
        </h2>
        <p className="text-[rgba(255,255,255,0.6)] text-[14px] font-bold mt-1">
          {seatInfo.eventName}
        </p>
        <div
          className="mt-2 flex items-center gap-1 px-2 py-1.5 rounded"
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

      {/* 中央: 上向き矢印 */}
      <motion.div
        className="flex-1 flex items-center justify-center"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4, type: "spring" }}
      >
        <svg
          width="80"
          height="120"
          viewBox="0 0 80 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M40 110V20M40 20L15 50M40 20L65 50"
            stroke="white"
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </motion.div>

      {/* プレイヤー向けテキスト */}
      <motion.div
        className="text-center mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <p className="text-white text-[24px] font-bold leading-normal">
          この画面のまま
          <br />
          スタッフにお見せください
        </p>
      </motion.div>

      {/* キャンセルボタン（プレイヤー向き） */}
      <motion.button
        onClick={onCancel}
        className="mb-12 text-white text-[14px] font-bold py-3 px-6 rounded-full
                   active:scale-[0.98] transition-transform"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        キャンセル (No)
      </motion.button>
    </div>
  );
}
