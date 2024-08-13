import { selectRoundNumber } from "@/lib/features/mainSlice";
import { useAppSelector } from "@/lib/hooks";
import { History } from "lucide-react";
import React from "react";

const ChartItems = () => {
  const roundNumber = useAppSelector(selectRoundNumber);
  return (
    <div className="flex justify-between p-5">
      <h4 className="text-md font-bold uppercase">Round #{roundNumber}</h4>
    </div>
  );
};

export default ChartItems;
