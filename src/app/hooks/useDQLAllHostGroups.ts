import { useQuery } from "@tanstack/react-query";
import { queryExecutionClient } from "@dynatrace-sdk/client-query";
import { Meta } from "../types/Meta";
import { HostGroup } from "../types/Types";

async function fetcher() {
  let hostgroups: HostGroup[] = [];
  const res = await queryExecutionClient.queryExecute({
    body: {
      //get all host groups
      query: `fetch dt.entity.host_group
            | fields id, entity.name
            | limit 50000`,
      requestTimeoutMilliseconds: 5000,
    },
  });
  if (res.result?.records) {
    const tmp = res.result.records
      .filter((r): r is { id: string; "entity.name": string } => r != null)
      .map((r) => ({
        id: r["id"],
        name: r["entity.name"],
      }));
    hostgroups = hostgroups.concat(tmp);
  }
  return hostgroups;
}
export const useDQLAllHostGroups = () => {
  const meta: Meta = {
    errorTitle: "Failed to query hostgroups",
  };
  return useQuery({
    queryFn: () => fetcher(),
    queryKey: ["all hostgroups"],
    meta,
  });
};
