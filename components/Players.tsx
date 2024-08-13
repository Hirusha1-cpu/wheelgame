"use client";
import { selectChartData, selectSolAmount } from "@/lib/features/mainSlice";
import { useAppSelector } from "@/lib/hooks";
import { Cherry } from "lucide-react";
import Image from "next/image";
import React from "react";

const Players = () => {
  const chartData = useAppSelector(selectChartData);

  if (!chartData || !chartData.datasets || !chartData.labels) {
    return <p>No data available</p>;
  }

  return (
    <>
      <div className="p-5">
        <h3 className="text-l font-bold uppercase">Players</h3>
      </div>
      <div className="flex flex-col gap-4">
        {chartData.labels.map((label: string, index: number) => (
          <Player key={index} index={index} chartData={chartData} />
        ))}
      </div>
    </>
  );
};

function Player({ index, chartData }: { index: number; chartData: any }) {
  const solAmount = useAppSelector(selectSolAmount);

  let totalToken = 0;
  for (let i = 0; i < chartData.datasets[0].data.length; i++) {
    totalToken += chartData.datasets[0].data[i];
  }
  let playerPercentage = Math.round(
    (chartData.datasets[0].data[index] / totalToken) * 100
  );

  // Generate a random avatar URL
  const avatarUrl = `https://robohash.org/player${index}?set=set4&size=50x50`;

  return (
    <div
      className="flex items-center justify-between rounded-2xl p-2 px-5 mx-4 gap-3 bg-neutral-700 cursor-pointer hover:scale-105 ease-linear duration-200"
    >
      <Image
        alt="player avatar"
        src={avatarUrl}
        width={50}
        height={50}
        className="rounded-full"
      />
      <h3 className="font-semibold capitalize mr-auto">
        {chartData.labels[index]}
      </h3>
      <div className="flex flex-col items-end justify-end">
        <h4 className="text-l font-bold">{playerPercentage}%</h4>
        <h4 className="flex items-center gap-1">
          <Cherry className="h-4 w-4 text-white" />
          {chartData.datasets[0].data[index]}
        </h4>
      </div>
      <div className="h-[15px] w-[15px] rounded-full" style={{ backgroundColor: chartData.datasets[0].backgroundColor[index]}}></div>

    </div>
  );
}

export default Players;
