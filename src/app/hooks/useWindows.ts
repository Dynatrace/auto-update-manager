import { useQuery } from "@tanstack/react-query";
import { Meta } from "../types/Meta";
import {
    deploymentClient,
    GetAgentInstallerAvailableVersionsPathOsType,
    GetAgentInstallerAvailableVersionsPathInstallerType,
  } from "@dynatrace-sdk/client-classic-environment-v1";
  

  async function fetcher() {
    const res = await deploymentClient.getAgentInstallerAvailableVersions({
        osType: GetAgentInstallerAvailableVersionsPathOsType.Unix,
        installerType: GetAgentInstallerAvailableVersionsPathInstallerType.Default,
      });
      return(Array.isArray(res.availableVersions) ? res.availableVersions.sort().reverse() : []);
  }
  
  export function useVersions() {
    const meta: Meta = {
      errorTitle: "Failed to read available versions",
    };
  
    return useQuery({
      queryFn: () => fetcher(),
      queryKey: ["available-versions",],
      meta,
    });
  }
  