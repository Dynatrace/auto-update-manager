import { useVersions } from "./useVersions";
import { useOneAgentOnAHost } from "./useOneAgentOnAHost";

export const useOutdatedAgents = () => {
  const versions = useVersions();
  const agents = useOneAgentOnAHost({ includeDetails: false });

  const faultyAgents = agents.data?.filter((a) => a.faultyVersion == true) || [];
  const currentVersion: number = versions?.data
    ?.map((v) => (typeof v != "undefined" ? parseInt(v.split(".")[1]) : 0))
    .sort((a, b) => b - a)[0] as number;
  const oldestSupported = currentVersion - 24;
  const unsupported = agents.data
    ?.filter((a) => typeof a.hostInfo?.agentVersion != "undefined")
    .filter((a) => (a.hostInfo?.agentVersion?.minor || 0) < oldestSupported)
    || [];
  const older = agents.data
    ?.filter((a) => typeof a.hostInfo?.agentVersion != "undefined")
    .filter((a) => (a.hostInfo?.agentVersion?.minor || 0) < currentVersion - 12)
    || [];

  return {
    isError: versions.isError || agents.isError,
    isLoading: versions.isLoading || agents.isLoading,
    error: versions.error || agents.error,
    faultyAgents,
    unsupported,
    older,
  };
};
