import React from "react";
import { DataTable, ProgressCircle, TableColumn } from "@dynatrace/strato-components-preview";
import { useSettingsReader } from "src/app/hooks/useSettingsReader";
import { Indicator } from "./Indicator";
import { MaintenanceWindowCell } from "./MaintenanceWindowCell";

export const EnvironmentTable = () => {
  const { data, isError, isLoading } = useSettingsReader("builtin:deployment.oneagent.updates", "environment");

  if (isLoading) {
    return <ProgressCircle size="small" aria-label="Loading..." />;
  }

  if (isError) {
    return <Indicator state="critical">There was an error fetching AutoUpdate settings</Indicator>;
  }

  const cols: TableColumn[] = [
    { accessor: "scope", header: "Scope", autoWidth: true },
    { accessor: "value.updateMode", header: "Update Mode" },
    { accessor: "value.targetVersion", header: "Target Version" },
    {
      accessor: "value.maintenanceWindows",
      header: "Update Windows",
      cell: ({ value }) => <MaintenanceWindowCell windows={value} />,
    },
  ];

  return (
    <div>
      <DataTable columns={cols} data={data} fullWidth />
    </div>
  );
};
