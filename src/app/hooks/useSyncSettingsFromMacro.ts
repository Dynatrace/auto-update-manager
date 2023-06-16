import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Meta } from "../types/Meta";
import { settingsObjectsClient, SettingsObjectCreate } from "@dynatrace-sdk/client-classic-environment-v2";
import { SchemaType, Macro, HostGroup, Host } from "../types/Types";
import { showToast } from "@dynatrace/strato-components-preview";

const UPDATES_SCHEMA: SchemaType = "builtin:deployment.oneagent.updates";

export function useSyncSettingsFromMacro() {
  const queryClient = useQueryClient();

  async function hostgroupWriter(macro: Macro, validateOnly: boolean) {
    const hostgroups: HostGroup[] = queryClient.getQueryData(["hostgroups", macro.name]) || [];
    const objects: SettingsObjectCreate[] = [];
    const value = {
      updateMode: macro.updateMode,
      maintenanceWindows:
        macro.updateMode == "AUTOMATIC_DURING_MW" ? [{ maintenanceWindow: macro.desiredWindow }] : null,
      targetVersion: macro.desiredVersion.startsWith("1.")
        ? macro.desiredVersion.substring(0, 5)
        : macro.desiredVersion,
      revision:
        macro.desiredVersion.startsWith("1.") && macro.desiredVersion.length > 6
          ? macro.desiredVersion.substring(6)
          : "latest",
    };
    hostgroups.forEach((hg) => {
      const obj: SettingsObjectCreate = {
        schemaId: UPDATES_SCHEMA,
        scope: hg.id,
        value: value,
      };
      objects.push(obj);
    });

    const resArr = await settingsObjectsClient.postSettingsObjects({ body: objects, validateOnly: validateOnly });
    const numValid = resArr.filter((res) => res.code == 200).length;
    console.log(`useSyncSettingsFromMacro: ${numValid} / ${resArr.length} valid`, resArr);
    return { total: objects.length, valid: numValid };
  }
  async function hostWriter(macro: Macro, validateOnly: boolean) {
    const hosts: Host[] = queryClient.getQueryData(["hosts", macro.name]) || [];
    const objects: SettingsObjectCreate[] = [];
    const value = {
      updateMode: macro.updateMode,
      maintenanceWindows:
        macro.updateMode == "AUTOMATIC_DURING_MW" ? [{ maintenanceWindow: macro.desiredWindow }] : null,
      targetVersion: macro.desiredVersion.startsWith("1.")
        ? macro.desiredVersion.substring(0, 5)
        : macro.desiredVersion,
      revision:
        macro.desiredVersion.startsWith("1.") && macro.desiredVersion.length > 6
          ? macro.desiredVersion.substring(6)
          : "latest",
    };
    hosts.forEach((host) => {
      const obj: SettingsObjectCreate = {
        schemaId: UPDATES_SCHEMA,
        scope: host.id,
        value: value,
      };
      objects.push(obj);
    });

    const resArr = await settingsObjectsClient.postSettingsObjects({ body: objects, validateOnly: validateOnly });
    const numValid = resArr.filter((res) => res.code == 200).length;
    console.log(`useSyncSettingsFromMacro: ${numValid} / ${resArr.length} valid`, resArr);
    return { total: objects.length, valid: numValid };
  }
  const meta: Meta = {
    errorTitle: "Failed to update settings",
  };

  return useMutation({
    mutationFn: ({ macro, validateOnly = true }: { macro: Macro; validateOnly: boolean }) => {
      if (macro.scope == "host") return hostWriter(macro, validateOnly);
      else return hostgroupWriter(macro, validateOnly);
    },
    meta,
    onSuccess: (data, variables) => {
      const action = variables.validateOnly ? `validated` : `updated`;
      const scope = variables.macro.scope || "hostgroup";
      showToast({
        title: `Settings ${action}`,
        message: `Successfully ${action} settings for ${data.valid}/${data.total} ${scope}s`,
        type: "info",
        lifespan: 4000,
      });
      // trigger a refetch for settings after mutation was successful by invalidating the query
      queryClient.invalidateQueries({ queryKey: ["auto-update-settings", UPDATES_SCHEMA] });
    },
  });
}
