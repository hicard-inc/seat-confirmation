// components/SeatFlow.tsx
// フロー制御コンポーネント: confirm → card → dealer → done の状態遷移を管理
"use client";

import { useState, useCallback, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FlowStep, SeatInfo } from "@/lib/types";
import Overlay from "./Overlay";
import ConfirmDialog from "./ConfirmDialog";
import SeatCard from "./SeatCard";
import DealerConfirm from "./DealerConfirm";

const DEFAULT_SEAT_INFO: SeatInfo = {
  playerNumber: 90,
  tableName: "Blue",
  tableColor: "#006FFF",
  seatNumber: 6,
  gameTitle: "#02 Warm-up",
  eventName: "2025WLTポーカーサミット",
  deadline: "締切 16:00(Level 3)",
};

export default function SeatFlow() {
  const [step, setStep] = useState<FlowStep>("confirm");

  const handleConfirm = useCallback(() => {
    setStep("card");
  }, []);

  const handleSwipeComplete = useCallback(() => {
    setStep("dealer");
  }, []);

  const handleDealerApprove = useCallback(() => {
    setStep("done");
  }, []);

  const handleCancel = useCallback(() => {
    setStep("confirm");
  }, []);

  // 成功画面: 2秒後に初期画面に戻る
  useEffect(() => {
    if (step === "done") {
      const timer = setTimeout(() => {
        setStep("confirm");
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [step]);

  return (
    <div className="w-full h-[100dvh] max-w-[393px] mx-auto relative overflow-hidden bg-[#f7f7f8]">
      <AnimatePresence mode="wait">
        {step === "confirm" && (
          <motion.div
            key="confirm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Overlay>
              <ConfirmDialog
                onConfirm={handleConfirm}
                onCancel={handleCancel}
              />
            </Overlay>
          </motion.div>
        )}

        {step === "card" && (
          <motion.div
            key="card"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <SeatCard
              seatInfo={DEFAULT_SEAT_INFO}
              onSwipeComplete={handleSwipeComplete}
              onCancel={handleCancel}
            />
          </motion.div>
        )}

        {step === "dealer" && (
          <motion.div
            key="dealer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <DealerConfirm
              seatInfo={DEFAULT_SEAT_INFO}
              onDealerApprove={handleDealerApprove}
              onCancel={handleCancel}
            />
          </motion.div>
        )}

        {step === "done" && (
          <motion.div
            key="done"
            className="fixed inset-0 flex flex-col items-center justify-center"
            style={{ backgroundColor: "rgba(8, 9, 11, 0.9)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* 成功アニメーション */}
            <motion.div
              className="flex flex-col items-center gap-6"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", damping: 15, stiffness: 200 }}
            >
              {/* チェックマーク */}
              <motion.div
                className="w-[100px] h-[100px] rounded-full bg-[#1B9E1D] flex items-center justify-center"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  type: "spring",
                  damping: 12,
                  stiffness: 200,
                  delay: 0.1,
                }}
              >
                <motion.svg
                  width="50"
                  height="50"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <motion.path
                    d="M5 13l4 4L19 7"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                  />
                </motion.svg>
              </motion.div>

              <motion.p
                className="text-white text-[24px] font-bold text-center"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                着席が完了しました
              </motion.p>
              <motion.p
                className="text-[rgba(255,255,255,0.6)] text-[14px] text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                Seating confirmed
              </motion.p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
