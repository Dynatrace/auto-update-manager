import React, { useMemo } from "react";
import {
  ProgressCircle,
  DataTable,
  TableColumn,
  TABLE_EXPANDABLE_DEFAULT_COLUMN,
} from "@dynatrace/strato-components-preview";
import { useMacros } from "../hooks/useMacros";
import { HostGroupCell } from "./HostGroupCell";
import { Macro } from "src/app/types/Types";
import { MaintenanceWindowCell } from "./MaintenanceWindowCell";
import { HostGroupFromMacroDetailTable } from "./HostGroupFromMacroDetailTable";
import { ActionsCell } from "./ActionsCell";
import { Indicator } from "./Indicator";
import { VersionCell } from "./VersionCell";

export const HostGroupMacroTable = () => {
  const macros = useMacros("hostgroup");

  const cols: TableColumn[] = useMemo(
    () => [
      {
        ...TABLE_EXPANDABLE_DEFAULT_COLUMN,
      },
      { accessor: "name", header: "Name", autoWidth: true },
      { accessor: "filter", header: "Filter" },
      { accessor: "updateMode", header: "Update Mode" },
      {
        accessor: "desiredVersion",
        header: "Version",
        cell: ({ value }) => <VersionCell version={value} />,
        autoWidth: true,
      },
      { accessor: "desiredWindow", header: "Window", cell: ({ value }) => <MaintenanceWindowCell window={value} /> },
      { id: "hostgroups", header: "Host Groups", cell: ({ row }) => <HostGroupCell macro={row.original as Macro} /> },
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
          {({ row }: { row: Macro }) => <HostGroupFromMacroDetailTable macro={row} />}
        </DataTable.ExpandableRow>
      </DataTable>
    );
  else return null;
};
