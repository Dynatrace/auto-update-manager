import React from "react";
import { LoadingIndicator, InformationOverlay } from "@dynatrace/strato-components-preview";
import { useHostGroupFromMacro } from "src/app/hooks/useHostGroupFromMacro";
import { Macro, HostGroup } from "src/app/types/Types";
import { Indicator } from "../../Indicator";
import { useSettingsReader } from "src/app/hooks/useSettingsReader";
import { testMaintenanceWindows, displayVersionFromSettings } from "src/app/utils/helperFunctions";

export const HostGroupCell = ({ macro }: { macro: Macro }) => {
  const hostgroupsFromMacroResult = useHostGroupFromMacro(macro);
  const hostGroupsFromSettingsResult = useSettingsReader("builtin:deployment.oneagent.updates", "hostgroup");
  const envSettings = useSettingsReader("builtin:deployment.oneagent.updates", "environment");

  if (hostgroupsFromMacroResult.isError)
    return <Indicator state="critical">{(hostgroupsFromMacroResult.error || "").toString()}</Indicator>;
  else if (hostGroupsFromSettingsResult.isError)
    return <Indicator state="critical">{(hostGroupsFromSettingsResult.error || "").toString()}</Indicator>;
  else if (envSettings.isError) return <Indicator state="critical">{(envSettings.error || "").toString()}</Indicator>;
  else if (hostgroupsFromMacroResult.isLoading || hostGroupsFromSettingsResult.isLoading || envSettings.isLoading)
    return <LoadingIndicator />;

  const hgWithSettings = hostgroupsFromMacroResult.data.filter(
    (hg) => hostGroupsFromSettingsResult?.data?.find((so) => so.scope == hg.id) != undefined
  );
  const hgWithoutSettings = hostgroupsFromMacroResult.data.filter(
    (hg) => hostGroupsFromSettingsResult?.data?.find((so) => so.scope == hg.id) == undefined
  );

  const compliantHostgroups: HostGroup[] = [];
  for (const hgws of hgWithSettings) {
    const settings = hostGroupsFromSettingsResult?.data?.find((so) => so.scope == hgws.id);
    if (
      settings?.value.updateMode == macro.updateMode  &&
      displayVersionFromSettings(settings) == macro.desiredVersion &&
      testMaintenanceWindows(settings?.value.maintenanceWindows,macro.desiredWindow)
    )
      compliantHostgroups.push(hgws);
  }
  if (
    envSettings.data[0].value.updateMode == macro.updateMode &&
    envSettings.data[0].value.targetVersion == macro.desiredVersion &&
    testMaintenanceWindows(envSettings.data[0].value.maintenanceWindows,macro.desiredWindow)
  )
    compliantHostgroups.push(...hgWithoutSettings);

    const hostgroupLimited =
    hostgroupsFromMacroResult.data.length == 1000 ? (
      <InformationOverlay variant="warning">
        <InformationOverlay.Content>Results possibly limited to 1000</InformationOverlay.Content>
      </InformationOverlay>
    ) : (
      <></>
    );

  if (compliantHostgroups.length < 1){
    // debugger;
    return (
      <Indicator state="critical">
        {compliantHostgroups.length} / {hostgroupsFromMacroResult.data.length} {hostgroupLimited}
      </Indicator>
    );}
  else if (compliantHostgroups.length === hostgroupsFromMacroResult.data.length)
    return (
      <Indicator state="success">
        {compliantHostgroups.length} / {hostgroupsFromMacroResult.data.length} {hostgroupLimited}
      </Indicator>
    );
  else
    return (
      <Indicator state="warning">
        {compliantHostgroups.length} / {hostgroupsFromMacroResult.data.length} {hostgroupLimited}
      </Indicator>
    );
};
