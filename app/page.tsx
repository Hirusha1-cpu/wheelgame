"use client";

import Chartcomponents from "@/components/ChartComponents";
import CheckList from "@/components/CheckList";
import Players from "@/components/Players";
import {
  setChartData,
  setNumberOfPlayers,
  setPricePool,
  setRoundNumber,
  setWinChance,
  setYourEntries,
} from "@/lib/features/mainSlice";
import { useAppDispatch } from "@/lib/hooks";
import { useEffect } from "react";

export default function Home() {
  // const solAmount = useAppSelector(selectSolAmount);
  const dispatch = useAppDispatch();

  useEffect(() => {
    fetch("/api/roundData").then((res) => {
      res.json().then((data) => {
        dispatch(setChartData(data?.chartData));
        dispatch(setRoundNumber(data?.roundNumber));
        dispatch(setNumberOfPlayers(data?.numberOfPlayers));
        dispatch(setPricePool(data?.pricePool));
        dispatch(setWinChance(data?.winChance));
        dispatch(setYourEntries(data?.yourEntries));
      });
    });
  }, [dispatch]);

  return (
    <div className="custom-height mx-auto max-w-[90rem]">
      <div className="custom-height flex min-h-[705px] gap-5 pb-10 pt-5">
        <div className="w-full flex-1 rounded-lg bg-[#1C1C1E]">
          <Players />
        </div>
        <div className="w-[600px] rounded-lg bg-[#1C1C1E]">
          <Chartcomponents />
        </div>
        <div className="w-full flex-1 rounded-lg bg-[#1C1C1E]">
          <CheckList />
        </div>
      </div>
    </div>
  );
}

// rounded-[20px] border bg-black
