import React from "react";
import { DataTable, LoadingIndicator, TableColumn } from "@dynatrace/strato-components-preview";
import { useSettingsReader } from "src/app/hooks/useSettingsReader";
import { Indicator } from "../Indicator";
import { MaintenanceWindowCell } from "./cells/MaintenanceWindowCell";
import { HostLink } from "../links/HostLink";
import { COL_WIDTH } from "src/app/constants";

export const HostTable = () => {
  const { data, isError, isLoading } = useSettingsReader("builtin:deployment.oneagent.updates", "host");

  if (isLoading) {
    return <LoadingIndicator />;
  }

  if (isError) {
    return <Indicator state="critical">There was an error fetching AutoUpdate settings</Indicator>;
  }

  const cols:TableColumn[] = [
    { accessor: "scope", header: "Scope", cell: ({ value }) => <HostLink hostid={value} />, autoWidth: true },
    { accessor: "value.updateMode", header: "Update Mode", width: COL_WIDTH },
    { accessor: "value.targetVersion", header: "Target Version", width: COL_WIDTH },
    {
      accessor: "value.maintenanceWindows",
      header: "Update Windows",
      cell: ({ value }) => <MaintenanceWindowCell windows={value} />,
    },
  ];

  return <DataTable columns={cols} data={data} />;
};
