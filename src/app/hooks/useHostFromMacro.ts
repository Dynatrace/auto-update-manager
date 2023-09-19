import { queryExecutionClient } from "@dynatrace-sdk/client-query";
import { useQuery } from "@tanstack/react-query";
import { Macro, Host } from "../types/Types";

async function fetcher(macro: Macro) {
  const query =
    macro && macro.filter && macro.filter.length > 0
      ? `fetch dt.entity.host
    |filter ${macro.filter}
    |limit 1000`
      : `fetch dt.entity.host
    |filter isNotNull(null)
    |limit 1000`;

  let hosts: Host[] = [];
  const res = await queryExecutionClient.queryExecute({
    body: {
      query,
      requestTimeoutMilliseconds: 5000,
      maxResultRecords: 1000,
    },
  });
  if (res.result?.records) {
    const tmp = res.result.records
      .filter((r): r is { id: string; "entity.name": string } => r != null)
      .map((r) => ({
        id: r["id"],
        name: r["entity.name"],
      }));
    hosts = hosts.concat(tmp);
  }
  return hosts;
}

export function useHostFromMacro(macro: Macro) {
  return useQuery({
    queryFn: () => fetcher(macro),
    queryKey: ["hosts", macro.name],
  });
}
