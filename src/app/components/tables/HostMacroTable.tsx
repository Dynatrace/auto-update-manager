import React from "react";
import {
  LoadingIndicator,
  DataTable,
  TableColumn,
  TABLE_EXPANDABLE_DEFAULT_COLUMN,
} from "@dynatrace/strato-components-preview";
import { useMacros } from "../../hooks/useMacros";
import { HostCell } from "./cells/HostCell";
import { Macro } from "src/app/types/Types";
import { MaintenanceWindowCell } from "./cells/MaintenanceWindowCell";
import { HostFromMacroDetailTable } from "./HostFromMacroDetailTable";
import { ActionsCell } from "./cells/ActionsCell";
import { Indicator } from "../Indicator";
import { VersionCell } from "./cells/VersionCell";

export const HostMacroTable = () => {
  const macros = useMacros("host");

  const cols: TableColumn[] = [
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
    { id: "hosts", header: "Hosts", cell: ({ row }) => <HostCell macro={row.original as Macro} /> },
    { id: "actions", header: "", alignment: "right", cell: ({ row }) => <ActionsCell macro={row.original as Macro} /> },
  ];
  
  if (macros.isError) return <Indicator state="critical">{(macros.error || "").toString()}</Indicator>;
  else if (macros.isLoading) return <LoadingIndicator />;
  if (Array.isArray(macros.data))
    return (
      <DataTable columns={cols} data={macros.data} fullWidth>
        <DataTable.ExpandableRow>
          {({ row }: { row: Macro }) => <HostFromMacroDetailTable macro={row} />}
        </DataTable.ExpandableRow>
      </DataTable>
    );
  else return <></>;
};
