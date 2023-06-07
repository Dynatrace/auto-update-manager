import React, {useRef} from "react";
import { LoadingIndicator, DonutChart, PieChartRef } from "@dynatrace/strato-components-preview";
import { useOneAgentOnAHost } from "src/app/hooks/useOneAgentOnAHost";
import { Indicator } from "../Indicator";

export const UpdateStatusChart = () => {
  const agents = useOneAgentOnAHost({ includeDetails: false });
  const myRef = useRef<PieChartRef>(null);
  
  if (agents.isError) return <Indicator state="critical">{(agents.error as object).toString()}</Indicator>;
  if (agents.isLoading) return <LoadingIndicator />;

  const slices =
    agents.data
      .filter((h) => h.updateStatus != undefined)
      .filter((h) => h.hostInfo?.agentVersion != undefined)
      ?.map((h) => h.updateStatus as string)
      .reduce((accumulator, value: string) => {
        return { ...accumulator, [value]: (accumulator[value] || 0) + 1 };
      }, {}) || {};
  const data = {
    slices: Object.keys(slices).map((k) => ({ category: k, value: slices[k] })),
  };
  console.log("Donut:",myRef.current);

  return (
    <DonutChart data={data} ref={myRef} >
      <DonutChart.Grouping threshold={{ type: "number-of-slices", value: Object.keys(slices).length }} name={"..."} />
    </DonutChart>
  );
};
