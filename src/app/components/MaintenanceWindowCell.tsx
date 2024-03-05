import React from "react";
import { ProgressCircle } from "@dynatrace/strato-components-preview";
import { ErrorIcon } from "@dynatrace/strato-icons";
import { useSettingsReader } from "src/app/hooks/useSettingsReader";
import { MaintenanceWindow } from "src/app/types/Types";

type MaintenanceWindowCellProps = {
  windows?: MaintenanceWindow[];
  window?: string;
};

export const MaintenanceWindowCell = ({ windows, window }: MaintenanceWindowCellProps) => {
  const { data, isLoading, isError } = useSettingsReader("builtin:deployment.management.update-windows");

  if (isLoading) return <ProgressCircle size="small" aria-label="Loading..." />;

  if (isError) return <ErrorIcon />;

  const windowNames: string[] = [];
  if (Array.isArray(windows))
    windowNames.push(
      ...windows?.map((w) =>
        w.maintenanceWindow !== undefined
          ? data?.find((d) => d.objectId == w.maintenanceWindow)?.value?.name || w.maintenanceWindow
          : ""
      )
    );
  if (typeof window == "string" && window.length) windowNames.push(data.find((d) => d.objectId == window)?.value?.name);

  return <>{windowNames.join(", ")}</>;
};
