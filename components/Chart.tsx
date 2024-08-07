"use client";

import { selectChartData, selectSolAmount } from "@/lib/features/mainSlice";
import { useAppSelector } from "@/lib/hooks";
import { ArcElement, Chart as ChartTS } from "chart.js";
import React, { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
ChartTS.register(ArcElement);

const Chart = () => {
  const solAmount = useAppSelector(selectSolAmount);
  const chartData = useAppSelector(selectChartData);
  const [chartAnimate, setChartAnimate] = useState<boolean>(true);

  setTimeout(() => {
    setChartAnimate(false);
  }, 3000);

  const [time, setTime] = useState(300);

  useEffect(() => {
    let timer = setInterval(() => {
      setTime((time) => {
        if (time === 0) {
          clearInterval(timer);
          return 0;
        } else return time - 1;
      });
    }, 1000);
  }, []);

  return (
    <div className="relative flex h-full w-full items-center justify-center">
      <div
        className={`h-[420px] w-[420px] rounded-full border-8 border-pink-600 p-5 ${chartAnimate ? "animate-spin" : ""}`}
      >
        <Doughnut
          data={chartData}
          width={420}
          height={420}
          options={{ maintainAspectRatio: false }}
        />
      </div>
      <div className="absolute">
        <h2 className="text-4xl font-bold">
          {`${Math.floor(time / 60)}`.padStart(2, "0")}:
          {`${String(time % 60)}`.padStart(2, "0")}
        </h2>
        <p className="font-bold">Drawing Timer</p>
        <p className="font-bold">{solAmount}</p>
      </div>
    </div>
  );
};

export default Chart;
