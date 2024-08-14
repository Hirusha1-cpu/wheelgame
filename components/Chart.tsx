"use client";

import { selectChartData, selectSolAmount } from "@/lib/features/mainSlice";
import { useAppSelector } from "@/lib/hooks";
import { ArcElement, Chart as ChartTS, Tooltip } from "chart.js";
import React, { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
ChartTS.register(ArcElement, Tooltip); // Register Tooltip

const Chart = () => {
  const chartData = useAppSelector(selectChartData);
  let solAmount = Number(useAppSelector(selectSolAmount));
  const initialSeconds = 0.5 * 60;

  const [chartAnimate, setChartAnimate] = useState<boolean>(false);
  const [seconds, setSeconds] = useState<number>(initialSeconds);
  const [stopPosition, setStopPosition] = useState<number>(0);
  const [totalRotation, setTotalRotation] = useState<number>(0); // Track total rotation
  const [borderColor, setBorderColor] = useState<string>("white"); // Default white color
  const [spinEnded, setSpinEnded] = useState<boolean>(false); // Track if spin has ended

  useEffect(() => {
    if (chartData.status === "closed") {
      if (seconds > 0) {
        const timer = setTimeout(() => setSeconds(seconds - 1), 1000);
        return () => clearTimeout(timer);
      } else {
        const randomStop = Math.floor(Math.random() * 360); // Random stop position
        setStopPosition(randomStop);
        setChartAnimate(true);
        setTotalRotation((prev) => prev + 360 * 50 + randomStop); // Spin 50 full rotations + random stop
      }
    }
  }, [seconds, chartData.status]);

  useEffect(() => {
    if (chartAnimate) {
      const timer = setTimeout(() => {
        setChartAnimate(false);
        setSpinEnded(true); // Mark spin as ended
        calculateWinnerColor();
      }, 5000); // Spin duration
      return () => clearTimeout(timer);
    }
  }, [chartAnimate]);

  useEffect(() => {
    if (spinEnded) {
      const resetTimer = setTimeout(() => {
        // Reset countdown, rotation, and spinEnded after 5 seconds
        setSeconds(initialSeconds);
        setChartAnimate(false);
        setStopPosition(0);
        setTotalRotation(0);
        setBorderColor("white"); // Ensure the border starts as white
        setSpinEnded(false); // Reset spin ended status
      }, 5000);
      return () => clearTimeout(resetTimer);
    }
  }, [spinEnded]);

  const calculateWinnerColor = () => {
    const data = chartData.datasets[0].data;
    const colors = chartData.datasets[0].backgroundColor;
    let cumulativeAngle = 0;
    const stopAngle = stopPosition;

    for (let i = 0; i < data.length; i++) {
      const segmentAngle =
        (data[i] / data.reduce((a: any, b: any) => a + b, 0)) * 360;
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
    0,
  );

  // Create custom chart options to handle spinning and stopping, including tooltip configuration
  const options: any = {
    maintainAspectRatio: false,
    rotation: -totalRotation, // Ensure clockwise rotation
    animation: {
      duration: chartAnimate ? 5000 : 0,
      easing: "easeOutCubic", // Smooth deceleration
    },
    plugins: {
      tooltip: {
        enabled: true, // Enable tooltip
        callbacks: {
          label: (tooltipItem: any) => {
            const index = tooltipItem.dataIndex;
            const formattedLabel =
              chartData.labels[index].slice(0, 4) +
              "..." +
              chartData.labels[index].slice(-4); // Format label
            const value = tooltipItem.raw;
            return `${formattedLabel}: ${value}`; // Only show formatted label and value
          },
          title: () => "", // Optionally hide the title
          afterLabel: () => "", // Optionally hide additional information
        },
      },
    },
  };

  return (
    <div className="mt-10 flex h-full w-full items-start justify-center">
      <div
        className="relative rounded-full border-8 p-5"
        style={{ borderColor: borderColor }} // Start with white, change to winner color
      >
        <h2 className="absolute -top-2 left-1/2 -translate-x-1/2 transform text-xl text-white">
          &#x25BC;
        </h2>
        <div className={`relative z-10 h-[400px] w-[400px] cursor-pointer`}>
          <Doughnut
            data={chartData}
            width={400}
            height={400}
            options={options}
          />
        </div>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <p className="text-4xl font-bold text-white">{solAmount} SOL</p>
        </div>
      </div>
    </div>
  );
};

export default Chart;
