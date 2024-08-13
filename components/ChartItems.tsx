import { selectRoundNumber } from "@/lib/features/mainSlice";
import { useAppSelector } from "@/lib/hooks";
import { History } from "lucide-react";
import React from "react";

const ChartItems = () => {
  const roundNumber = useAppSelector(selectRoundNumber);
  return (
    <div className="flex justify-between px-4 pt-4">
      <h4 className="text-md font-bold uppercase">Round #{roundNumber}</h4>

      <div className="flex items-center gap-1 rounded-3xl border-[2px] px-3 py-2">
        <History className="size-5" />
        <h4 className="text-md font-bold">History</h4>
      </div>
    </div>
  );
};

export default ChartItems;
