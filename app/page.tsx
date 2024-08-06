"use client";

import Chartcomponents from "@/components/ChartComponents";
import CheckList from "@/components/CheckList";
import Players from "@/components/Players";
import { useEffect, useState } from "react";

export default function Home() {
  const [chartData, setChartData] = useState<any>({
    labels: ["address1"],
    datasets: [
      {
        data: [1],
        backgroundColor: ["rgb(255, 99, 132)"],
        hoverOffset: 4,
        borderWidth: 0,
      },
    ],
  });

  const [roundNumber, setRoundNumber] = useState(1);
  const [numberOfPlayers, SetNumberOfPlayers] = useState(1);
  const [pricePool, setPricePool] = useState(1);
  const [winChance, setWinChance] = useState(1);
  const [yourEntries, setYourEntries] = useState(1);

  useEffect(() => {
    fetch("/api/roundData").then((res) => {
      res.json().then((data) => {
        setChartData(data?.chartData);
        setRoundNumber(data?.roundNumber);
        SetNumberOfPlayers(data?.numberOfPlayers);
        setPricePool(data?.pricePool);
        setWinChance(data?.winChance);
        setYourEntries(data?.yourEntries);
      });
    });
  }, []);

  return (
    <div className="custom-height mx-auto max-w-[90rem]">
      <div className="custom-height flex min-h-[705px] gap-5 pb-10 pt-5">
        <div className="w-full flex-1 rounded-lg bg-[#1C1C1E]">
          <Players />
        </div>
        <div className="w-[600px] rounded-lg bg-[#1C1C1E]">
          <Chartcomponents roundNumber={roundNumber} chartData={chartData} />
        </div>
        <div className="w-full flex-1 rounded-lg bg-[#1C1C1E]">
          <CheckList
            numberOfPlayers={numberOfPlayers}
            pricePool={pricePool}
            winChance={winChance}
            yourEntries={yourEntries}
          />
        </div>
      </div>
    </div>
  );
}

// rounded-[20px] border bg-black
