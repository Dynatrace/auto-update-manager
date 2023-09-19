import { useQuery } from "@tanstack/react-query";
import { queryExecutionClient } from "@dynatrace-sdk/client-query";
import { Meta } from "../types/Meta";
import { Host } from "../types/Types";

async function fetcher(hostid: string) {
  const res = await queryExecutionClient.queryExecute({
    body: {
      //lookup host
      query: `fetch dt.entity.host
            | filter id == "${hostid}"
            | fields id, entity.name
            | limit 1`,
      requestTimeoutMilliseconds: 5000,
    },
  });
  if (res.result?.records) {
    const hosts: Host[] = res.result.records
      .filter((r): r is { id: string; "entity.name": string } => r != null)
      .map((r) => ({
        id: r["id"],
        name: r["entity.name"],
      }));
    return hosts;
  }
  return [];
}
export const useDQLHostLookup = (hostid: string) => {
  const meta: Meta = {
    errorTitle: "Failed to query host",
  };
  return useQuery({
    queryFn: () => fetcher(hostid),
    queryKey: ["hosts", { hostid }],
    meta,
  });
};
