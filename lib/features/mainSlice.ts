import { createAppSlice } from "@/lib/createAppSlice";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface MainSliceState {
  solAmount: string | undefined;
  wallet: string | undefined;
  chartData: any;
  roundNumber: number;
  numberOfPlayers: number;
  pricePool: number;
  winChance: number;
  yourEntries: number;
  status: string | undefined;
  winner: string | undefined;
  stopRequest:boolean | undefined;
  error: string | undefined;
}

const initialState: MainSliceState = {
  solAmount: undefined,
  wallet: undefined,
  chartData: {
    labels: ["address1"],
    datasets: [
      {
        data: [1],
        backgroundColor: ["rgb(255, 99, 132)"],
        hoverOffset: 4,
        borderWidth: 0,
      },
    ],
  },
  roundNumber: 0,
  numberOfPlayers: 0,
  pricePool: 0,
  winChance: 0,
  yourEntries: 0,
  status:undefined,
  winner:undefined,
  stopRequest:undefined,
  error: undefined,
};

// If you are not using async thunks you can use the standalone `createSlice`.
export const mainSlice = createAppSlice({
  name: "main",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: (create) => ({
    // Use the `PayloadAction` type to declare the contents of `action.payload`
    setSolAmount: create.reducer((state, action: PayloadAction<string>) => {
      state.solAmount = action.payload;
    }),
    setWallet: create.reducer((state, action: PayloadAction<string>) => {
      state.wallet = action.payload;
    }),
    setChartData: create.reducer((state, action: PayloadAction<any>) => {
      state.chartData = action.payload;
    }),
    setRoundNumber: create.reducer((state, action: PayloadAction<number>) => {
      state.roundNumber = action.payload;
    }),
    setNumberOfPlayers: create.reducer(
      (state, action: PayloadAction<number>) => {
        state.numberOfPlayers = action.payload;
      },
    ),
    setPricePool: create.reducer((state, action: PayloadAction<number>) => {
      state.pricePool = action.payload;
    }),
    setWinChance: create.reducer((state, action: PayloadAction<number>) => {
      state.winChance = action.payload;
    }),
    setYourEntries: create.reducer((state, action: PayloadAction<number>) => {
      state.yourEntries = action.payload;
    }),
    setStatus: create.reducer((state, action: PayloadAction<string>) => {
      state.status = action.payload;
    }),
    setWinner: create.reducer((state, action: PayloadAction<string>) => {
      state.winner = action.payload;
    }),
    setStopRequest: create.reducer((state, action: PayloadAction<boolean>) => {
      state.stopRequest = action.payload;
    }),
    setError: create.reducer((state, action: PayloadAction<string>) => {
      state.error = action.payload;
    }),
  }),
  // You can define your selectors here. These selectors receive the slice
  // state as their first argument.
  selectors: {
    selectSolAmount: (counter) => counter.solAmount,
    selectWallet: (counter) => counter.wallet,
    selectError: (counter) => counter.error,
    selectChartData: (counter) => counter.chartData,
    selectRoundNumber: (counter) => counter.roundNumber,
    selectNumberOfPlayers: (counter) => counter.numberOfPlayers,
    selectPricePool: (counter) => counter.pricePool,
    selectWinChance: (counter) => counter.winChance,
    selectYourEntries: (counter) => counter.yourEntries,
    selectStatus: (counter) => counter.status,
    selectWinner: (counter) => counter.winner,
    selectStopRequest: (counter) => counter.stopRequest,
  },
});

// Action creators are generated for each case reducer function.
export const {
  setSolAmount,
  setWallet,
  setChartData,
  setRoundNumber,
  setNumberOfPlayers,
  setPricePool,
  setWinChance,
  setYourEntries,
  setStatus,
  setWinner,
  setStopRequest,
  setError,
} = mainSlice.actions;

// Selectors returned by `slice.selectors` take the root state as their first argument.
export const {
  selectSolAmount,
  selectWallet,
  selectChartData,
  selectRoundNumber,
  selectNumberOfPlayers,
  selectPricePool,
  selectWinChance,
  selectYourEntries,
  selectStatus,
  selectWinner,
  selectStopRequest,
  selectError,
} = mainSlice.selectors;
