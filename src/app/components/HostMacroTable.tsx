import React, { useMemo } from "react";
import {
  ProgressCircle,
  DataTable,
  TableColumn,
  TABLE_EXPANDABLE_DEFAULT_COLUMN,
} from "@dynatrace/strato-components-preview";
import { useMacros } from "../hooks/useMacros";
import { HostCell } from "./HostCell";
import { Macro } from "src/app/types/Types";
import { MaintenanceWindowCell } from "./MaintenanceWindowCell";
import { HostFromMacroDetailTable } from "./HostFromMacroDetailTable";
import { ActionsCell } from "./ActionsCell";
import { Indicator } from "./Indicator";
import { VersionCell } from "./VersionCell";

export const HostMacroTable = () => {
  const macros = useMacros("host");

  const cols: TableColumn[] = useMemo(
    () => [
      {
        ...TABLE_EXPANDABLE_DEFAULT_COLUMN,
      },
      { accessor: "name", header: "Name", autoWidth: true },
      { accessor: "filter", header: "Filter", autoWidth: true },
      { accessor: "updateMode", header: "Update Mode", autoWidth: true },
      {
        accessor: "desiredVersion",
        header: "Version",
        cell: ({ value }) => <VersionCell version={value} />,
        autoWidth: true,
      },
      { accessor: "desiredWindow", header: "Window", autoWidth: true, cell: ({ value }) => <MaintenanceWindowCell window={value} /> },
      { id: "hosts", header: "Hosts", autoWidth: true, cell: ({ row }) => <HostCell macro={row.original as Macro} /> },
      {
        id: "actions",
        header: "",
        alignment: "right",
        cell: ({ row }) => <ActionsCell macro={row.original as Macro} />,
        maxWidth: 100,
        autoWidth: true,
      },
    ],
    []
  );

  if (macros.isError) return <Indicator state="critical">{(macros.error || "").toString()}</Indicator>;
  else if (macros.isLoading) return <ProgressCircle size="small" aria-label="Loading..." />;
  
  if (Array.isArray(macros.data))
    return (
      <DataTable columns={cols} data={macros.data} fullWidth>
        <DataTable.ExpandableRow>
          {({ row }: { row: Macro }) => <HostFromMacroDetailTable macro={row} />}
        </DataTable.ExpandableRow>
      </DataTable>
    );
  else return null;
};
