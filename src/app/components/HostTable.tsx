import React, { useMemo } from "react";
import { DataTable, ProgressCircle, TableColumn } from "@dynatrace/strato-components-preview";
import { useSettingsReader } from "src/app/hooks/useSettingsReader";
import { Indicator } from "./Indicator";
import { MaintenanceWindowCell } from "./MaintenanceWindowCell";
import { HostLink } from "./HostLink";

export const HostTable = () => {
  const { data, isError, isLoading } = useSettingsReader("builtin:deployment.oneagent.updates", "host");

  const cols: TableColumn[] = useMemo(
    () => [
      {
        accessor: "scope",
        header: "Scope",
        cell: ({ value }) => <HostLink hostid={value} />,
        autoWidth: true,
        minWidth: 250,
      },
      { accessor: "value.updateMode", header: "Update Mode", autoWidth: true },
      { accessor: "value.targetVersion", header: "Target Version", autoWidth: true },
      {
        accessor: "value.maintenanceWindows",
        header: "Update Windows",
        autoWidth: true,
        cell: ({ value }) => <MaintenanceWindowCell windows={value} />,
      },
    ],
    []
  );

  if (isLoading) {
    return <ProgressCircle size="small" aria-label="Loading..." />;
  }

  if (isError) {
    return <Indicator state="critical">There was an error fetching AutoUpdate settings</Indicator>;
  }

  return (
    <DataTable columns={cols} data={data} fullWidth>
      <DataTable.Pagination defaultPageSize={10} />
    </DataTable>
  );
};
