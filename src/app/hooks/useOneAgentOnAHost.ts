import { useQuery } from "@tanstack/react-query";
import { Meta } from "../types/Meta";
import { oneAgentOnAHostClient,HostAgentInfo } from '@dynatrace-sdk/client-classic-environment-v1';
import { OneAgentOnAHostConfig } from "../types/OneAgentOnAHostType";

async function fetcher(config: OneAgentOnAHostConfig) {
      let res = await oneAgentOnAHostClient.getHostsWithSpecificAgents(config);
      const hosts:HostAgentInfo[] = [];
      if(res.hosts)hosts.push(...res.hosts)
      while(res.nextPageKey){
        res = await oneAgentOnAHostClient.getHostsWithSpecificAgents({nextPageKey:res.nextPageKey});
        if(res.hosts)hosts.push(...res.hosts)
      }
      return hosts;
  }
  export const useOneAgentOnAHost = (config: OneAgentOnAHostConfig) => {
    const meta: Meta = {
      errorTitle: "Failed to query oneagents",
    };
    return useQuery({
      queryFn: () => fetcher(config),
      queryKey: ["oneagents", config],
      meta,
    });
  };