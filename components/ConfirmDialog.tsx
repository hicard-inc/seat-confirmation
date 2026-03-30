// components/ConfirmDialog.tsx
// 画面1: シート確定の確認ダイアログ
"use client";

import { motion } from "framer-motion";

interface ConfirmDialogProps {
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <motion.div
      className="w-[361px] max-w-[calc(100vw-32px)] bg-white rounded-[24px] p-6 flex flex-col gap-6 items-center"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ type: "spring", damping: 25, stiffness: 300 }}
    >
      {/* ヘッダー */}
      <div className="w-full flex flex-col items-center">
        <div className="py-4 flex flex-col items-center gap-2">
          <h2
            className="text-[20px] font-bold text-center"
            style={{ color: "rgba(0,0,0,0.95)" }}
          >
            シート確定の確認
          </h2>
        </div>

        {/* 説明文 */}
        <div className="py-1 flex flex-col items-center gap-3 text-center">
          <p
            className="text-[14px] leading-relaxed"
            style={{ color: "rgba(0,0,0,0.95)" }}
          >
            シートを確定すると、実際に着席していなくても
            <br />
            チップがテーブルに置かれ、
            <br />
            プレイが開始されます。
            <br />
            <br />
            また、一度シートを確定すると
            <br />
            キャンセルはできません。
            <br />
            本当にシートを確定してもよろしいですか？
          </p>
          <p className="text-[12px] leading-relaxed text-[#878796]">
            (Once you confirm your seat, chips will be placed on the table and
            play will begin even if you are not physically seated.
            <br />
            <br />
            Once you confirm a seat, you cannot cancel it.
            <br />
            Do you really want to confirm your seat?)
          </p>
        </div>
      </div>

      {/* ボタン */}
      <div className="w-full flex flex-col gap-2 items-center">
        <button
          onClick={onConfirm}
          className="w-full bg-black text-white rounded-full py-3 px-4 text-[14px] font-bold
                     active:scale-[0.98] transition-transform"
        >
          シートを確定 (Yes)
        </button>
        <button
          onClick={onCancel}
          className="w-full text-black rounded-full py-3 px-4 text-[14px] font-bold
                     active:scale-[0.98] transition-transform"
        >
          キャンセル (No)
        </button>
      </div>
    </motion.div>
  );
}
