"use client";

import {
  selectNumberOfPlayers,
  selectPricePool,
  selectSolAmount,
  selectWallet,
  selectWinChance,
  selectYourEntries,
  setError,
  setSolAmount,
} from "@/lib/features/mainSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import {
  Connection,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import { History } from "lucide-react";
import { Cherry } from "lucide-react";
import React, { ChangeEvent, useCallback } from "react";
import Clock from "react-live-clock";

interface Window {
  open(arg0: string, arg1: string): unknown;
  phantom?: {
    solana?: {
      isPhantom?: boolean;
      connect(): Promise<{ publicKey: PublicKey }>;
      signTransaction(transaction: Transaction): Promise<Transaction>;
      on(event: string, callback: (arg: any) => void): void;
      off(event: string, callback: (arg: any) => void): void;
    };
  };
}

declare const window: Window;

const CheckList = ({}: any) => {
  const solAmount = useAppSelector(selectSolAmount);
  const pricePool = useAppSelector(selectPricePool);
  const numberOfPlayers = useAppSelector(selectNumberOfPlayers);
  const winChance = useAppSelector(selectWinChance);
  const yourEntries = useAppSelector(selectYourEntries);
  const wallet = useAppSelector(selectWallet);
  const dispatch = useAppDispatch();

  const handleSetAmount = (event: ChangeEvent<HTMLInputElement>) => {
    dispatch(setSolAmount(event.target.value));
  };

  const sendSol = useCallback(async (): Promise<void> => {
    if (!wallet) {
      setError("Wallet not connected");
      return;
    }

    const connection = new Connection(
      "https://bold-cold-slug.solana-mainnet.quiknode.pro/54db75007763785718be9e42395c759dfdd3cd39/",
      "confirmed",
    );

    try {
      const fromPubkey = new PublicKey(wallet);
      const toPubkey = new PublicKey(
        "8uGGDM6BLU4rhEtK3tCsiAQRc4fWE2CuDopygxDFx9ch",
      );

      const lamportsI = LAMPORTS_PER_SOL * Number(solAmount);

      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey,
          toPubkey,
          lamports: lamportsI,
        }),
      );

      const { blockhash, lastValidBlockHeight } =
        await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = fromPubkey;

      const signed = await window.phantom!.solana!.signTransaction(transaction);
      const signature = await connection.sendRawTransaction(
        signed.serialize(),
        {
          skipPreflight: true,
        },
      );

      // Use the new confirmTransaction method
      const confirmation = await connection.confirmTransaction({
        signature,
        blockhash,
        lastValidBlockHeight,
      });

      if (confirmation.value.err) {
        throw new Error(
          `Transaction failed: ${confirmation.value.err.toString()}`,
        );
      }
    } catch (err) {
      setError(`Transaction failed: ${(err as Error).message}`);
    }
  }, [wallet, solAmount]);

  return (
    <div className="p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <History className="size-6" />
          <h4 className="text-md font-bold">History</h4>
        </div>
        {/* <Clock
          format={"HH:mm"}
          ticking={true}
          className="text-lg font-bold"
        /> */}
      </div>
      <div className="mt-6 h-[215px] w-full rounded-lg bg-neutral-700 p-5">
        <div className="rounded-xl bg-[#1C1C1E] p-4">
          <div className="flex justify-between">
            <div className="flex flex-col items-start justify-center">
              <div className="flex justify-start gap-2">
                <Cherry />
                <h2 className="text-xl font-bold">{pricePool}</h2>
              </div>
              <p>Price Pool</p>
            </div>
            <div className="mr-20">
              <p className="first-letter:text-3xl">{numberOfPlayers}/50</p>
              <p>Players</p>
            </div>
          </div>

          <div className="mt-5 flex justify-between">
            <div className="flex flex-col items-start justify-center">
              <div className="flex gap-2">
                <Cherry />
                <h2 className="text-xl font-bold">{yourEntries}</h2>
              </div>
              <p>Your Entries</p>
            </div>
            <div className="">
              <p className="first-letter:text-3xl">{winChance}X</p>
              <p>Your Win Chance</p>
            </div>
          </div>
        </div>
      </div>
      <div className="mx-auto mt-6 h-[200px] w-full rounded-lg bg-neutral-700 px-3">
        <h2 className="p-3 text-2xl font-bold">DEPOSIT</h2>
        <input
          type="number"
          value={solAmount}
          onChange={handleSetAmount}
          className="mx-auto w-[340px] rounded-md bg-transparent py-3 outline"
        />
        <button
          onClick={sendSol}
          className="mt-4 w-full rounded-lg bg-yellow-400 p-3 font-bold text-black"
        >
          SUBMIT
        </button>
      </div>
    </div>
  );
};

export default CheckList;
