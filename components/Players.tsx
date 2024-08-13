"use client";
import { selectChartData, selectSolAmount } from "@/lib/features/mainSlice";
import { useAppSelector } from "@/lib/hooks";

import { Cherry } from "lucide-react";
import Image from "next/image";
import React from "react";

const Players = ({ data }: any) => {
  return (
    <>
      <div className="p-5">
        <h3 className="text-l font-bold uppercase">Players</h3>
      </div>
      <div className="flex flex-col gap-4">
        <Player />
      </div>
    </>
  );
};

function Player() {
  const solAmount = useAppSelector(selectSolAmount);
  const chartData = useAppSelector(selectChartData);
  
  let totalToken=0
  for(let i=0;(chartData.datasets[0].data).length>i;i++){
    totalToken=totalToken+chartData.datasets[0].data[i];
  }
  let playerPercentage=Math.round((chartData.datasets[0].data[0]/totalToken)*100);
  return (
    <div className="flex items-center justify-between rounded-2xl p-2 px-5 mx-4 gap-3 bg-blue-500" style={{backgroundColor:chartData.datasets[0].backgroundColor}}>
      <Image
        alt="player"
        src="https://img.freepik.com/premium-vector/young-smiling-man-avatar-man-with-brown-beard-mustache-hair-wearing-yellow-sweater-sweatshirt-3d-vector-people-character-illustration-cartoon-minimal-style_365941-860.jpg"
        width={50}
        height={50}
        className="rounded-full"
      />
      <h3 className="font-semibold capitalize mr-auto">{chartData.labels[0]}</h3>
      <div className="flex flex-col items-end justify-end">
        <h4 className="text-l font-bold">{playerPercentage}%</h4>
        <h4 className="flex items-center gap-1">
          <Cherry className="h-4 w-4 text-red-600" />
          {chartData.datasets[0].data[0]}
        </h4>
      </div>
    </div>
  );
}

// function PlayerB() {
//   return (
//     <div className="flex items-center justify-between rounded-md bg-slate-500 p-2 px-5">
//       <Image
//         alt="player"
//         src="https://img.freepik.com/premium-vector/young-smiling-man-avatar-man-with-brown-beard-mustache-hair-wearing-yellow-sweater-sweatshirt-3d-vector-people-character-illustration-cartoon-minimal-style_365941-860.jpg"
//         width={50}
//         height={50}
//         className="rounded-full"
//       />
//       <h3>Ranga</h3>
//       <div className="flex flex-col items-end justify-end">
//         <h4 className="text-l font-bold">45%</h4>
//         <h4 className="flex items-center gap-1">
//           <Cherry className="h-4 w-4 text-red-600" />
//           0.09
//         </h4>
//       </div>
//     </div>
//   );
// }

export default Players;
