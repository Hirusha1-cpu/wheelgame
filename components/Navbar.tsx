import {
  selectError,
  selectWallet,
  setError,
  setWallet,
} from "@/lib/features/mainSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { PublicKey, Transaction } from "@solana/web3.js";
import React, { useEffect } from "react";

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
      const resp = await provider.connect();
      dispatch(setWallet(resp.publicKey.toString()));
      dispatch(setError(""));
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
        dispatch(setError("Phantom wallet disconnected"));
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
  }, []);

  return (
    <div className="w-full bg-blue-500 p-5">
      <h1 className="text-2xl text-white">NavBar</h1>
      <button onClick={handleConnect}>Connect to Phantom</button>
      {wallet && <p>Connected: {wallet}</p>}
      {error && <p>Error: {error}</p>}
    </div>
  );
};

export default NavBar;
