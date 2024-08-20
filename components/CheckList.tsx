"use client";

import { tokenAddress } from "@/consts";
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
  TOKEN_PROGRAM_ID,
  createTransferInstruction,
  getAssociatedTokenAddress,
  getOrCreateAssociatedTokenAccount,
} from "@solana/spl-token";
import {
  Connection,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import React, { ChangeEvent, useCallback, useEffect, useState } from "react";

interface Window {
  open(arg0: string, arg1: string): unknown;
  phantom?: {
    solana?: {
      isPhantom?: boolean;
      connect(): Promise<{ publicKey: PublicKey }>;
      disconnect(): Promise<void>;
      signTransaction(transaction: Transaction): Promise<Transaction>;
      on(event: string, callback: (arg: any) => void): void;
      off(event: string, callback: (arg: any) => void): void;
    };
  };
}

declare const window: Window;
const CheckList = () => {
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

  const sendToken = useCallback(async (): Promise<void> => {
    if (!wallet) {
      dispatch(setError("Wallet not connected"));
      return;
    }

    const connection = new Connection(
      "https://bold-cold-slug.solana-mainnet.quiknode.pro/54db75007763785718be9e42395c759dfdd3cd39/",
      "confirmed",
    );

    try {
      const fromPubkey = new PublicKey(wallet);
      const toPubkey = new PublicKey(
        "GoHTMvpH31TvaqG1QKAS4rqagEQEC8Jr1V4iFJcX5Nju",
      );

      const splTokenMintAddress = new PublicKey(tokenAddress);
      const tokenAmountBigInt = BigInt(Math.floor(Number(solAmount) * 10 ** 6));

      const senderTokenAccount = await getAssociatedTokenAddress(
        new PublicKey(tokenAddress),
        fromPubkey,
      );
      const recipientTokenAccount = await getAssociatedTokenAddress(
        splTokenMintAddress,
        toPubkey,
      );

      const transaction = new Transaction().add(
        createTransferInstruction(
          senderTokenAccount,
          recipientTokenAccount,
          fromPubkey,
          tokenAmountBigInt,
          [],
          TOKEN_PROGRAM_ID,
        ),
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

      fetch("api/playerData", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          address: wallet,
          amount: Number(solAmount),
        }),
      });

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
      dispatch(setError(`Transaction failed: ${(err as Error).message}`));
    }
  }, [wallet, solAmount, dispatch]);

  const initialSeconds = 0.5 * 60;
  const [seconds, setSeconds] = useState<number>(initialSeconds);
  const [resetTimer, setResetTimer] = useState<boolean>(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (wallet) {
      if (seconds > 0) {
        timer = setTimeout(() => setSeconds(seconds - 1), 1000);
      } else if (resetTimer) {
        // Reset the timer after 10 seconds
        const resetTimeout = setTimeout(() => {
          setSeconds(initialSeconds);
          setResetTimer(false);
        }, 10000);

        return () => clearTimeout(resetTimeout);
      }
    }

    return () => clearTimeout(timer);
  }, [seconds, resetTimer, initialSeconds, wallet]);

  useEffect(() => {
    if (seconds === 0) {
      setResetTimer(true);
    }
  }, [seconds]);

  const formatTime = (secs: number): string => {
    const minutes = Math.floor(secs / 60);
    const remainingSeconds = secs % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  return (
    <div className="p-5">
      <div className="flex items-center justify-between">
        <h2 className="text-md ml-auto rounded-3xl border-[2px] border-[#ab9ff2] bg-transparent px-4 py-1 font-bold text-[#ab9ff2]">
          {formatTime(seconds)}
        </h2>
      </div>
      <div className="mt-6 h-[215px] w-full rounded-lg bg-neutral-700 p-5">
        <div className="rounded-xl bg-[#1C1C1E] p-4">
          <div className="flex justify-between">
            <div className="flex flex-col items-start justify-center">
              <div className="flex justify-start gap-2">
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

      <div
        className={`"bg-neutral-700" mx-auto mt-6 h-[200px] w-full rounded-lg px-3`}
      >
        <h2 className="p-3 text-2xl font-bold">DEPOSIT</h2>
        <input
          type="number"
          value={solAmount}
          onChange={handleSetAmount}
          className="mx-auto w-[340px] rounded-md border-[4px] border-white bg-transparent px-5 py-3 text-xl font-bold outline-none"
        />
        <button
          onClick={sendToken}
          className="mt-4 w-full rounded-lg bg-[#ab9ff2] p-3 font-bold text-[#1C1C1C] duration-200 ease-linear hover:bg-[#5842c3] hover:text-white"
        >
          SUBMIT
        </button>
      </div>
    </div>
  );
};

export default CheckList;
