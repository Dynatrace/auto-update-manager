import { useMutation, useQueryClient, } from "@tanstack/react-query";
import { Meta } from "../types/Meta";
import { Macro, UpdateMode } from "../types/Types";
import { stateClient } from "@dynatrace-sdk/client-state";

export const useAddMacro = () => {
  const queryClient = useQueryClient();
  const addMacro = async (formData: FormData, oldMacro?: Macro) => {
    const name = formData.get("name")?.toString() || "error";
    const filter = formData.get("filter")?.toString() || "";
    let updateMode = formData.get("updateMode")?.toString() || "";
    updateMode = !["AUTOMATIC", "AUTOMATIC_DURING_MW", "MANUAL"].includes(updateMode) ? "AUTOMATIC" : updateMode;
    const desiredVersion = formData.get("desiredVersion")?.toString() || "";
    const desiredWindow = formData.get("desiredWindow")?.toString() || "";
    const scope = formData.get("scope") == "host" ? "host" : "hostgroup";

    const macro: Macro = {
      name: name,
      filter: filter,
      updateMode: updateMode as UpdateMode,
      desiredVersion: desiredVersion,
      desiredWindow: desiredWindow,
      scope: scope,
    };
    const macros: Macro[] = await queryClient.ensureQueryData(["macros"]);
    const newMacros: Macro[] = [...macros];
    if (oldMacro)
      newMacros.splice(
        newMacros.findIndex((nm) => nm.name === oldMacro.name),
        1,
        macro
      );
    else newMacros.push(macro);
    await saveMacrosToServer(newMacros);
  };
  const saveMacrosToServer = async (currentMacros: Macro[]) => {
    await stateClient.setAppState({ key: "macros", body: { value: JSON.stringify(currentMacros) } });
  };

  const meta: Meta = {
    errorTitle: "Failed to update macros",
  };

  return useMutation({
    mutationFn: (variables:{formData: FormData, macro?: Macro}) => {
        const {formData, macro}:{formData: FormData, macro?: Macro} = variables;
      return addMacro(formData, macro);
    },
    mutationKey: ["macros"],
    meta,
    onSuccess: () => {
      // trigger a refetch for settings after mutation was successful by invalidating the query
      queryClient.invalidateQueries({ queryKey: ["macros"] });
    },
  });
};
