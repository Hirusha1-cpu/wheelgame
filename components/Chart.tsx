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
  const initialSeconds = 3; // Define the initialSeconds variable

  const [chartAnimate, setChartAnimate] = useState<boolean>(false);
  const [seconds, setSeconds] = useState<number>(initialSeconds);
  const [stopPosition, setStopPosition] = useState<number>(0); // To store the stop position
  const [spinCount, setSpinCount] = useState<number>(0); // Track the number of spins

  useEffect(() => {
    if (seconds > 0) {
      const timer = setTimeout(() => setSeconds(seconds - 1), 1000);
      return () => clearTimeout(timer); // Clean up the timer
    } else {
      setSpinCount(10); // Start 10 spins after countdown ends
      setChartAnimate(true);
      // Random stop position after spins are complete
      setStopPosition(Math.floor(Math.random() * 360));
    }
  }, [seconds]);

  useEffect(() => {
    if (spinCount > 0) {
      const timer = setTimeout(() => setSpinCount(spinCount - 1), 500); // Duration for each spin
      return () => clearTimeout(timer); // Clean up the timer
    } else {
      setChartAnimate(false); // Stop spinning when spins are done
    }
  }, [spinCount]);

  useEffect(() => {
    // Reset countdown and spin position when component mounts
    setSeconds(initialSeconds);
    setSpinCount(0);
    setChartAnimate(false);
    setStopPosition(Math.floor(Math.random() * 360));
  }, []);

  const formatTime = (secs: number): string => {
    const minutes = Math.floor(secs / 60);
    const remainingSeconds = secs % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  // Calculate total rotation based on the number of spins
  const totalRotation = spinCount * 360 + stopPosition;

  // Create custom chart options to handle spinning and stopping
  const options = {
    maintainAspectRatio: false,
    rotation: -totalRotation, // Negative for clockwise rotation
    animation: {
      duration: chartAnimate ? 5000 : 0, // Adjust the animation duration for smoothness
      easing: 'easeOutCubic', // Smooth deceleration
      onComplete: () => {
        if (!chartAnimate) {
          setSpinCount(10); // Restart the spin cycle
        }
      },
    },
  };

  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className={`relative rounded-full border-8 border-pink-600 p-5`}>
        <h2 className="absolute -top-2 left-1/2 -translate-x-1/2 transform text-pink-600 text-xl">
          &#x25BC;
        </h2>
        <div
          className={`h-[400px] w-[400px]`}
        >
          <Doughnut
            data={chartData}
            width={400}
            height={400}
            options={options}
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
