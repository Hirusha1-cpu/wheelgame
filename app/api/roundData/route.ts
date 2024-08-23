import dbConnect from "@/lib/db";
import RoundData from "@/models/RoudData";
import Round from "@/models/Round";
import { NextApiRequest } from "next";
import { NextResponse } from "next/server";

const duration = 2 * 60 * 1000; // 5mins

interface Player {
  address: string;
  entries: number;
}

interface PlayerEntries {
  [address: string]: number;
}

// To handle a GET request to /api
let status: "open" | "closed" = "open";
const distinctColors: string[] = [
  "#FF6B6B",
  "#4ECDC4",
  "#45B7D1",
  "#FFA07A",
  "#98D8C8",
  "#F7DC6F",
  "#B19CD9",
  "#FF90B3",
  "#88D8B0",
  "#FFA600",
  "#FF85A2",
  "#7FD8BE",
  "#80B1D3",
  "#B3DE69",
  "#FDB462",
  "#BC80BD",
  "#FCCDE5",
  "#D9D9D9",
  "#ACD1E9",
  "#FFED6F",
];

let winner: string | null = null;

export async function getCurrentRound() {
  await dbConnect();
  const roundData = await RoundData.find();
  return roundData?.[0]?.currentRoundNumber.toString();
}

function isRoundExpired(startTimestamp: number, durationMs: number): boolean {
  const startTimeMs = startTimestamp;
  const endTimeMs = startTimeMs + durationMs;
  console.log(endTimeMs,startTimeMs,durationMs,Date.now());
  
  return endTimeMs < Date.now();
}

export async function GET(req: NextApiRequest) {
  await dbConnect();
  const { searchParams } = new URL(req.url!);
  const currentUserAddress = searchParams.get("me");

  let currentRound = await getCurrentRound();

  let dbData: any = (
    await Round.find({
      roundNumber: currentRound,
    })
  ).map((a) => a.toObject())[0];

  const strtTimestamp = dbData?.startTimeStamp;


  let playerEntries: PlayerEntries = dbData.players.reduce(
    (
      acc: { [x: string]: any },
      player: { address: string | number; entries: any },
    ) => {
      acc[player.address] = (acc[player.address] || 0) + player.entries;
      return acc;
    },
    {} as PlayerEntries,
  );

  console.log("playerEntries",playerEntries);
  

  let pricePool: number = Object.values(playerEntries).reduce(
    (sum, entries) => sum + entries,
    0,
  );
  console.log("Checking if round is expired:", isRoundExpired(strtTimestamp, duration));

  if (status === "open" && isRoundExpired(strtTimestamp, duration)) {
    status = "closed";
    winner =
      Object.keys(playerEntries)[
        Math.floor(Math.random() * Object.keys(playerEntries).length)
      ];
    // winner= Object.keys(playerEntries)[0];
    console.log("winner",winner);
      
  } 
  else if (status === "closed") {
    status = "open";
    winner = null;
    const newRound = (Number(currentRound) + 1).toString();

    await RoundData.updateOne({ key: "0" }, { currentRoundNumber: newRound });
    await Round.create({
      roundNumber: newRound,
      players: [],
      startTimeStamp: Date.now(),
    });
  }
  

  currentRound = await getCurrentRound();

  dbData = (
    await Round.find({
      roundNumber: currentRound,
    })
  ).map((a) => a.toObject())[0];

  playerEntries = dbData.players.reduce(
    (
      acc: { [x: string]: any },
      player: { address: string | number; entries: any },
    ) => {
      acc[player.address] = (acc[player.address] || 0) + player.entries;
      return acc;
    },
    {} as PlayerEntries,
  );

  pricePool = Object.values(playerEntries).reduce(
    (sum, entries) => sum + entries,
    0,
  );

  const yourEntries = playerEntries[currentUserAddress!] || 0;

  let response =  NextResponse.json(
    {
      roundNumber: currentRound,
      pricePool: pricePool,
      numberOfPlayers: Object.keys(playerEntries).length,
      yourEntries,
      players: Object.keys(playerEntries),
      status,
      winner,
      winChance: yourEntries / pricePool,
      chartData: {
        labels: Object.keys(playerEntries),
        datasets: [
          {
            data: Object.values(playerEntries),
            backgroundColor: Object.keys(playerEntries).map(
              (_entries, index) =>
                distinctColors[index % distinctColors.length],
            ),
            hoverOffset: 4,
            borderWidth: 0,
          },
        ],
      },
    },
    { status: 200 },

    
    
    );
    // console.log(response);
    
    return response;
    
}
