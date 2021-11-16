import React from "react";
import { Chart } from "react-google-charts";

export default function Histogram({ data, color }) {
  return (
    <Chart
      width={"300px"}
      height={"300px"}
      chartType="Histogram"
      loader={<div className={"placeholder"}>Loading Chart</div>}
      data={[["Reward"], ...data.map((d) => [d])]}
      options={{
        legend: { position: "none" },
        colors: [color],
        vAxis: { title: "Frequency" },
        hAxis: { title: "Reward Range" },
      }}
      rootProps={{ "data-testid": "1" }}
    ></Chart>
  );
}
