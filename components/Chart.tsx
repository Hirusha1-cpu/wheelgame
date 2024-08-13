"use client";

import { selectChartData, selectSolAmount } from "@/lib/features/mainSlice";
import { useAppSelector } from "@/lib/hooks";
import { ArcElement, Chart as ChartTS, Tooltip } from "chart.js";
import React, { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
ChartTS.register(ArcElement, Tooltip); // Register Tooltip

const Chart = () => {
  let solAmount = Number(useAppSelector(selectSolAmount));
  const chartData = useAppSelector(selectChartData);
  const initialSeconds = 10;

  const [chartAnimate, setChartAnimate] = useState<boolean>(false);
  const [seconds, setSeconds] = useState<number>(initialSeconds);
  const [stopPosition, setStopPosition] = useState<number>(0);
  const [totalRotation, setTotalRotation] = useState<number>(0); // Track total rotation
  const [borderColor, setBorderColor] = useState<string>("white"); // Default white color
  const [spinEnded, setSpinEnded] = useState<boolean>(false); // Track if spin has ended

  useEffect(() => {
    if (seconds > 0) {
      const timer = setTimeout(() => setSeconds(seconds - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      const randomStop = Math.floor(Math.random() * 360); // Random stop position
      setStopPosition(randomStop);
      setChartAnimate(true);
      setTotalRotation((prev) => prev + 360 * 50 + randomStop); // Spin 50 full rotations + random stop
    }
  }, [seconds]);

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

  const formatTime = (secs: number): string => {
    const minutes = Math.floor(secs / 60);
    const remainingSeconds = secs % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  // Calculate the winning color and update the border color
  const calculateWinnerColor = () => {
    const data = chartData.datasets[0].data;
    const colors = chartData.datasets[0].backgroundColor;
    let cumulativeAngle = 0;
    const stopAngle = stopPosition;

    for (let i = 0; i < data.length; i++) {
      const segmentAngle = (data[i] / data.reduce((a, b) => a + b, 0)) * 360;
      cumulativeAngle += segmentAngle;

      if (stopAngle <= cumulativeAngle) {
        setBorderColor(colors[i]);
        break;
      }
    }
  };

  // Create custom chart options to handle spinning and stopping, including tooltip configuration
  const options = {
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
            const label = tooltipItem.label || "";
            const value = tooltipItem.raw;
            return `${label}: ${value}`;
          },
        },
      },
    },
  };

  solAmount=0;
  for(let i=0;(chartData.datasets[0].data).length>i;i++){
    solAmount=solAmount+chartData.datasets[0].data[i];
  }

  return (
    <div className="flex h-full w-full items-center justify-center">
      <div
        className="relative rounded-full border-8 p-5"
        style={{ borderColor: borderColor }} // Start with white, change to winner color
      >
        <h2 className="absolute -top-2 left-1/2 -translate-x-1/2 transform text-white text-xl">
          &#x25BC;
        </h2>
        <div className={`h-[400px] w-[400px] z-10 cursor-pointer relative`}>
          <Doughnut data={chartData} width={400} height={400} options={options} />
        </div>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <p className="font-bold text-4xl">{solAmount}SOL</p>
        </div>
      </div>
    </div>
  );
};

export default Chart;
