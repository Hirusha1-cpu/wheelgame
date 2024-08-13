import {
  selectError,
  selectWallet,
  setError,
  setWallet,
} from "@/lib/features/mainSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { PublicKey, Transaction } from "@solana/web3.js";
import React, { useEffect } from "react";
import { Cherry } from "lucide-react";

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

const NavBar = () => {
  const dispatch = useAppDispatch();

  const wallet = useAppSelector(selectWallet);
  const error = useAppSelector(selectError);
  const isPhantomInstalled = (): boolean =>
    window.phantom?.solana?.isPhantom || false;

  const getProvider = () => {
    if (isPhantomInstalled()) {
      return window.phantom!.solana!;
    } else {
      window.open("https://phantom.app/", "_blank");
      throw new Error("Phantom wallet not found");
    }
  };

  const handleConnect = async (): Promise<void> => {
    try {
      const provider = getProvider();
      if (wallet) {
        await provider.disconnect();
        dispatch(setWallet("")); // Clear the wallet state
      } else {
        const resp = await provider.connect();
        dispatch(setWallet(resp.publicKey.toString()));
        dispatch(setError(""));
      }
    } catch (err) {
      dispatch(setError((err as Error).message));
    }
  };

  useEffect(() => {
    const provider = window.phantom?.solana;
    if (provider && isPhantomInstalled()) {
      const handleConnect = (publicKey: PublicKey) => {
        dispatch(setWallet(publicKey.toString()));
        dispatch(setError(""));
      };

      const handleDisconnect = () => {
        dispatch(setWallet("")); // Just clear the wallet without setting an error
      };

      const handleAccountChanged = async (publicKey: PublicKey | null) => {
        if (publicKey) {
          dispatch(setWallet(publicKey.toString()));
          dispatch(setError(""));
        } else {
          try {
            const resp = await provider.connect();
            dispatch(setWallet(resp.publicKey.toString()));
            dispatch(setError(""));
          } catch (error) {
            dispatch(setError((error as Error).message));
          }
        }
      };

      provider.on("connect", handleConnect);
      provider.on("disconnect", handleDisconnect);
      provider.on("accountChanged", handleAccountChanged);

      return () => {
        provider.off("connect", handleConnect);
        provider.off("disconnect", handleDisconnect);
        provider.off("accountChanged", handleAccountChanged);
      };
    }
  }, [wallet, dispatch]);

  return (
    <div className="w-full bg-[#1C1C1E] px-5 py-3 flex items-center justify-between">
      <div className="cursor-pointer flex items-end gap-2">
      <Cherry className="h-8 w-8 text-red-500" />
      <h1 className="text-xl text-white font-bold uppercase">che bet</h1>
      </div>
      <div className="flex flex-row-reverse items-center gap-4">
        <button
          onClick={handleConnect}
          className="hover:bg-[#ab9ff2] px-4 py-1 rounded-3xl text-white border-white border-[2px] bg-transparent ease-linear duration-200 hover:scale-105 hover:font-bold hover:text-[#1C1C1E] hover:border-[#ab9ff2]"
        >
          {wallet ? "Disconnect" : "Connect"}
        </button>
        {wallet && <p className="text-[12px]">Connected: {wallet}</p>}
        {error && <p className="text-[12px]">Error: {error}</p>}
      </div>
    </div>
  );
};

export default NavBar;
