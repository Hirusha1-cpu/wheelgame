"use client";

import { selectChartData, selectSolAmount, selectStatus, selectWinner } from "@/lib/features/mainSlice";
import { useAppSelector } from "@/lib/hooks";
import { ArcElement, Chart as ChartTS, Tooltip } from "chart.js";
import React, { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
ChartTS.register(ArcElement, Tooltip);

const Chart = () => {
  const chartData = useAppSelector(selectChartData);
  const status = useAppSelector(selectStatus);
  const winner = useAppSelector(selectWinner);
  let solAmount = Number(useAppSelector(selectSolAmount));

  const [chartAnimate, setChartAnimate] = useState<boolean>(false);
  const [stopPosition, setStopPosition] = useState<number>(0);
  const [totalRotation, setTotalRotation] = useState<number>(0);
  const [borderColor, setBorderColor] = useState<string>("white");
  const [spinEnded, setSpinEnded] = useState<boolean>(false);

  // Trigger wheel spin when status is 'closed', with a 10-second delay
  useEffect(() => {
    if (status === "closed") {
      console.log(winner);
      const delayTimer = setTimeout(() => {
        const winnerIndex = chartData.labels.indexOf(winner); // Find the index of the winner
        const data = chartData.datasets[0].data;
        const totalAmount = data.reduce((acc: number, value: number) => acc + value, 0);

        let cumulativeAngle = 0;
        let winnerStopPosition = 0;

        // Calculate the stop position that aligns with the winner
        for (let i = 0; i < data.length; i++) {
          const segmentAngle = (data[i] / totalAmount) * 360;
          cumulativeAngle += segmentAngle;

          if (i === winnerIndex) {
            winnerStopPosition = cumulativeAngle - segmentAngle / 2; // Stop in the middle of the segment
            break;
          }
        }

        setStopPosition(winnerStopPosition);
        setChartAnimate(true);
        setTotalRotation((prev) => prev + 360 * 50 + winnerStopPosition); // Spin 50 full rotations + winner stop
      }, 10000); // 10-second delay before starting the spin
      return () => clearTimeout(delayTimer);
    }
  }, [status]);

  // Stop the spin and calculate the winner color
  useEffect(() => {
    if (chartAnimate) {
      const timer = setTimeout(() => {
        setChartAnimate(false);
        setSpinEnded(true);
        calculateWinnerColor();
      }, 5000); // Spin duration
      return () => clearTimeout(timer);
    }
  }, [chartAnimate]);

  // Reset after spin ends
  useEffect(() => {
    if (spinEnded) {
      const resetTimer = setTimeout(() => {
        // Reset necessary states after 5 seconds
        setChartAnimate(false);
        setStopPosition(0);
        setTotalRotation(0);
        setBorderColor("white");
        setSpinEnded(false);
      }, 5000);
      return () => clearTimeout(resetTimer);
    }
  }, [spinEnded]);

  // Calculate the winner color based on stop position
  const calculateWinnerColor = () => {
    const data = chartData.datasets[0].data;
    const colors = chartData.datasets[0].backgroundColor;
    let cumulativeAngle = 0;
    const stopAngle = stopPosition;

    for (let i = 0; i < data.length; i++) {
      const segmentAngle = (data[i] / data.reduce((a: any, b: any) => a + b, 0)) * 360;
      cumulativeAngle += segmentAngle;

      if (stopAngle <= cumulativeAngle) {
        setBorderColor(colors[i]);
        break;
      }
    }
  };

  // Calculate total SOL amount
  solAmount = chartData.datasets[0].data.reduce(
    (acc: number, value: number) => acc + value,
    0
  );

  // Chart options
  const options: any = {
    maintainAspectRatio: false,
    rotation: -totalRotation,
    animation: {
      duration: chartAnimate ? 5000 : 0,
      easing: "easeOutCubic",
    },
    plugins: {
      tooltip: {
        enabled: true,
        callbacks: {
          label: (tooltipItem: any) => {
            const index = tooltipItem.dataIndex;
            const formattedLabel =
              chartData.labels[index].slice(0, 4) +
              "..." +
              chartData.labels[index].slice(-4);
            const value = tooltipItem.raw;
            return `${formattedLabel}: ${value}`;
          },
          title: () => "",
          afterLabel: () => "",
        },
      },
    },
  };

  return (
    <div className="mt-10 flex h-full w-full items-start justify-center">
      <div
        className="relative rounded-full border-8 p-5"
        style={{ borderColor: borderColor }}
      >
        <h2 className="absolute -top-2 left-1/2 -translate-x-1/2 transform text-xl text-white">
          &#x25BC;
        </h2>
        <div className={`relative z-10 h-[400px] w-[400px] cursor-pointer`}>
          <Doughnut data={chartData} width={400} height={400} options={options} />
        </div>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <p className="text-4xl font-bold text-white">{solAmount} SOL</p>
        </div>
      </div>
    </div>
  );
};

export default Chart;
