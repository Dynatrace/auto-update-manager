import { useQuery } from "@tanstack/react-query";
import { Meta } from "../types/Meta";
import { stateClient } from "@dynatrace-sdk/client-state";

const loadMacrosFromServer = async () => {
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
};

export const useMacros = () => {
  const meta: Meta = {
    errorTitle: "Failed to query macros",
  };
  return useQuery({
    queryFn: () => loadMacrosFromServer(),
    queryKey: ["macros"],
    meta,
    staleTime: 30000,
  });
};
