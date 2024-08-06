import React from "react";

import Chart from "./Chart";
import ChartItems from "./ChartItems";

const Chartcomponents = ({ chartData, roundNumber }: any) => {
  return (
    <>
      <ChartItems roundNumber={roundNumber} />
      <Chart chartData={chartData} />
    </>
  );
};

export default Chartcomponents;
