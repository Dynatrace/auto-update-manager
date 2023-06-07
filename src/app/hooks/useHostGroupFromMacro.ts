import { queryExecutionClient } from "@dynatrace-sdk/client-query";
import { useQuery } from "@tanstack/react-query";
import { Macro, HostGroup } from "../types/Types";

async function fetcher(macro: Macro) {
  const query =
    macro && macro.filter && macro.filter.length > 0
      ? `fetch dt.entity.host
    |filter ${macro.filter}
    |fieldsAdd host_group_id=instance_of[dt.entity.host_group]
    |lookup [fetch dt.entity.host_group],sourceField:host_group_id,lookupField:id
    |filter isNotNull(host_group_id)
    |summarize by:{host_group_id,host_group=lookup.entity.name}, count=count()`
      : `fetch dt.entity.host
    |fieldsAdd host_group_id=instance_of[dt.entity.host_group]
    |lookup [fetch dt.entity.host_group],sourceField:host_group_id,lookupField:id
    |filter isNotNull(host_group_id)
    |summarize by:{host_group_id,host_group=lookup.entity.name}, count=count()`;

    let hostgroups: HostGroup[] = [];
   const res = await queryExecutionClient.queryExecute({
    body: {
      query,
      requestTimeoutMilliseconds: 5000,
    },
  });
  if (res.result?.records) {
    const tmp = res.result.records
      .filter((r): r is { id: string; "entity.name": string } => r != null)
      .map((r) => ({
        id: r["host_group_id"],
        name: r["host_group"],
      }));
    hostgroups = hostgroups.concat(tmp);
  }
  return hostgroups;
}

export function useHostGroupFromMacro(macro: Macro) {
  return useQuery({
    queryFn: () =>  fetcher(macro),
    queryKey: ['hostgroups', macro.name],
  });
}
