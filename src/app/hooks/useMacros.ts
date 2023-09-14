import { useQuery, QueryKey } from "@tanstack/react-query";
import { Meta } from "../types/Meta";
import { Macro } from "../types/Types";
import { stateClient } from "@dynatrace-sdk/client-state";

type scopeType = "hostgroup" | "host";

const loadMacrosFromServer = async (scope?: scopeType):Promise<Macro[]> => {
  try {
    const appState = await stateClient.getAppState({ key: "macros" });
    if (typeof appState?.value == "string") {
      const serverMacros = JSON.parse(appState.value);
      return serverMacros;
    }
  } catch (e) {
    if (e?.body?.error?.code == 404) return [];
    else throw e;
  }
  return [];
};

export const useMacros = (scope?: scopeType) => {
  const filterMacros = (macros: Macro[]) => {
    const filteredMacros: Macro[] = macros.filter((m) => {
      if (scope == "hostgroup") {
        if (m.scope == "hostgroup" || typeof m.scope == "undefined") return true;
        else return false;
      } else if (scope == "host" && m.scope == "host") return true;
      else return false;
    });
    return filteredMacros;
  };
  const meta: Meta = {
    errorTitle: "Failed to query macros",
  };
  return useQuery<Macro[],unknown,Macro[],QueryKey>({
    queryFn: () => loadMacrosFromServer(scope),
    queryKey: ["macros"],
    select: filterMacros,
    meta,
    staleTime: 30000,
  });
};
