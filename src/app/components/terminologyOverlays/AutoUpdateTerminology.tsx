import React from "react";
import { TerminologyOverlay, ExternalLink } from "@dynatrace/strato-components-preview";

export const AutoUpdateTerminology = () => {
  return (
    <TerminologyOverlay>
      <TerminologyOverlay.Trigger>AutoUpdate</TerminologyOverlay.Trigger>
      <TerminologyOverlay.Description>
        Dynatrace is built with manageablility at large scale in mind. Keeping OneAgents up to date is important to
        ensure you have the latest technology support. With Automatic updates, keeping up to date is easy at large
        scale.
      </TerminologyOverlay.Description>
      <TerminologyOverlay.Footer>
        <ExternalLink href="https://www.dynatrace.com/support/help/shortlink/oneagent-update">Learn more</ExternalLink>
      </TerminologyOverlay.Footer>
    </TerminologyOverlay>
  );
};
