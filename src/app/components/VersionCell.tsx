import React from "react";
import { InformationOverlay } from "@dynatrace/strato-components-preview";
import { useVersions } from "src/app/hooks/useVersions";

interface VersionCellProps {
  version: string;
}

export const VersionCell = ({ version }: VersionCellProps) => {
  const versionsRes = useVersions();

  if (versionsRes.isError || versionsRes.isLoading) return <>{version}</>;

  if (!versionsRes.data.includes(version) && !["latest", "previous", "older"].includes(version))
    return (
      <>
        <InformationOverlay variant="critical">
          <InformationOverlay.Content>Version no longer valid</InformationOverlay.Content>
        </InformationOverlay>
        {version}
      </>
    );
  return <>{version}</>;
};
