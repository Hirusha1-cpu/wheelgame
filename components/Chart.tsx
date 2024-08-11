"use client";

import { selectChartData, selectSolAmount } from "@/lib/features/mainSlice";
import { useAppSelector } from "@/lib/hooks";
import { ArcElement, Chart as ChartTS } from "chart.js";
import { time } from "console";
import React, { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
ChartTS.register(ArcElement);

const Chart = () => {
  const solAmount = useAppSelector(selectSolAmount);
  const chartData = useAppSelector(selectChartData);
  const [chartAnimate, setChartAnimate] = useState<boolean>(true);
  const initialSeconds = 60; // Define the initialSeconds variable

  setTimeout(() => {
    setChartAnimate(false);
  }, 3000);

  const [seconds, setSeconds] = useState<number>(initialSeconds);

  useEffect(() => {
    if (seconds > 0) {
      const timer = setTimeout(() => setSeconds(seconds - 1), 1000);
      return () => clearTimeout(timer); // Clean up the timer
    }
  }, [seconds]);

  const formatTime = (secs: number): string => {
    const minutes = Math.floor(secs / 60);
    const remainingSeconds = secs % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className={`relative rounded-full border-8 border-pink-600 p-5`}>
        <h2 className="absolute -top-2 left-1/2 -translate-x-1/2 transform text-pink-600 text-xl">
          &#x25BC;
        </h2>
        <div
          className={`h-[400px] w-[400px] ${chartAnimate ? "animate-spin" : ""}`}
        >
          <Doughnut
            data={chartData}
            width={400}
            height={400}
            options={{ maintainAspectRatio: false }}
          />
        </div>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <h2 className="text-4xl font-bold">{formatTime(seconds)}</h2>
          <p className="font-bold">Drawing Timer</p>
          <p className="font-bold">{solAmount}</p>
        </div>
      </div>
    </div>
  );
};

export default Chart;
