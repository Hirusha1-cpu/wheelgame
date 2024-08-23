"use client";
import { selectChartData, selectSolAmount, selectWinner } from "@/lib/features/mainSlice";
import { useAppSelector } from "@/lib/hooks";
import { Cherry } from "lucide-react";
import Image from "next/image";
import React from "react";
import { useSearchParams } from "next/navigation";

const Players = () => {
  const chartData = useAppSelector(selectChartData);
  const winner = useAppSelector(selectWinner);
  const searchParams = useSearchParams();
  const spinEnd = searchParams.get("round");

  if (!chartData || !chartData.datasets || !chartData.labels) {
    return <p>No data available</p>;
  }

  let totalToken = 0;
  for (let i = 0; i < chartData.datasets[0].data.length; i++) {
    totalToken += chartData.datasets[0].data[i];
  }

  return (
    <>
      <div className="p-5">
        <h3 className="text-l font-bold uppercase">Players</h3>
      </div>
      <div className="flex flex-col gap-4">
        {chartData.labels.map((label: string, index: number) => {
          const playerPercentage = Math.round(
            (chartData.datasets[0].data[index] / totalToken) * 100
          );
          const avatarUrl = `https://robohash.org/player${index}?set=set4&size=50x50`;
          const formattedLabel =
            chartData.labels[index].slice(0, 4) +
            "..." +
            chartData.labels[index].slice(-4);
          const isWinner = spinEnd === "end" && chartData.labels[index] === winner;
          const backgroundColor = isWinner ? 'gold' : chartData.datasets[0].backgroundColor[index];

          return (
            <div
              key={index}
              className={`flex items-center justify-between rounded-2xl p-2 px-5 mx-4 gap-3 bg-neutral-700 cursor-pointer hover:scale-105 ease-linear duration-200 ${isWinner ? ' bg-yellow-500' : ''}`}
            >
              <Image
                alt="player avatar"
                src={avatarUrl}
                width={30}
                height={30}
                className="rounded-full"
              />
              <h3 className="font-semibold capitalize mr-auto">
                {formattedLabel}
              </h3>
              <div className="flex flex-col items-end justify-end">
                <h4 className="text-l font-bold">{playerPercentage}%</h4>
                <h4 className="flex items-center gap-1">
                  <Cherry className="h-4 w-4 text-white" />
                  {chartData.datasets[0].data[index]}
                </h4>
              </div>
              <div className="h-[15px] w-[15px] rounded-full" style={{ backgroundColor }}></div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default Players;
