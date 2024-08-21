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
  const url = new URL(req.url);

  const pathname = new URL(req.url).pathname;
  console.log(pathname);
  const { address, amount } = await req.json();
  try {
    let currentRound = await getCurrentRound();
    const round = await Round.findOne({ roundNumber: currentRound });
    let delta = 0
    let balanceOfPrevious = 0;
    if (round) {
      const player = round.players.find((player) => player.address === address);

      if (player) {
        balanceOfPrevious = player.entries || 0;
      }
      console.log("nextPlayerData", balanceOfPrevious);
      const preTokenBalanace =
        (await getTokenBalance(connection, tokenAddress, address)) || 0;

      await setTimeout(20000);
      const postTokenBalanace =
        (await getTokenBalance(connection, tokenAddress, address)) || 0;
      const deltabalance = preTokenBalanace - postTokenBalanace;
      console.log("nextPlayerData", balanceOfPrevious);
      console.log("nextPlayerData", postTokenBalanace);
      console.log("nextPlayerData", deltabalance);
         delta = balanceOfPrevious - deltabalance;

      const updatedRound = await round.save();
      console.log(updatedRound);
    }

    return NextResponse.json({ message: "success", delta }, { status: 200 });
  } catch (error) {}

  return NextResponse.json({ message: "failed" }, { status: 500 });
}
