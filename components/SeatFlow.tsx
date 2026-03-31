// components/SeatFlow.tsx
// フロー制御: select → confirm → card(interact/dealer) → done
"use client";

import { useState, useCallback, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FlowStep, InteractionMode, SeatInfo } from "@/lib/types";
import Overlay from "./Overlay";
import ConfirmDialog from "./ConfirmDialog";
import SeatCard from "./SeatCard";
import PatternSelect from "./PatternSelect";

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
  const [step, setStep] = useState<FlowStep>("select");
  const [interactionMode, setInteractionMode] =
    useState<InteractionMode>("swipe");

  const handleSelectMode = useCallback((mode: InteractionMode) => {
    setInteractionMode(mode);
    setStep("confirm");
  }, []);

  const handleConfirm = useCallback(() => {
    setStep("card");
  }, []);

  const handleDealerApprove = useCallback(() => {
    setStep("done");
  }, []);

  const handleCancel = useCallback(() => {
    setStep("select");
  }, []);

  // 成功画面: 2.5秒後にリセット
  useEffect(() => {
    if (step === "done") {
      const timer = setTimeout(() => setStep("select"), 2500);
      return () => clearTimeout(timer);
    }
  }, [step]);

  return (
    <div className="w-full h-[100dvh] max-w-[393px] mx-auto relative overflow-hidden">
      <AnimatePresence mode="wait">
        {step === "select" && (
          <motion.div
            key="select"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <PatternSelect onSelect={handleSelectMode} />
          </motion.div>
        )}

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
              interactionMode={interactionMode}
              onDealerApprove={handleDealerApprove}
              onCancel={handleCancel}
            />
          </motion.div>
        )}

        {step === "done" && (
          <motion.div
            key="done"
            className="fixed inset-0 flex flex-col items-center justify-center"
            style={{ backgroundColor: "rgba(8, 9, 11, 0.95)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="flex flex-col items-center gap-6"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", damping: 15, stiffness: 200 }}
            >
              {/* チェックマーク */}
              <motion.div
                className="w-[100px] h-[100px] rounded-full bg-[#22C55E] flex items-center justify-center"
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
                className="text-[rgba(255,255,255,0.4)] text-[13px] text-center"
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
