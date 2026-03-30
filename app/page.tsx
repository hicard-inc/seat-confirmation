// app/page.tsx
// メインページ: SeatFlowコンポーネントをマウント
import SeatFlow from "@/components/SeatFlow";

export default function Home() {
  return (
    <main className="min-h-[100dvh] bg-[#08090B] flex items-center justify-center">
      <SeatFlow />
    </main>
  );
}
