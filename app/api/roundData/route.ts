// app/api/route.js 👈🏽

import { NextResponse } from "next/server";

// To handle a GET request to /api
export async function GET() {
  // Do whatever you want
  const yourEntries = 2;
  const pricePool = 10;
  return NextResponse.json(
    {
      roundNumber: 1,
      pricePool,
      numberOfPlayers: 6,
      yourEntries,
      players: ["Ranga", "Zoro", "Luffy"],
      status: "open",
      winner: null,
      winChance: yourEntries / pricePool,
      chartData: {
        labels: ["address1", "address2", "address3"],
        datasets: [
          {
            data: [20, 50, 20],
            backgroundColor: [
              "rgb(255, 99, 132)",
              "rgb(54, 162, 235)",
              "rgb(255, 205, 86)",
            ],
            hoverOffset: 4,
            borderWidth: 0,
          },
        ],
      },
    },
    { status: 200 },
  );
}

// To handle a POST request to /api
export async function POST() {
  // Do whatever you want
  return NextResponse.json({ message: "Hello World" }, { status: 200 });
}
