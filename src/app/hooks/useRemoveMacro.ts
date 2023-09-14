import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Meta } from "../types/Meta";
import { Macro } from "../types/Types";
import { stateClient } from "@dynatrace-sdk/client-state";

export const useRemoveMacro = () => {
  const queryClient = useQueryClient();
  const removeMacro = async (macro: Macro) => {
    const macros: Macro[] = await queryClient.ensureQueryData(["macros"]);
    const newMacros = macros.filter((m) => m.name != macro.name);
    await saveMacrosToServer(newMacros);
  };

  const saveMacrosToServer = async (currentMacros: Macro[]) => {
    await stateClient.setAppState({ key: "macros", body: { value: JSON.stringify(currentMacros) } });
  };

  const meta: Meta = {
    errorTitle: "Failed to update macros",
  };

  return useMutation({
    mutationFn: (macro: Macro) => {
      return removeMacro(macro);
    },
    mutationKey: ["macros"],
    meta,
    onSuccess: () => {
      // trigger a refetch for settings after mutation was successful by invalidating the query
      queryClient.invalidateQueries({ queryKey: ["macros"] });
    },
  });
};
