import { tokenAddress } from "@/consts";
import Round from "@/models/Round";
import {
  getAssociatedTokenAddressSync,
  getOrCreateAssociatedTokenAccount,
} from "@solana/spl-token";
import { Connection, ParsedAccountData, PublicKey } from "@solana/web3.js";
import { NextResponse } from "next/server";
import { setTimeout } from "timers/promises";

import { getCurrentRound } from "../roundData/route";

export async function getTokenBalance(
  connection: Connection,
  tokenAddress: string,
  owner: string,
): Promise<number> {
  try {
    const accountInfo = await connection.getParsedAccountInfo(
      getAssociatedTokenAddressSync(
        new PublicKey(tokenAddress),
        new PublicKey(owner),
      ),
    );

    if (!accountInfo.value?.data) {
      throw Error("Error locating associated token account");
    }
    const { uiAmount } = (accountInfo.value?.data as ParsedAccountData)?.parsed
      ?.info?.tokenAmount;

    return uiAmount;
  } catch (error: any) {
    throw Error(`Error getting token balance: ${error.message}`);
  }
}

const connection = new Connection(
  "https://api.mainnet-beta.solana.com",
  "confirmed",
);

export async function POST(req: Request) {
  const { address, amount } = await req.json();
  let timer = "";
  try {
    const preTokenBalanace =
      (await getTokenBalance(connection, tokenAddress, address)) || 0;
    await setTimeout(5000);
    const postTokenBalanace =
      (await getTokenBalance(connection, tokenAddress, address)) || 0;
    const delta = preTokenBalanace - postTokenBalanace;

    console.log("playerData", preTokenBalanace);
    console.log("playerData", postTokenBalanace);
    console.log("playerData", delta);

    let currentRound = await getCurrentRound();
    const round = await Round.findOne({ roundNumber: currentRound });

    if (round) {
      const playerIndex = round.players.findIndex(
        (player) => player.address === address,
      );
      if (playerIndex !== -1) {
        // Player exists, update their entries
        round.players[playerIndex].entries = delta;
      } else {
        // Player does not exist, add a new player
        round.players.push({ address: address, entries: delta });
      }

      const updatedRound = await round.save();
      console.log(updatedRound);
      const date = new Date(updatedRound.startTimeStamp);
      const hours = date.getHours();
      const minutes = date.getMinutes();
      const ampm = hours >= 12 ? "PM" : "AM";
      const formattedHours = hours % 12 || 12; // Convert to 12-hour format
      const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
      const standardTime = `${formattedHours}:${formattedMinutes} ${ampm}`;
      timer = standardTime 
    }

    return NextResponse.json(
      { message: "success", delta, timer },
      { status: 200 },
    );
  } catch (error) {}

  return NextResponse.json({ message: "failed" }, { status: 500 });
}
