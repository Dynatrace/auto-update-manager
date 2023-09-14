import React from "react";
import { TerminologyOverlay, ExternalLink } from "@dynatrace/strato-components-preview";

export const HostgroupTerminology = () => {
  return (
    <TerminologyOverlay>
      <TerminologyOverlay.Trigger>Host groups</TerminologyOverlay.Trigger>
      <TerminologyOverlay.Description>
        Host groups help to control configuration for hosts at scale. A host can belong to only one host group. The host
        group for a host may be changed only with "oneagentctl" or via{" "}
        <ExternalLink href="https://www.dynatrace.com/support/help/shortlink/api-v2-remote-configuration#oneagent">
          API
        </ExternalLink>
        .
      </TerminologyOverlay.Description>
      <TerminologyOverlay.Footer>
        <ExternalLink href="https://www.dynatrace.com/support/help/shortlink/host-groups">
          Learn more about host groups
        </ExternalLink>
      </TerminologyOverlay.Footer>
    </TerminologyOverlay>
  );
};
