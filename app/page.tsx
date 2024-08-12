"use client";

import Chartcomponents from "@/components/ChartComponents";
import CheckList from "@/components/CheckList";
import Players from "@/components/Players";
import {
  selectWallet,
  setChartData,
  setNumberOfPlayers,
  setPricePool,
  setRoundNumber,
  setWinChance,
  setYourEntries,
} from "@/lib/features/mainSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { useEffect, useState } from "react";

export default function Home() {
  const dispatch = useAppDispatch();
  const wallet = useAppSelector(selectWallet);

  useEffect(() => {}, [dispatch, wallet]);

  setInterval(() => {
    if (wallet === undefined) return;
    fetch(`/api/roundData?me=${wallet}`).then((res) => {
      res.json().then((data) => {
        dispatch(setChartData(data?.chartData));
        dispatch(setRoundNumber(data?.roundNumber));
        dispatch(setNumberOfPlayers(data?.numberOfPlayers));
        dispatch(setPricePool(data?.pricePool));
        dispatch(setWinChance(data?.winChance));
        dispatch(setYourEntries(data?.yourEntries));
      });
    });
  }, 5000);

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
