import React from "react";
import { ExternalLink } from "@dynatrace/strato-components-preview";
import { getEnvironmentUrl } from "@dynatrace-sdk/app-environment";
import { HostGroup } from "src/app/types/Types";

export const HostGroupLink = ({ hostgroup }: { hostgroup?: HostGroup }) => {
  if (!hostgroup) return <></>;
  const href = `${getEnvironmentUrl()}/ui/apps/dynatrace.classic.hosts/ui/settings/${
    hostgroup.id
  }/builtin:deployment.oneagent.updates?gtf=-2h&gf=all`;
  return <ExternalLink href={href} key={hostgroup.id}>{hostgroup.name}</ExternalLink>;
};
