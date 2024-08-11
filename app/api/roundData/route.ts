import { NextResponse } from "next/server";

const duration = 0;

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

const dbData: {
  [key: number]: { players: Player[]; startTimeStamp: number };
  currentRound: number;
} = {
  0: {
    players: [
      { address: "address1", entries: 2 },
      { address: "address1", entries: 2 },
      { address: "address1", entries: 2 },
      { address: "address1", entries: 2 },
      { address: "address1", entries: 2 },
      { address: "address1", entries: 2 },
      { address: "address2", entries: 3 },
      { address: "address2", entries: 3 },
      { address: "address2", entries: 3 },
      { address: "address2", entries: 3 },
      { address: "address1", entries: 1 },
      { address: "address1", entries: 1 },
      { address: "address3", entries: 1 },
      { address: "address4", entries: 1 },
      { address: "address4", entries: 1 },
    ],
    startTimeStamp: 0,
  },
  currentRound: 0,
};

export async function GET() {
  // Do whatever you want
  const yourEntries = 2;

  const currentRound = dbData.currentRound;
  const strtTimestamp = dbData[currentRound].startTimeStamp;

  const playerEntries: PlayerEntries = dbData[currentRound].players.reduce(
    (acc, player) => {
      acc[player.address] = (acc[player.address] || 0) + player.entries;
      return acc;
    },
    {} as PlayerEntries,
  );

  const pricePool: number = Object.values(playerEntries).reduce(
    (sum, entries) => sum + entries,
    0,
  );

  if (status === "open" && strtTimestamp + duration < Date.now()) {
    status = "closed";
    winner =
      Object.keys(playerEntries)[
        Math.floor(Math.random() * Object.keys(dbData).length)
      ];
  } else if (status === "closed") {
    status = "open";
    winner = null;
    const currentRound = dbData.currentRound + 1;
    dbData[currentRound] = {
      players: [],
      startTimeStamp: Date.now(),
    };
    dbData.currentRound = currentRound;
    dbData[currentRound].startTimeStamp = Date.now();
  }

  return NextResponse.json(
    {
      roundNumber: currentRound,
      pricePool: pricePool,
      numberOfPlayers: Object.keys(playerEntries).length,
      yourEntries,
      players: Object.keys(playerEntries),
      status,
      winner: winner,
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
}
