import { SettingsObject } from "@dynatrace-sdk/client-classic-environment-v2";
import { AgentVersion } from "@dynatrace-sdk/client-classic-environment-v1";

const testMaintenanceWindows = (windows = [], window: string) => {
  if (window == "" && windows.length == 0) return true;
  return JSON.stringify(windows) == JSON.stringify([{ maintenanceWindow: window }]);
};

const displayVersionFromSettings = (settings: SettingsObject) => {
  if (settings.value.targetVersion == undefined) return "";
  if (settings.value.targetVersion.startsWith("1.")) {
    if (typeof settings.value.revision == "string" && settings.value.revision.match(/[0-9\.]+/))
      return settings.value.targetVersion + "." + settings.value.revision;
  } else return settings.value.targetVersion;
};

const agentVersionToString = (version?: AgentVersion) => {
  if (typeof version === "undefined") return "";
const {major, minor, revision, timestamp } = version;
return `${major}.${minor}.${revision}.${timestamp}`;
};

export { testMaintenanceWindows, displayVersionFromSettings, agentVersionToString };
