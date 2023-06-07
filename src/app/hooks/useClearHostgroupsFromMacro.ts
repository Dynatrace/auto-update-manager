import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Meta } from "../types/Meta";
import {
  settingsObjectsClient,
  SettingsObject,
} from "@dynatrace-sdk/client-classic-environment-v2";
import { SchemaType, Macro, HostGroup } from "../types/Types";

const UPDATES_SCHEMA: SchemaType = "builtin:deployment.oneagent.updates";

export function useClearHostgroupsFromMacro() {
  const queryClient = useQueryClient();

  async function writer(macro: Macro) {
    const hostgroups: HostGroup[] = queryClient.getQueryData(["hostgroups", macro.name]) || [];
    const settings: SettingsObject[] = queryClient.getQueryData(["auto-update-settings", UPDATES_SCHEMA]) || [];

    const settingsToDelete = settings.filter((s) => hostgroups.findIndex((hg) => hg.id == s.scope) > -1);
    for (const s of settingsToDelete) {
      if (typeof s.objectId == "string")
        await settingsObjectsClient.deleteSettingsObjectByObjectId({ objectId: s.objectId });
    }
  }
  const meta: Meta = {
    errorTitle: "Failed to delete settings",
    successTitle: "Success",
    successMessage: "Successfully deleted settings",
  };

  return useMutation({
    mutationFn: ({ macro }: { macro: Macro }) => {
      return writer(macro);
    },
    meta,
    onSuccess: () => {
      // trigger a refetch for settings after mutation was successful by invalidating the query
      queryClient.invalidateQueries({ queryKey: ["auto-update-settings", UPDATES_SCHEMA] });
    },
  });
}
