import React from "react";
import { ProgressCircle, InformationOverlay } from "@dynatrace/strato-components-preview";
import { useHostFromMacro } from "src/app/hooks/useHostFromMacro";
import { Macro, Host } from "src/app/types/Types";
import { Indicator } from "../../Indicator";
import { useSettingsReader } from "src/app/hooks/useSettingsReader";
import { testMaintenanceWindows, displayVersionFromSettings } from "src/app/utils/helperFunctions";

export const HostCell = ({ macro }: { macro: Macro }) => {
  const hostsFromMacroResult = useHostFromMacro(macro);
  const hostsFromSettingsResult = useSettingsReader("builtin:deployment.oneagent.updates", "host");
  const envSettings = useSettingsReader("builtin:deployment.oneagent.updates", "environment");

  if (hostsFromMacroResult.isError)
    return <Indicator state="critical">{(hostsFromMacroResult.error || "").toString()}</Indicator>;
  else if (hostsFromSettingsResult.isError)
    return <Indicator state="critical">{(hostsFromSettingsResult.error || "").toString()}</Indicator>;
  else if (envSettings.isError) return <Indicator state="critical">{(envSettings.error || "").toString()}</Indicator>;
  else if (hostsFromMacroResult.isLoading || hostsFromSettingsResult.isLoading || envSettings.isLoading)
    return <ProgressCircle size="small" aria-label="Loading..." />;

  const hostsWithSettings = hostsFromMacroResult.data.filter(
    (host) => hostsFromSettingsResult?.data?.find((so) => so.scope == host.id) != undefined
  );
  const hostWithoutSettings = hostsFromMacroResult.data.filter(
    (host) => hostsFromSettingsResult?.data?.find((so) => so.scope == host.id) == undefined
  );

  const compliantHosts: Host[] = [];
  for (const hostws of hostsWithSettings) {
    const settings = hostsFromSettingsResult?.data?.find((so) => so.scope == hostws.id);
    if (
      settings?.value.updateMode == macro.updateMode &&
      displayVersionFromSettings(settings) == macro.desiredVersion &&
      testMaintenanceWindows(settings?.value.maintenanceWindows, macro.desiredWindow)
    )
      compliantHosts.push(hostws);
  }
  if (
    envSettings.data[0].value.updateMode == macro.updateMode &&
    envSettings.data[0].value.targetVersion == macro.desiredVersion &&
    testMaintenanceWindows(envSettings.data[0].value.maintenanceWindows, macro.desiredWindow)
  )
    compliantHosts.push(...hostWithoutSettings);

  const hostLimited =
    hostsFromMacroResult.data.length == 1000 ? (
      <InformationOverlay variant="warning">
        <InformationOverlay.Content>Results possibly limited to 1000</InformationOverlay.Content>
      </InformationOverlay>
    ) : (
      <></>
    );

  if (compliantHosts.length < 1) {
    // debugger;
    return (
      <Indicator state="critical">
        {compliantHosts.length} / {hostsFromMacroResult.data.length} {hostLimited}
      </Indicator>
    );
  } else if (compliantHosts.length === hostsFromMacroResult.data.length)
    return (
      <Indicator state="success">
        {compliantHosts.length} / {hostsFromMacroResult.data.length} {hostLimited}
      </Indicator>
    );
  else
    return (
      <Indicator state="warning">
        {compliantHosts.length} / {hostsFromMacroResult.data.length} {hostLimited}
      </Indicator>
    );
};
