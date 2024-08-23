"use client";

import Chartcomponents from "@/components/ChartComponents";
import CheckList from "@/components/CheckList";
import Players from "@/components/Players";
import {
  selectStopRequest,
  selectWallet,
  selectStatus,
  setChartData,
  setNumberOfPlayers,
  setPricePool,
  setRoundNumber,
  setStatus,
  setWinChance,
  setYourEntries,
  setWinner,
  setStopRequest,
} from "@/lib/features/mainSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { useEffect } from "react";

export default function Home() {
  const dispatch = useAppDispatch();
  const wallet = useAppSelector(selectWallet);
  const status = useAppSelector(selectStatus);
  let stopRequest = useAppSelector(selectStopRequest);

  useEffect(() => {
    if (wallet === undefined || stopRequest) return;

    const intervalId = setInterval(() => {
      fetch(`/api/roundData?me=${wallet}`).then((res) => {
        res.json().then((data) => {
          dispatch(setChartData(data?.chartData));
          dispatch(setRoundNumber(data?.roundNumber));
          dispatch(setNumberOfPlayers(data?.numberOfPlayers));
          dispatch(setPricePool(data?.pricePool));
          dispatch(setWinChance(data?.winChance));
          dispatch(setYourEntries(data?.yourEntries));
          dispatch(setStatus(data?.status));
          dispatch(setWinner(data?.winner));
        });
      });
    }, 5000);

    return () => clearInterval(intervalId); 
  }, [dispatch, wallet, status, stopRequest]);

    useEffect(() => {
    if (status === "closed") {
      dispatch(setStopRequest(true)); 
    }
  }, [status, dispatch]);

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
