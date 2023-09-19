import React from "react";
import { ExternalLink, ProgressCircle } from "@dynatrace/strato-components-preview";
import { getEnvironmentUrl } from "@dynatrace-sdk/app-environment";
import { useDQLHostLookup } from "src/app/hooks/useDQLHostLookup";
import { Indicator } from "./Indicator";

export const HostLink = ({ hostid }: { hostid: string }) => {
  const { data: host, isError, isLoading } = useDQLHostLookup(hostid);
  if (!hostid) return null;
  if (isLoading) {
    return <ProgressCircle size="small" aria-label="Loading..." />;
  }
  if (isError) {
    return <Indicator state="critical">There was an error fetching host lookup</Indicator>;
  }
  const href = `${getEnvironmentUrl()}/ui/apps/dynatrace.classic.hosts/ui/settings/${hostid}/builtin:deployment.oneagent.updates;gtf=-2h;gf=all;tab=general`;
  if (host.length == 1) return <ExternalLink href={href}>{host[0].name}</ExternalLink>;
  else return <ExternalLink href={href}>{hostid}</ExternalLink>;
};
